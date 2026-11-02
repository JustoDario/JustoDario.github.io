import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export const debugEnabled = new URLSearchParams(window.location.search).has('debug')

const stats = { fps: 0, worstMs: 0, calls: 0, triangles: 0, geometries: 0, textures: 0, programs: 0 }

// Inside the Canvas. Resets renderer.info once per frame, so passes rendered
// before the main one (shadow bakes, for example) are counted too.
export function DebugProbe() {
  const gl = useThree((state) => state.gl)
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
    stats.calls = gl.info.render.calls
    stats.triangles = gl.info.render.triangles
    stats.geometries = gl.info.memory.geometries
    stats.textures = gl.info.memory.textures
    stats.programs = gl.info.programs?.length ?? 0
    gl.info.reset()
  }, -1)

  return null
}

// Outside the Canvas: plain HTML that polls the numbers.
export function DebugPanel() {
  const [shown, setShown] = useState(stats)
  useEffect(() => {
    const id = setInterval(() => setShown({ ...stats }), 500)
    return () => clearInterval(id)
  }, [])

  return (
    <pre className="debug-panel" data-testid="debug-panel">
      {`FPS        ${shown.fps.toFixed(0)}
worst      ${shown.worstMs.toFixed(0)} ms
draw calls ${shown.calls}
triangles  ${(shown.triangles / 1000).toFixed(0)}k
geometries ${shown.geometries}
textures   ${shown.textures}
programs   ${shown.programs}`}
    </pre>
  )
}
