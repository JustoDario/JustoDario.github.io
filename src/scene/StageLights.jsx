import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { LOOK_AT_HEIGHT } from './rail.js'
import { SPOT_BACK, SPOT_FLOOR_RADIUS, SPOT_HEIGHT } from './Atmosphere.jsx'

// Never more robots than this on show at once, even mid-trip.
const SPOTS = 3
const INTENSITY = 3.2

// The real light of the theatre spots: it lands on the robots on show. A fixed set of
// lights, dimmed rather than hidden: a hidden light no longer counts, and a change in
// the number of lights recompiles every material in the scene.
export default function StageLights({ layout }) {
  const lights = useRef([])

  useFrame(() => {
    const places = [...layout.current.values()]
    lights.current.forEach((light, i) => {
      const x = places[i]
      light.intensity = x === undefined ? 0 : INTENSITY
      if (x === undefined) return
      light.position.set(x, SPOT_HEIGHT, SPOT_BACK)
      light.target.position.set(x, LOOK_AT_HEIGHT, 0)
      light.target.updateMatrixWorld()
    })
  })

  return Array.from({ length: SPOTS }, (_, i) => (
    <spotLight
      key={i}
      ref={(light) => (lights.current[i] = light)}
      intensity={0}
      color="#fff6ea"
      angle={Math.atan(SPOT_FLOOR_RADIUS / SPOT_HEIGHT) * 1.25}
      penumbra={0.85}
      decay={0}
    />
  ))
}
