import { useEffect, useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { setBackgroundParallax } from '../background/backgroundMotion.js'
import { useNavigation } from '../state/NavigationProvider.jsx'
import { CAMERA_OFFSET, LOOK_AT_HEIGHT, NO_SHADOW_LAYER } from './rail.js'
import { RAIL_LENGTH, STATION_SPACING } from './stations.js'

const BASE_SECONDS = 1.2
const SECONDS_PER_STATION = 0.3
const MAX_SECONDS = 2.8 // rapid changes of destination can queue up some distance

// Further than this from the camera, a robot cannot be on screen.
const OUT_OF_VIEW = STATION_SPACING + 1

// The panel takes the right half on wide screens. On upright ones the robot gets a band
// at the top and the page runs below it. Shifting the view rather than the camera keeps
// the perspective the same on every screen. Same breakpoints as the CSS.
const isWide = (width, height) => width > 960 || (width >= 640 && width > height)
const WIDE_SHIFT_X = 0.25

// On an upright screen the robot has a band at the top, below the navbar (the same share
// as --robot-band in the CSS), closer to the navbar than to the content. The camera moves
// back until the tallest robot fits across and within that band; on phones the width
// decides, so the size of the band does not change the size of the robot.
const NAV_HEIGHT_PX = 64
const UPRIGHT_BAND_SHARE = 0.35
const UPRIGHT_ROBOT_AT = 0.46
const UPRIGHT_FIT_WIDTH = 2.7
const UPRIGHT_FIT_HEIGHT = 1.45

// Single owner of the camera: one tween at a time, killed before the next one.
//
// Going from one robot to any other is always one short hop, whatever lies between
// them on the rail: the robot just left is placed next to the destination, and the
// camera moves by the same amount in the same frame, so nothing appears to change.
// `layout` holds the robots on show and where they are; the rest wait out of sight.
export default function CameraRig({ onArrive, layout }) {
  const { station } = useNavigation()
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  const rail = useRef({ x: station.x, parallax: station.x / RAIL_LENGTH })
  const distance = useRef(CAMERA_OFFSET[2])
  const tween = useRef(null)
  const lastTarget = useRef(station)

  const applyRail = () => {
    const { x, parallax } = rail.current
    const back = distance.current / CAMERA_OFFSET[2]
    camera.position.set(x + CAMERA_OFFSET[0], LOOK_AT_HEIGHT + (CAMERA_OFFSET[1] - LOOK_AT_HEIGHT) * back, distance.current)
    camera.lookAt(x, LOOK_AT_HEIGHT, 0)
    setBackgroundParallax(parallax)
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
    const wide = isWide(width, height)
    const halfView = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const band = (height - NAV_HEIGHT_PX) * UPRIGHT_BAND_SHARE
    distance.current = wide
      ? CAMERA_OFFSET[2]
      : Math.max(
          CAMERA_OFFSET[2],
          UPRIGHT_FIT_WIDTH / (2 * halfView * (width / height)),
          UPRIGHT_FIT_HEIGHT / (2 * halfView * (band / height)),
        )
    applyRail()
    const shiftY = wide ? 0 : height / 2 - (NAV_HEIGHT_PX + band * UPRIGHT_ROBOT_AT)
    camera.setViewOffset(width, height, wide ? width * WIDE_SHIFT_X : 0, shiftY, width, height)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, size, invalidate])

  useEffect(() => {
    const interrupted = tween.current?.isActive()
    tween.current?.kill()
    const shown = layout.current
    const from = rail.current

    const arrive = () => {
      shown.clear()
      shown.set(station.id, station.x)
      invalidate()
      onArrive(station.x)
    }

    if (from.x === station.x) {
      arrive()
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.x = station.x
      from.parallax = station.x / RAIL_LENGTH
      applyRail()
      arrive()
      return
    }

    // Where the destination goes, in the current picture: already on show, or next to
    // whatever is furthest in the direction of travel.
    let place = shown.get(station.id)
    if (place === undefined) {
      const direction = Math.sign(station.x - lastTarget.current.x) || 1
      const places = [from.x, ...shown.values()]
      const edge = direction > 0 ? Math.max(...places) : Math.min(...places)
      place = direction > 0
        ? (Math.floor(edge / STATION_SPACING) + 1) * STATION_SPACING
        : (Math.ceil(edge / STATION_SPACING) - 1) * STATION_SPACING
    }

    // Move the whole picture so that the destination lands on its real position.
    const shift = station.x - place
    from.x += shift
    for (const [id, x] of [...shown]) {
      if (Math.abs(x + shift - from.x) > OUT_OF_VIEW) shown.delete(id)
      else shown.set(id, x + shift)
    }
    shown.set(station.id, station.x)
    lastTarget.current = station
    applyRail()

    onArrive(null) // on the way, also when going back to where the last trip started
    const distance = Math.abs(station.x - from.x)
    tween.current = gsap.to(from, {
      x: station.x,
      parallax: station.x / RAIL_LENGTH,
      duration: Math.min(BASE_SECONDS + (distance / STATION_SPACING) * SECONDS_PER_STATION, MAX_SECONDS),
      // A trip already under way keeps its speed instead of pausing to accelerate.
      ease: interrupted ? 'power2.out' : 'power2.inOut',
      onUpdate: applyRail,
      onComplete: arrive,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station.x, camera])

  useEffect(() => () => tween.current?.kill(), [])

  return null
}
