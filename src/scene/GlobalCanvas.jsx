import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { assetUrl } from '../lib/assetUrl.js'
import { useNavigation } from '../state/NavigationProvider.jsx'
import CameraRig from './CameraRig.jsx'
import Lighting from './Lighting.jsx'
import { Dust } from './Atmosphere.jsx'
import RobotStation from './RobotStation.jsx'
import { DebugProbe, debugEnabled } from './Debug.jsx'
import { RAIL_LENGTH, STATIONS } from './stations.js'

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
// Pixel density is the most expensive setting that is hard to see on a slow exhibit.
const MAX_DPR = [1, 1.5]

const glOptions = { alpha: true, antialias: true, toneMapping: THREE.NeutralToneMapping }

// Stops drawing while a video plays. Demand mode, not never: a resize still redraws,
// and the last frame stays on screen otherwise.
function PauseDuringVideo() {
  const { videoPlaying } = useNavigation()
  const setFrameloop = useThree((state) => state.setFrameloop)
  useEffect(() => setFrameloop(videoPlaying ? 'demand' : 'always'), [videoPlaying, setFrameloop])
  return null
}

// Provisional until Hito 6 frees what is out of range: a station mounts when the
// camera reaches it or its neighbour, and stays, so the page does not download
// the six robots up front.
function RobotStations() {
  const { station } = useNavigation()
  const reached = useRef(new Set())
  const index = STATIONS.indexOf(station)
  for (const i of [index - 1, index, index + 1]) if (STATIONS[i]?.model) reached.current.add(STATIONS[i])
  return [...reached.current].map((s) => <RobotStation key={s.id} station={s} />)
}

// The only <Canvas> in the app. It stays mounted for the session, except that a
// restored WebGL context gets a fresh one: everything on the GPU is gone by then,
// including the baked shadows and the environment map, which only render once.
export default function GlobalCanvas() {
  const [generation, setGeneration] = useState(0)
  const onCreated = ({ gl }) => {
    gl.domElement.addEventListener('webglcontextrestored', () => setGeneration((g) => g + 1), { once: true })
  }

  return (
    <Canvas
      key={generation}
      style={canvasStyle}
      gl={glOptions}
      dpr={MAX_DPR}
      resize={{ scroll: false }}
      camera={{ fov: 30 }}
      onCreated={onCreated}
    >
      <PauseDuringVideo />
      <CameraRig />
      <Lighting />
      <Dust center={RAIL_LENGTH / 2} length={RAIL_LENGTH} />
      <RobotStations />
      {debugEnabled && <DebugProbe />}
    </Canvas>
  )
}
