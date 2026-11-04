import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MODELS } from '../data/models.js'
import { isUpright } from '../lib/layout.js'
import { Halo } from './Atmosphere.jsx'
import BakedShadow from './BakedShadow.jsx'
import Model from './Model.jsx'
import { LOOK_AT_HEIGHT } from './rail.js'
import { advanceSpin, spinOf } from './robotSpin.js'

// A robot not on show waits this far below the floor, loaded and out of sight, at its
// own x. Each one still bakes its shadow alone there.
const OUT_OF_SIGHT_Y = -50

// In the upright layout's short band each robot is centred by its own height, or tall
// ones would touch the navbar and short ones sit low. Elsewhere they share the floor.
export const robotLift = (model) => (isUpright() ? LOOK_AT_HEIGHT - model.height / 2 : 0)

// One exhibit. Stations without a model are not mounted at all.
export default function RobotStation({ station, warm, layout }) {
  const model = MODELS[station.model]
  const group = useRef()
  const turntable = useRef()

  const place = () => {
    const x = layout.current.get(station.id)
    return x === undefined ? [station.x, OUT_OF_SIGHT_Y, 0] : [x, robotLift(model), 0]
  }

  useFrame(({ invalidate }, delta) => {
    group.current.position.set(...place())
    const spin = spinOf(station.id)
    if (!layout.current.has(station.id)) spin.yaw = spin.velocity = 0 // back to its pose for the next visit
    if (advanceSpin(spin, delta)) invalidate() // the render loop is on demand while a video plays
    turntable.current.rotation.y = spin.yaw
  })

  return (
    <group ref={group} position={place()}>
      <Halo />
      {/* The shadow turns with the robot: it was baked once, with the robot at rest. */}
      <group ref={turntable}>
        <Model model={model} warm={warm} isShown={() => layout.current.has(station.id)}>
          <BakedShadow />
          {/* Thin legs vanish in the blur of the main shadow, which makes a robot look
              like it floats. This one only sees what is close to the floor. */}
          {model.legged && <BakedShadow far={0.3} blur={0.9} opacity={0.8} />}
        </Model>
      </group>
    </group>
  )
}
