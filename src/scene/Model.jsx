import { Component, Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { assetUrl } from '../lib/assetUrl.js'
import { getModelStatus, reportModelError, setModelCacheClear, subscribeModelStatus } from '../state/modelStatus.js'
import { debugEnabled } from './Debug.jsx'
import { sanitize } from './modelLifecycle.js'

const modelUrl = (file) => assetUrl(`3d/${file}`)

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

function LoadedModel({ model }) {
  const gltf = useGLTF(modelUrl(model.file))
  const scene = useMemo(() => {
    const clean = sanitize(gltf).scene
    if (debugEnabled) {
      const { min, max } = new THREE.Box3().setFromObject(clean)
      window.__modelBounds = { ...window.__modelBounds, [model.file]: { min: min.toArray(), max: max.toArray() } }
    }
    return clean.clone(true)
  }, [gltf, model.file])

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
export default function Model({ model, children }) {
  const status = useSyncExternalStore(subscribeModelStatus, getModelStatus)
  const attempt = status.attempts[model.file] ?? 0
  return (
    <ModelBoundary key={attempt} file={model.file}>
      <Suspense fallback={model.draco ? <DracoWatchdog /> : null}>
        <LoadedModel model={model} />
        {children}
      </Suspense>
    </ModelBoundary>
  )
}
