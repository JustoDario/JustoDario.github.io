import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { forLayout, MODELS } from '../data/models.js'
import { isUpright, useUpright } from '../lib/layout.js'
import { useTheme } from '../state/theme.js'
import { Halo } from './Atmosphere.jsx'
import BakedShadow from './BakedShadow.jsx'
import Model from './Model.jsx'
import { LOOK_AT_HEIGHT } from './rail.js'
import { advanceSpin, spinOf } from './robotSpin.js'

// A robot not on show waits this far below the floor, loaded and out of sight, at its
// own x. Each one still bakes its shadow alone there.
const OUT_OF_SIGHT_Y = -50

// In the upright layout's short band each robot is centred by its own height, or tall
// ones would touch the navbar and short ones sit low. Elsewhere they share the floor,
// unless `lift` moves a tall one and its floor to sit better in the frame.
export const robotLift = (model) => (isUpright() ? LOOK_AT_HEIGHT - model.height / 2 : (model.lift ?? 0))

// One exhibit. Stations without a model are not mounted at all.
export default function RobotStation({ station, warm, layout }) {
  const upright = useUpright()
  const light = useTheme() === 'light'
  const shadow = light ? '#2a3550' : '#000000'
  const model = forLayout(MODELS[station.model], upright)
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
      {/* The light theme lights each robot from its own pool; the dark one, from the stage spot. */}
      {light && <Halo kind="pearl" radius={2.6} depth={1} opacity={1} />}
      {/* The shadow turns with the robot: it was baked once, with the robot at rest. */}
      <group ref={turntable}>
        <Model model={model} warm={warm} isShown={() => layout.current.has(station.id)}>
          <BakedShadow color={shadow} />
          {/* Thin legs vanish in the blur of the main shadow, which makes a robot look
              like it floats. This one only sees what is close to the floor. */}
          {model.legged && <BakedShadow far={0.3} blur={0.9} opacity={0.8} color={shadow} />}
        </Model>
      </group>
    </group>
  )
}
