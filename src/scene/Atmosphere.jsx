import { useMemo } from 'react'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { NO_SHADOW_LAYER } from './rail.js'

let haloTexture = null

function makeHaloTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)')
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.4)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Pool of light on the invisible floor under an exhibit.
export function Halo({ x, radius = 2.6 }) {
  haloTexture ??= makeHaloTexture() // one for all the stations
  return (
    <mesh position={[x, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} layers={NO_SHADOW_LAYER} renderOrder={-1}>
      <planeGeometry args={[radius * 2, radius * 2]} />
      <meshBasicMaterial map={haloTexture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

const DUST_PER_METRE = 8

// Very faint dust: gives the camera something to move past, so the empty space
// reads as having depth.
export function Dust({ center, length }) {
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  return (
    <Sparkles
      layers={NO_SHADOW_LAYER}
      count={Math.round(length * DUST_PER_METRE)}
      position={[center, 1.3, -1.2]}
      scale={[length + 12, 3, 7]}
      size={1.3}
      speed={reduced ? 0 : 0.12}
      opacity={0.35}
      noise={0.6}
      color="#a9b9de"
    />
  )
}
