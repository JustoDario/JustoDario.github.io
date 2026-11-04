import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { noted } from '../lib/diagnostics.js'
import { LOOK_AT_HEIGHT } from './rail.js'

export const debugEnabled = new URLSearchParams(window.location.search).has('debug')

const focus = new THREE.Vector3()
const stats = { railX: 0, focusX: 0, fps: 0, worstMs: 0, calls: 0, triangles: 0, geometries: 0, textures: 0, programs: 0 }

// Inside the Canvas. Resets renderer.info once per frame, so passes rendered
// before the main one (shadow bakes, for example) are counted too.
export function DebugProbe() {
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const window_ = useRef({ start: 0, frames: 0, worst: 0, last: 0 })

  useEffect(() => {
    gl.info.autoReset = false
    return () => {
      gl.info.autoReset = true
    }
  }, [gl])

  useFrame(() => {
    const now = performance.now()
    const w = window_.current
    if (w.last) w.worst = Math.max(w.worst, now - w.last)
    w.last = now
    w.frames++
    if (!w.start) w.start = now
    if (now - w.start >= 500) {
      stats.fps = (w.frames * 1000) / (now - w.start)
      stats.worstMs = w.worst
      w.start = now
      w.frames = 0
      w.worst = 0
    }
    // Where the rail's centre lands on screen, in -1..1: shows the view offset.
    focus.set(camera.position.x, LOOK_AT_HEIGHT, 0).project(camera)
    stats.railX = camera.position.x
    stats.focusX = focus.x
    window.__rail = { x: stats.railX, focusX: stats.focusX, focusY: focus.y, z: camera.position.z }
    stats.calls = gl.info.render.calls
    stats.triangles = gl.info.render.triangles
    stats.geometries = gl.info.memory.geometries
    stats.textures = gl.info.memory.textures
    stats.programs = gl.info.programs?.length ?? 0
    gl.info.reset()
  }, -1)

  return null
}

// What a phone can and cannot do, readable without developer tools.
function environment() {
  const video = document.createElement('video')
  const can = (type) => video.canPlayType(type) || 'no'
  return [
    navigator.userAgent.replace(/Mozilla\/5\.0 /, '').slice(0, 90),
    `AV1  opus ${can('video/mp4; codecs="av01.0.05M.08, opus"')} | mp4a ${can('video/mp4; codecs="av01.0.05M.08, mp4a.40.2"')}`,
    `H264 ${can('video/mp4; codecs="avc1.64001F, mp4a.40.2"')}`,
  ].join('\n')
}

const loadTimes = () =>
  performance
    .getEntriesByType('resource')
    .filter(({ name }) => /\/3d\/|GlobalCanvas|Debug-|draco/.test(name))
    .map(({ name, startTime, responseEnd, transferSize }) => `${name.split('/').pop().slice(0, 22).padEnd(22)} ${(startTime / 1000).toFixed(2)}-${(responseEnd / 1000).toFixed(2)}s ${Math.round(transferSize / 1024)}KB`)
    .join('\n')

// Outside the Canvas: plain HTML that polls the numbers.
export function DebugPanel() {
  const [shown, setShown] = useState(stats)
  useEffect(() => {
    const id = setInterval(() => setShown({ ...stats }), 500)
    return () => clearInterval(id)
  }, [])

  return (
    <pre className="debug-panel" data-testid="debug-panel">
      {`${environment()}
${loadTimes()}
${noted().slice(-12).join('\n')}

rail x     ${shown.railX.toFixed(1)}
FPS        ${shown.fps.toFixed(0)}
worst      ${shown.worstMs.toFixed(0)} ms
draw calls ${shown.calls}
triangles  ${(shown.triangles / 1000).toFixed(0)}k
geometries ${shown.geometries}
textures   ${shown.textures}
programs   ${shown.programs}`}
    </pre>
  )
}
