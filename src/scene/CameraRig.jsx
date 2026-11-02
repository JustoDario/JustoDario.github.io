import { useEffect, useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { setBackgroundParallax } from '../background/backgroundMotion.js'
import { CAMERA_OFFSET, LOOK_AT_HEIGHT, NO_SHADOW_LAYER, RAIL_LENGTH } from './rail.js'

// Single owner of the camera: one tween at a time, killed before the next one.
export default function CameraRig({ stationX }) {
  const camera = useThree((state) => state.camera)
  const rail = useRef({ x: stationX })

  const applyRail = () => {
    const { x } = rail.current
    camera.position.set(x + CAMERA_OFFSET[0], CAMERA_OFFSET[1], CAMERA_OFFSET[2])
    camera.lookAt(x, LOOK_AT_HEIGHT, 0)
    setBackgroundParallax(x / RAIL_LENGTH)
  }

  useLayoutEffect(() => {
    camera.layers.enable(NO_SHADOW_LAYER)
    applyRail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rail.current.x = stationX
      applyRail()
      return undefined
    }
    const tween = gsap.to(rail.current, {
      x: stationX,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: applyRail,
    })
    return () => tween.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationX, camera])

  return null
}
