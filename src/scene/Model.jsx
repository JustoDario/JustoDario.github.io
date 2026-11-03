import { Component, Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getModelStatus, reportModelError, setModelCacheClear, subscribeModelStatus } from '../state/modelStatus.js'
import { debugEnabled } from './Debug.jsx'
import { modelUrl, noteModelLoaded, noteModelRequested, sanitize } from './modelLifecycle.js'

setModelCacheClear((file) => useGLTF.clear(modelUrl(file)))

// A failed download of the Draco decoder never settles the load, so no error ever
// arrives, and only a new page can recover: the decoder promise stays stuck.
const DRACO_TIMEOUT_MS = 30000

function DracoWatchdog() {
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), DRACO_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [])
  if (timedOut) throw Object.assign(new Error('Draco decoder did not respond'), { needsReload: true })
  return null
}

class ModelBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn(`Model ${this.props.file} unavailable:`, error.message)
    reportModelError(this.props.file, error.needsReload ? 'reload' : 'retry')
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

const SWAY_SPEED = 0.35
const SWAY_AMOUNT = 0.14

// One at a time, so several models arriving together do not add up to one long frame.
let warmUpQueue = Promise.resolve()

// Compiles the shaders and uploads the textures while the camera is stopped, so that
// the first frame on arrival has nothing left to do. The geometry goes up in the shadow
// bake. Rendering to a target would not do: it selects another variant of each shader,
// without tone mapping, and the one for the screen would still compile on arrival.
function useWarmUp(object, enabled) {
  const gl = useThree((state) => state.gl)
  const root = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const wasEnabled = useRef(enabled) // decided once, on arrival of the model

  useEffect(() => {
    if (!wasEnabled.current) return undefined
    let cancelled = false
    warmUpQueue = warmUpQueue.then(async () => {
      if (cancelled || gl.getContext().isContextLost()) return
      if (gl.getContext().getExtension('KHR_parallel_shader_compile')) {
        await gl.compileAsync(object, camera, root).catch(() => {})
      } else {
        gl.compile(object, camera, root)
      }
      if (cancelled || gl.getContext().isContextLost()) return
      object.traverse(({ material }) => {
        for (const item of [material].flat()) {
          for (const value of Object.values(item ?? {})) if (value?.isTexture) gl.initTexture(value)
        }
      })
    })
    return () => {
      cancelled = true
    }
  }, [gl, root, camera, object])
}

function LoadedModel({ model, warm }) {
  noteModelRequested(model.file)
  const gltf = useGLTF(modelUrl(model.file))
  const scene = useMemo(() => {
    const clean = sanitize(gltf).scene
    if (debugEnabled) {
      const { min, max } = new THREE.Box3().setFromObject(clean)
      window.__modelBounds = { ...window.__modelBounds, [model.file]: { min: min.toArray(), max: max.toArray() } }
    }
    noteModelLoaded(model.file, gltf)
    return clean.clone(true)
  }, [gltf, model.file])
  useWarmUp(scene, warm)

  const group = useRef()
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  useFrame(({ clock }) => {
    if (!reduced) group.current.rotation.y = model.rotationY + Math.sin(clock.elapsedTime * SWAY_SPEED) * SWAY_AMOUNT
  })

  return (
    <group ref={group} rotation-y={model.rotationY}>
      <primitive object={scene} scale={model.scale} position={model.offset} />
    </group>
  )
}

// children render after the model and inside the same Suspense: the shadow bakes
// what is already there.
export default function Model({ model, warm, children }) {
  const status = useSyncExternalStore(subscribeModelStatus, getModelStatus)
  const attempt = status.attempts[model.file] ?? 0
  return (
    <ModelBoundary key={attempt} file={model.file}>
      <Suspense fallback={model.draco ? <DracoWatchdog /> : null}>
        <LoadedModel model={model} warm={warm} />
        {children}
      </Suspense>
    </ModelBoundary>
  )
}
