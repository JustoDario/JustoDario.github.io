import { useEffect, useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { setBackgroundParallax } from '../background/backgroundMotion.js'
import { useNavigation } from '../state/NavigationProvider.jsx'
import { CAMERA_OFFSET, LOOK_AT_HEIGHT, NO_SHADOW_LAYER } from './rail.js'
import { RAIL_LENGTH, STATION_SPACING } from './stations.js'

const BASE_SECONDS = 1.2
const SECONDS_PER_STATION = 0.3
const MAX_SECONDS = 2.8 // a long jump just goes faster

// The panel takes the right half on wide screens, and the lower part on small
// ones. Shifting the view rather than the camera keeps the perspective on the
// exhibit the same on every screen. Same breakpoint as the CSS.
const WIDE_MIN_PX = 960
const WIDE_SHIFT_X = 0.25
const NARROW_SHIFT_Y = 0.22

// Single owner of the camera: one tween at a time, killed before the next one.
export default function CameraRig() {
  const { station } = useNavigation()
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  const rail = useRef({ x: station.x })
  const tween = useRef(null)

  const applyRail = () => {
    const { x } = rail.current
    camera.position.set(x + CAMERA_OFFSET[0], CAMERA_OFFSET[1], CAMERA_OFFSET[2])
    camera.lookAt(x, LOOK_AT_HEIGHT, 0)
    setBackgroundParallax(x / RAIL_LENGTH)
    invalidate() // the render loop is on demand while a video plays
  }

  // Starts at its station with no trip, whatever the deep link says.
  useLayoutEffect(() => {
    camera.layers.enable(NO_SHADOW_LAYER)
    applyRail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  useLayoutEffect(() => {
    const { width, height } = size
    const wide = width > WIDE_MIN_PX
    camera.setViewOffset(width, height, wide ? width * WIDE_SHIFT_X : 0, wide ? 0 : height * NARROW_SHIFT_Y, width, height)
    invalidate()
  }, [camera, size, invalidate])

  useEffect(() => {
    const interrupted = tween.current?.isActive()
    tween.current?.kill()
    const distance = Math.abs(station.x - rail.current.x)
    if (distance === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rail.current.x = station.x
      applyRail()
      return
    }
    tween.current = gsap.to(rail.current, {
      x: station.x,
      duration: Math.min(BASE_SECONDS + (distance / STATION_SPACING) * SECONDS_PER_STATION, MAX_SECONDS),
      // A trip already under way keeps its speed instead of pausing to accelerate.
      ease: interrupted ? 'power2.out' : 'power2.inOut',
      onUpdate: applyRail,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station.x, camera])

  useEffect(() => () => tween.current?.kill(), [])

  return null
}
