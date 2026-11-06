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

// Pool of light on the invisible floor under an exhibit, where the spot lands.
export function Halo({ radius = 2.1, opacity = 0.7 }) {
  haloTexture ??= makeHaloTexture() // one for all the stations
  return (
    <mesh position-y={0.001} rotation={[-Math.PI / 2, 0, 0]} layers={NO_SHADOW_LAYER} renderOrder={-1}>
      <planeGeometry args={[radius * 2, radius * 2]} />
      <meshBasicMaterial
        map={haloTexture}
        onBeforeCompile={alphaOnlyMap}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

// Theatre spot over an exhibit. Where it shines from: high above the floor, a little
// behind the robot, out of the frame. Shared by the beam and the real light.
export const SPOT_HEIGHT = 4.2
export const SPOT_BACK = -0.35
export const SPOT_FLOOR_RADIUS = 1.35

let beamGeometry = null
let beamMaterial = null

// A cone of haze, faked: only its far inside is drawn, so the robot stands in front of
// it, and it fades towards its outline, so it has no hard edge. No post-processing.
function makeBeam() {
  beamGeometry = new THREE.CylinderGeometry(0.06, SPOT_FLOOR_RADIUS, SPOT_HEIGHT, 128, 8, true)
  beamGeometry.translate(0, SPOT_HEIGHT / 2, 0)
  beamMaterial = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color('#f4f1ea') }, uOpacity: { value: 0.48 } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vAlong;
      void main() {
        vec4 view = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = -view.xyz;
        vAlong = uv.y; // 0 at the floor, 1 at the lamp
        gl_Position = projectionMatrix * view;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vAlong;
      void main() {
        float facing = abs(dot(normalize(vNormal), normalize(vView)));
        float edge = pow(facing, 3.0);
        // Dissolves into the pool on the floor, so the far rim of the cone draws no line,
        // and into the dark above the frame.
        float along = smoothstep(0.02, 0.32, vAlong) * (1.0 - smoothstep(0.78, 1.0, vAlong));
        // A little noise, or 8-bit alpha shows the soft falloff as bands.
        float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
        gl_FragColor = vec4(uColor, uOpacity * edge * along + dither / 255.0);
      }`,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })
}

export function SpotBeam() {
  if (!beamGeometry) makeBeam() // one for all the stations
  return (
    <mesh
      geometry={beamGeometry}
      material={beamMaterial}
      position-z={SPOT_BACK}
      layers={NO_SHADOW_LAYER}
      renderOrder={-2}
      frustumCulled={false}
    />
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
        opacity={0.3}
        noise={0.6}
        color="#d9dce2"
      />
    </group>
  )
}
