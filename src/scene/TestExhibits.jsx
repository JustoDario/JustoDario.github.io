import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { assetUrl } from '../lib/assetUrl.js'
import { sanitize } from './modelLifecycle.js'
import { Halo } from './Atmosphere.jsx'
import BakedShadow from './BakedShadow.jsx'
import { STATIONS } from './stations.js'

// Provisional until Hito 5: real Coco, neutral shapes for the other five robots.
const COCO_SCALE = 2.1
const COCO_LIFT = 0.258 // lowest point of the model, from its glTF bounds
const COCO_CENTER_X = 0.028

function useExhibitSway(amount = 0.14) {
  const group = useRef()
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  useFrame(({ clock }) => {
    if (!reduced && group.current) group.current.rotation.y = -0.5 + Math.sin(clock.elapsedTime * 0.35) * amount
  })
  return group
}

function Coco({ x }) {
  const gltf = useGLTF(assetUrl('3d/coco1.glb'))
  const scene = useMemo(() => sanitize(gltf).scene.clone(true), [gltf])
  const group = useExhibitSway()
  return (
    <group position={[x, 0, 0]} scale={COCO_SCALE}>
      <group ref={group}>
        <primitive object={scene} position={[COCO_CENTER_X, COCO_LIFT, 0]} />
      </group>
    </group>
  )
}

function NeutralShapes({ x }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[-0.55, 0.4, 0]} rotation={[0, 0.6, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#8fa3d0" roughness={0.55} />
      </mesh>
      <mesh position={[0.6, 0.42, 0.1]}>
        <sphereGeometry args={[0.42, 48, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.12} />
      </mesh>
    </group>
  )
}

// Shadows are baked after their exhibit mounts, so each sits inside the same
// Suspense boundary and renders after it. Empty stations stay empty, without a halo.
export default function TestExhibits() {
  return STATIONS.filter((station) => station.model).map(({ id, x, model }) => (
    <group key={id}>
      <Halo x={x} />
      {model === 'coco1' ? (
        <Suspense fallback={null}>
          <Coco x={x} />
          <BakedShadow x={x} />
        </Suspense>
      ) : (
        <>
          <NeutralShapes x={x} />
          <BakedShadow x={x} />
        </>
      )}
    </group>
  ))
}
