import { MODELS } from '../data/models.js'
import { Halo } from './Atmosphere.jsx'
import BakedShadow from './BakedShadow.jsx'
import Model from './Model.jsx'

// One exhibit on the rail. Stations without a model are not mounted at all.
export default function RobotStation({ station }) {
  return (
    <group position-x={station.x}>
      <Halo />
      <Model model={MODELS[station.model]}>
        <BakedShadow x={station.x} /> {/* world x, for the bake; the plane follows the group */}
      </Model>
    </group>
  )
}
