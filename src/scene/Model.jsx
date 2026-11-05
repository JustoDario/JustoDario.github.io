import { Component, Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { clone as cloneWithSkeletons } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { assetUrl } from '../lib/assetUrl.js'
import { note } from '../lib/diagnostics.js'
import { getModelStatus, reportModelError, reportModelLoaded, setModelCacheClear, subscribeModelStatus } from '../state/modelStatus.js'
import { debugEnabled } from './Debug.jsx'
import { modelUrl, noteModelLoaded, noteModelRequested, sanitize } from './modelLifecycle.js'

setModelCacheClear((file) => useGLTF.clear(modelUrl(file)))

// A failed download of the Draco decoder never settles the load, so no error ever arrives,
// and only a new page can recover: the decoder promise stays stuck. So ask for its files
// directly. A slow line is not a failure: the clock for a decoder that does not respond only
// starts once its files have arrived.
const DRACO_FILES = ['draco_decoder.wasm', 'draco_wasm_wrapper.js']
const DRACO_STUCK_MS = 120000

function DracoWatchdog() {
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let timer
    const files = DRACO_FILES.map(async (file) => {
      const response = await fetch(assetUrl(`draco/${file}`))
      if (!response.ok) throw new Error(`${file}: ${response.status}`)
      await response.arrayBuffer()
    })
    let unmounted = false
    Promise.all(files).then(
      () => {
        if (!unmounted) timer = setTimeout(() => setFailed(true), DRACO_STUCK_MS)
      },
      () => setFailed(true),
    )
    return () => {
      unmounted = true
      clearTimeout(timer)
    }
  }, [])
  if (failed) throw Object.assign(new Error('Draco decoder did not respond'), { needsReload: true })
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

// Coming on show, a robot turns towards its pose and grows slightly. Transforms only:
// materials are shared with the other station of the same model.
const ENTRANCE_MS = 1100
const ENTRANCE_SCALE = 0.8
const ENTRANCE_TURN = 0.5

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

function LoadedModel({ model, warm, isShown }) {
  noteModelRequested(model.file)
  const gltf = useGLTF(modelUrl(model.file))
  const scene = useMemo(() => {
    const clean = sanitize(gltf).scene
    if (debugEnabled) {
      const { min, max } = new THREE.Box3().setFromObject(clean)
      window.__modelBounds = { ...window.__modelBounds, [model.file]: { min: min.toArray(), max: max.toArray() } }
    }
    noteModelLoaded(model.file, gltf)
    return cloneWithSkeletons(clean) // a plain clone would leave skinned meshes on the bones of the original
  }, [gltf, model.file])
  useWarmUp(scene, warm)
  useEffect(() => {
    note(`${model.file} decoded`)
    reportModelLoaded(model.file)
  }, [model.file])

  const group = useRef()
  const entrance = useRef()
  const wasShown = useRef(false)
  const entranceStart = useRef(null)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  useFrame(({ clock, invalidate }) => {
    if (reduced) return
    group.current.rotation.y = model.rotationY + Math.sin(clock.elapsedTime * SWAY_SPEED) * SWAY_AMOUNT

    const shown = isShown()
    if (shown && !wasShown.current) entranceStart.current = performance.now()
    wasShown.current = shown
    if (entranceStart.current === null) return
    const progress = Math.min((performance.now() - entranceStart.current) / ENTRANCE_MS, 1)
    const eased = 1 - (1 - progress) ** 3
    entrance.current.scale.setScalar(ENTRANCE_SCALE + (1 - ENTRANCE_SCALE) * eased)
    entrance.current.rotation.y = ENTRANCE_TURN * (1 - eased)
    // A playing video pauses the render loop: the entrance still has to finish.
    if (progress === 1) entranceStart.current = null
    else invalidate()
  })

  return (
    <group ref={group} rotation-y={model.rotationY}>
      <group ref={entrance}>
        <primitive object={scene} scale={model.scale} position={model.offset} rotation={model.rotation ?? [0, 0, 0]} />
      </group>
    </group>
  )
}

// children render after the model and inside the same Suspense: the shadow bakes
// what is already there.
export default function Model({ model, warm, isShown, children }) {
  const status = useSyncExternalStore(subscribeModelStatus, getModelStatus)
  const attempt = status.attempts[model.file] ?? 0
  return (
    <ModelBoundary key={attempt} file={model.file}>
      <Suspense fallback={model.draco ? <DracoWatchdog /> : null}>
        <LoadedModel model={model} warm={warm} isShown={isShown} />
        {children}
      </Suspense>
    </ModelBoundary>
  )
}
