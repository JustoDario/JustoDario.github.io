import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MODELS } from '../data/models.js'
import { Halo } from './Atmosphere.jsx'
import BakedShadow from './BakedShadow.jsx'
import Model from './Model.jsx'

// A robot not on show waits this far below the floor, loaded and out of sight, at its
// own x. Each one still bakes its shadow alone there.
const OUT_OF_SIGHT_Y = -50

// One exhibit. Stations without a model are not mounted at all.
export default function RobotStation({ station, warm, layout }) {
  const model = MODELS[station.model]
  const group = useRef()

  const place = () => {
    const x = layout.current.get(station.id)
    return x === undefined ? [station.x, OUT_OF_SIGHT_Y, 0] : [x, 0, 0]
  }

  useFrame(() => {
    group.current.position.set(...place())
  })

  return (
    <group ref={group} position={place()}>
      <Halo />
      <Model model={model} warm={warm}>
        <BakedShadow />
        {/* Thin legs vanish in the blur of the main shadow, which makes a robot look
            like it floats. This one only sees what is close to the floor. */}
        {model.legged && <BakedShadow far={0.3} blur={0.9} opacity={0.8} />}
      </Model>
    </group>
  )
}
