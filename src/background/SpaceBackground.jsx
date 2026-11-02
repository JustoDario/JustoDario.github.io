import { useEffect } from 'react'
import { startBackgroundMotion } from './backgroundMotion.js'
import './space-background.css'

const stops = (list) =>
  list.map(([offset, color, opacity]) => (
    <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
  ))

// One luminous sheet edge: a wide faint glow, a shade halo and a thin highlight.
function Edge({ d, edge, shade, wide = 8, shadeWidth, line, shadeOpacity = 0.35, lineOpacity, wideOpacity = 0.12 }) {
  const common = { d, fill: 'none', strokeLinecap: 'round' }
  return (
    <>
      <path {...common} stroke={`url(#${edge})`} strokeWidth={wide} strokeOpacity={wideOpacity} />
      <path {...common} stroke={`url(#${shade})`} strokeWidth={shadeWidth} strokeOpacity={shadeOpacity} />
      <path {...common} stroke={`url(#${edge})`} strokeWidth={line} strokeOpacity={lineOpacity} />
    </>
  )
}

// Thin secondary line that runs alongside a main edge.
function Trail({ d, edge, shade, shadeWidth = 2.1, line = 0.8, shadeOpacity = 0.22, lineOpacity = 0.45 }) {
  return (
    <>
      <path d={d} fill="none" stroke={`url(#${shade})`} strokeWidth={shadeWidth} strokeOpacity={shadeOpacity} />
      <path d={d} fill="none" stroke={`url(#${edge})`} strokeWidth={line} strokeOpacity={lineOpacity} />
    </>
  )
}

const TL = 'M50 -60 C47 -30 46 -14 44 -4 C40 12 33 21 20 24.5 S4 28.5 -4 30 C-20 32 -40 33 -60 34'
const R = 'M160 8 C130 12 112 16 104 20 C92 24 85 37 76 45 S62 54 50 57'
const R2 = 'M160 40 C130 41 112 42 104 43 C92 45 80 49 64 54'
const BR = 'M30 160 C38 130 44 112 48 104 C58 88 78 74 104 69 C120 66 140 64 160 63'
const BL = 'M-60 60 C-20 58 -4 60 6 64 C18 69 28 84 34 104 C37 118 40 140 42 160'

// Persistent infinite-space layer behind the transparent Canvas.
export default function SpaceBackground() {
  useEffect(() => startBackgroundMotion(document.querySelector('.space-bg')), [])

  return (
    <div className="space-bg" aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }} focusable="false">
        <defs>
          <linearGradient id="sb-edge-a" x1="0" y1="1" x2="1" y2="0">
            {stops([[0, '#e9f0ff', 0], [0.35, '#ffffff', 0.9], [0.8, '#ffffff', 1], [1, '#ffffff', 0.2]])}
          </linearGradient>
          <linearGradient id="sb-edge-b" x1="1" y1="0" x2="0" y2="1">
            {stops([[0, '#ffffff', 0.2], [0.3, '#ffffff', 0.95], [0.75, '#dfe8ff', 0.55], [1, '#dfe8ff', 0]])}
          </linearGradient>
          <linearGradient id="sb-edge-c" x1="0" y1="1" x2="1" y2="0">
            {stops([[0, '#e3ecff', 0], [0.4, '#ffffff', 0.8], [1, '#cfe0ff', 0.9]])}
          </linearGradient>

          <linearGradient id="sb-shade-a" x1="0" y1="1" x2="1" y2="0">
            {stops([[0, '#8fa3d0', 0], [0.35, '#8fa3d0', 0.9], [0.8, '#8fa3d0', 1], [1, '#8fa3d0', 0.2]])}
          </linearGradient>
          <linearGradient id="sb-shade-b" x1="1" y1="0" x2="0" y2="1">
            {stops([[0, '#8fa3d0', 0.2], [0.3, '#8fa3d0', 0.95], [0.75, '#8fa3d0', 0.55], [1, '#8fa3d0', 0]])}
          </linearGradient>
          <linearGradient id="sb-shade-c" x1="0" y1="1" x2="1" y2="0">
            {stops([[0, '#8fa3d0', 0], [0.4, '#8fa3d0', 0.8], [1, '#8fa3d0', 0.9]])}
          </linearGradient>

          <linearGradient id="sb-fill-tl" x1="0" y1="0" x2="1" y2="1">
            {stops([[0, '#9eaed3', 0.22], [0.6, '#c8d3ea', 0.16], [1, '#ffffff', 0.35]])}
          </linearGradient>
          <linearGradient id="sb-fill-r" x1="0" y1="0" x2="1" y2="0">
            {stops([[0, '#ffffff', 0.32], [0.5, '#c9d4ee', 0.18], [1, '#a9b7d8', 0.18]])}
          </linearGradient>
          <linearGradient id="sb-fill-br" x1="0" y1="0" x2="0.6" y2="1">
            {stops([[0, '#ffffff', 0.38], [0.45, '#bccbe8', 0.2], [1, '#a2b1d4', 0.24]])}
          </linearGradient>
          <linearGradient id="sb-fill-bl" x1="1" y1="0" x2="0" y2="1">
            {stops([[0, '#ffffff', 0.34], [0.5, '#d6d2ee', 0.2], [1, '#b4b4dc', 0.22]])}
          </linearGradient>

          <radialGradient id="sb-fade-r" cx="104" cy="34" r="56" gradientUnits="userSpaceOnUse">
            {stops([[0, '#fff', 1], [0.5, '#fff', 0.7], [1, '#fff', 0]])}
          </radialGradient>
          <mask id="sb-mask-r" maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120">
            <rect x="-10" y="-10" width="120" height="120" fill="url(#sb-fade-r)" />
          </mask>
        </defs>
      </svg>

      <div className="space-bg__lights">
        <div className="space-bg__light space-bg__light--a" />
        <div className="space-bg__light space-bg__light--b" />
        <div className="space-bg__light space-bg__light--c" />
        <div className="space-bg__light space-bg__light--d" />
      </div>

      <div className="space-bg__tint space-bg__tint--lavender" />
      <div className="space-bg__tint space-bg__tint--ice" />

      {/* viewBox 0-100 stretched to the viewport; paths overshoot so motion never exposes an edge. */}
      <div className="space-bg__glass">
        <svg className="space-bg__sheet space-bg__sheet--tl" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <path d={`${TL} L-60 -60 Z`} fill="url(#sb-fill-tl)" />
          <Edge d={TL} edge="sb-edge-a" shade="sb-shade-a" shadeWidth={3.6} line={1.4} />
          <Trail
            d="M46 -60 C43 -30 42 -12 40 -4 C36 10 30 18 18 22 S3 25.5 -4 27 C-20 29 -40 30 -60 31"
            edge="sb-edge-a"
            shade="sb-shade-a"
          />
        </svg>

        <svg className="space-bg__sheet space-bg__sheet--r" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <path d={`${R} C66 62 86 72 104 80 L160 90 Z`} fill="url(#sb-fill-r)" mask="url(#sb-mask-r)" />
          <Edge d={R} edge="sb-edge-b" shade="sb-shade-b" shadeWidth={3.4} line={1.3} />
          <Edge
            d={R2}
            edge="sb-edge-b"
            shade="sb-shade-b"
            wide={6}
            wideOpacity={0.1}
            shadeWidth={2.6}
            shadeOpacity={0.22}
            line={1}
            lineOpacity={0.8}
          />
        </svg>

        <svg className="space-bg__sheet space-bg__sheet--br" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <path d={`${BR} L160 160 Z`} fill="url(#sb-fill-br)" />
          <Edge d={BR} edge="sb-edge-c" shade="sb-shade-c" shadeWidth={3.4} line={1.3} />
        </svg>

        <svg className="space-bg__sheet space-bg__sheet--bl" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <path d={`${BL} L-60 160 Z`} fill="url(#sb-fill-bl)" />
          <Edge d={BL} edge="sb-edge-c" shade="sb-shade-c" shadeWidth={3.1} line={1.2} />
          <Trail
            d="M-60 56 C-20 54 0 56 10 61 C22 67 32 80 38 100"
            edge="sb-edge-c"
            shade="sb-shade-c"
            lineOpacity={0.4}
          />
        </svg>
      </div>

      <div className="space-bg__cursor" />
      <div className="space-bg__grain" />
    </div>
  )
}
