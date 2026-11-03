import { MODELS } from '../data/models.js'
import { Halo } from './Atmosphere.jsx'
import BakedShadow from './BakedShadow.jsx'
import Model from './Model.jsx'

// One exhibit on the rail. Stations without a model are not mounted at all.
export default function RobotStation({ station }) {
  const model = MODELS[station.model]
  return (
    <group position-x={station.x}>
      <Halo />
      <Model model={model}>
        {/* x is the world position, for the bake; the planes follow the group. */}
        <BakedShadow x={station.x} />
        {/* Thin legs vanish in the blur of the main shadow, which makes a robot look
            like it floats. This one only sees what is close to the floor. */}
        {model.legged && <BakedShadow x={station.x} far={0.3} blur={0.9} opacity={0.8} />}
      </Model>
    </group>
  )
}
