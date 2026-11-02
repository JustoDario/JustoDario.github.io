import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { assetUrl } from '../lib/assetUrl.js'
import SmokeModel from './SmokeModel.jsx'

// Must run before the first GLB load, otherwise drei falls back to a CDN.
// Imports evaluate first, so never call useGLTF.preload at module level.
useGLTF.setDecoderPath(assetUrl('draco/'))

const canvasStyle = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 'var(--z-scene)',
  pointerEvents: 'none',
}

// The only <Canvas> in the app. It stays mounted for the whole session.
export default function GlobalCanvas({ smokeUrl }) {
  return (
    <Canvas
      style={canvasStyle}
      gl={{ alpha: true, antialias: true }}
      resize={{ scroll: false }}
      camera={{ position: [0, 0.6, 2.4], fov: 35 }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 2]} intensity={2} />
      {smokeUrl ? (
        <Suspense fallback={null}>
          <SmokeModel url={smokeUrl} />
        </Suspense>
      ) : (
        <mesh rotation={[0.5, 0.6, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#8fa3d0" />
        </mesh>
      )}
    </Canvas>
  )
}
