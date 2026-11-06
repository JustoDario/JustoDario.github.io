import { Environment, Lightformer } from '@react-three/drei'

// Studio light built from local shapes, so no HDR file is downloaded. The map
// renders once and does not cost anything per frame. Kept low and neutral: the
// theatre spots (StageLights) carry the key light, this only fills and gives the
// metal something to reflect.
export default function Lighting() {
  return (
    <>
      <directionalLight position={[3, 5, 3]} intensity={0.55} />
      <Environment resolution={256} frames={1} environmentIntensity={0.42}>
        <color attach="background" args={['#2a2b2f']} />
        <Lightformer form="rect" intensity={4} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-5, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={1.8} position={[5, 1.5, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 5, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 1.5, 6]} rotation={[0, Math.PI, 0]} scale={[6, 2, 1]} />
      </Environment>
    </>
  )
}
