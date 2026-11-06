import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { forLayout, MODELS } from '../data/models.js'
import { useUpright } from '../lib/layout.js'
import { useNavigation } from '../state/NavigationProvider.jsx'
import { useTheme } from '../state/theme.js'
import { Halo, SPOT_BACK, SPOT_FLOOR_RADIUS, SPOT_HEIGHT, SpotBeam } from './Atmosphere.jsx'
import { LOOK_AT_HEIGHT } from './rail.js'
import { robotLift } from './RobotStation.jsx'

const INTENSITY = 3.2

// The theatre spot: one, fixed to the stage. It stays at the centre of the picture,
// where the camera looks, and the robots travel through it; only its height follows
// the floor of the robot on show (tall ones and the upright layout move it).
// One light in every material, not one per robot: each light costs every pixel.
// The light theme has no spot: it is dimmed to 0, not removed, as a change in the number
// of lights would recompile every material in the scene.
export default function StageLights() {
  const lit = useTheme() === 'dark'
  const { station } = useNavigation()
  const upright = useUpright()
  const [target] = useState(() => new THREE.Object3D())
  const floor = station.model ? robotLift(forLayout(MODELS[station.model], upright)) : null

  // Starts on the floor of the first robot; not a prop, or each render would undo the easing.
  const [group] = useState(() => {
    const g = new THREE.Group()
    g.position.y = floor ?? 0
    return g
  })

  useFrame(({ camera, invalidate }, delta) => {
    group.position.x = camera.position.x // the camera looks at its own x
    if (floor === null || group.position.y === floor) return
    const y = THREE.MathUtils.damp(group.position.y, floor, 6, delta)
    group.position.y = Math.abs(y - floor) < 1e-4 ? floor : y
    invalidate() // the render loop is on demand while a video plays
  })

  return (
    <primitive object={group}>
      <Halo visible={lit} />
      <SpotBeam visible={lit} />
      <primitive object={target} position-y={LOOK_AT_HEIGHT} />
      <spotLight
        position={[0, SPOT_HEIGHT, SPOT_BACK]}
        target={target}
        intensity={lit ? INTENSITY : 0}
        color="#fff6ea"
        angle={Math.atan(SPOT_FLOOR_RADIUS / SPOT_HEIGHT) * 1.25}
        penumbra={0.85}
        decay={0}
      />
    </primitive>
  )
}
