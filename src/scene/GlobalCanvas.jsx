import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { assetUrl } from '../lib/assetUrl.js'
import CameraRig from './CameraRig.jsx'
import Lighting from './Lighting.jsx'
import { Dust } from './Atmosphere.jsx'
import TestExhibits from './TestExhibits.jsx'
import SmokeModel from './SmokeModel.jsx'
import { DebugProbe, debugEnabled } from './Debug.jsx'
import { RAIL_LENGTH } from './rail.js'

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

// Neutral keeps whites and material colours true against the light background;
// the default ACES mapping would grey them out.
const glOptions = { alpha: true, antialias: true, toneMapping: THREE.NeutralToneMapping }

// The only <Canvas> in the app. It stays mounted for the whole session.
export default function GlobalCanvas({ smokeUrl, stationX }) {
  return (
    <Canvas style={canvasStyle} gl={glOptions} resize={{ scroll: false }} camera={{ fov: 30 }}>
      <CameraRig stationX={stationX} />
      <Lighting />
      <Dust center={RAIL_LENGTH / 2} length={RAIL_LENGTH} />
      {smokeUrl ? (
        <Suspense fallback={null}>
          <SmokeModel url={smokeUrl} />
        </Suspense>
      ) : (
        <TestExhibits />
      )}
      {debugEnabled && <DebugProbe />}
    </Canvas>
  )
}
