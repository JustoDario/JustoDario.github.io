import { Environment, Lightformer } from '@react-three/drei'
import { useTheme } from '../state/theme.js'

// Studio light built from local shapes, so no HDR file is downloaded. The map
// renders once and does not cost anything per frame; a theme change renders it again.
// Dark: kept low and neutral, the theatre spot (StageLights) carries the key light and
// this only fills and gives the metal something to reflect. Light: the pearl look, lit
// from above with cool and lavender sides, and no spot.
const LOOKS = {
  dark: { key: 0.55, environment: 0.42, background: '#2a2b2f', left: '#ffffff', right: '#ffffff' },
  light: { key: 1.6, environment: 0.55, background: '#5c6680', left: '#dfe8ff', right: '#e8e2fc' },
}

export default function Lighting() {
  const theme = useTheme()
  const look = LOOKS[theme]
  return (
    <>
      <directionalLight position={[3, 5, 3]} intensity={look.key} />
      <Environment key={theme} resolution={256} frames={1} environmentIntensity={look.environment}>
        <color attach="background" args={[look.background]} />
        <Lightformer form="rect" intensity={4} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
        <Lightformer form="rect" intensity={2.5} color={look.left} position={[-5, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={1.8} color={look.right} position={[5, 1.5, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 5, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 1.5, 6]} rotation={[0, Math.PI, 0]} scale={[6, 2, 1]} />
      </Environment>
    </>
  )
}
