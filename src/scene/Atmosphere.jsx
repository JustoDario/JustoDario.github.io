import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { alphaOnlyMap } from './alphaOnlyMap.js'
import { NO_SHADOW_LAYER } from './rail.js'
import { STATION_SPACING } from './stations.js'

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
export function Halo({ radius = 2.6 }) {
  haloTexture ??= makeHaloTexture() // one for all the stations
  return (
    <mesh position-y={0.001} rotation={[-Math.PI / 2, 0, 0]} layers={NO_SHADOW_LAYER} renderOrder={-1}>
      <planeGeometry args={[radius * 2, radius * 2]} />
      <meshBasicMaterial map={haloTexture} onBeforeCompile={alphaOnlyMap} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

const DUST_PER_TILE = 48
const TILES_EACH_SIDE = 2

// Very faint dust: gives the camera something to move past, so the empty space reads
// as having depth. It repeats every station, so that the camera can be moved by whole
// stations without any visible change, and the tiles simply follow it along.
export function Dust() {
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const camera = useThree((state) => state.camera)
  const group = useRef()
  const tile = useRef()

  useEffect(() => {
    const copies = []
    for (let i = -TILES_EACH_SIDE; i <= TILES_EACH_SIDE; i++) {
      if (i === 0) continue
      const copy = tile.current.clone(false) // shares geometry and material
      copy.position.x = i * STATION_SPACING
      group.current.add(copy)
      copies.push(copy)
    }
    return () => copies.forEach((copy) => copy.removeFromParent())
  }, [])

  useFrame(() => {
    group.current.position.x = Math.round(camera.position.x / STATION_SPACING) * STATION_SPACING
  })

  return (
    <group ref={group}>
      <Sparkles
        ref={tile}
        layers={NO_SHADOW_LAYER}
        count={DUST_PER_TILE}
        position={[0, 1.3, -1.2]}
        scale={[STATION_SPACING, 3, 7]}
        size={1.3}
        speed={reduced ? 0 : 0.12}
        opacity={0.35}
        noise={0.6}
        color="#a9b9de"
      />
    </group>
  )
}
