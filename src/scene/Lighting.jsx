import { Environment, Lightformer } from '@react-three/drei'

// Studio light built from local shapes, so no HDR file is downloaded. The map
// renders once and does not cost anything per frame.
export default function Lighting() {
  return (
    <>
      <directionalLight position={[3, 5, 3]} intensity={1.6} />
      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <color attach="background" args={['#5c6680']} />
        <Lightformer form="rect" intensity={4} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#dfe8ff" position={[-5, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#e8e2fc" position={[5, 1.5, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 5, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 1.5, 6]} rotation={[0, Math.PI, 0]} scale={[6, 2, 1]} />
      </Environment>
    </>
  )
}
