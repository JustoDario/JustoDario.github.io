import { useGLTF } from '@react-three/drei'

// Hito 0 only: proves the Draco and meshopt pipeline through ?smoke=<file>.
// Replaced by the real Model component in Hito 5.
export default function SmokeModel({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}
