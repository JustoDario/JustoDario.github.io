import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MODELS } from '../data/models.js'
import { assetUrl } from '../lib/assetUrl.js'
import { useNavigation } from '../state/NavigationProvider.jsx'
import { reportContextLost, reportContextRestored, watchForWebGL } from '../state/sceneHealth.js'
import CameraRig from './CameraRig.jsx'
import Lighting from './Lighting.jsx'
import { Dust } from './Atmosphere.jsx'
import { releaseModels } from './modelLifecycle.js'
import RobotStation from './RobotStation.jsx'
import { DebugProbe, debugEnabled } from './Debug.jsx'
import { computeWindow, STATIONS } from './stations.js'

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

// Waits this long after the window last changed, so that scrolling back and forth
// around a border does not free and reload a model each time.
const RELEASE_AFTER_MS = 1500

// Stations in the window are mounted at once. During a trip nothing leaves and nothing
// but the destination enters; once the camera has settled, what is out goes, and two
// frames later, when nothing can still be drawing it, its memory is freed.
function Exhibition() {
  const { station, approaching } = useNavigation()
  // Derived, not reported by the camera: it has to be true in the very render where
  // the station changes, or the neighbours of the destination would start to download.
  const [arrivedAt, setArrivedAt] = useState(station.x)
  const traveling = station.x !== arrivedAt
  const wanted = computeWindow(station, approaching, traveling)
  const wantedKey = wanted.map((s) => s.id).join()
  const latest = useRef(wanted)
  latest.current = wanted

  // Everything wanted since the last release stays, so that changing destination never
  // takes away the robot that is still on screen.
  const kept = useRef(new Set())
  wanted.forEach((s) => kept.current.add(s))
  const [, redraw] = useState(0)

  // The robots on show and where they are, written by the camera rig.
  const layout = useRef(new Map([[station.id, station.x]]))
  if (debugEnabled) window.__layout = layout.current

  useEffect(() => {
    if (traveling) return undefined
    let frame
    const timer = setTimeout(() => {
      kept.current = new Set(latest.current)
      redraw((n) => n + 1)
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          releaseModels(new Set(latest.current.map((s) => MODELS[s.model].file)))
        })
      })
    }, RELEASE_AFTER_MS)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [wantedKey, traveling])

  return (
    <>
      <CameraRig onArrive={setArrivedAt} layout={layout} />
      {STATIONS.filter((s) => kept.current.has(s)).map((s) => (
        <RobotStation key={s.id} station={s} warm={!traveling && s !== station} layout={layout} />
      ))}
    </>
  )
}

// The only <Canvas> in the app. It stays mounted for the session, except that a
// restored WebGL context gets a fresh one: everything on the GPU is gone by then,
// including the baked shadows and the environment map, which only render once.
export default function GlobalCanvas() {
  const [generation, setGeneration] = useState(0)
  const onCreated = ({ gl }) => {
    const canvas = gl.domElement
    let stopWatching = () => {}
    const rebuild = () => {
      stopWatching()
      // Replacing the canvas loses the old context on purpose: that is not news.
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', rebuild)
      reportContextRestored()
      setGeneration((g) => g + 1)
    }
    const onLost = () => {
      reportContextLost()
      stopWatching = watchForWebGL(rebuild)
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', rebuild)
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
      <Lighting />
      <Dust />
      <Exhibition />
      {debugEnabled && <DebugProbe />}
    </Canvas>
  )
}
