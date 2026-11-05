import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { forLayout, MODELS } from '../data/models.js'
import { isUpright } from '../lib/layout.js'
import { debugEnabled } from './Debug.jsx'
import { robotLift } from './RobotStation.jsx'
import { spinOf } from './robotSpin.js'

const RADIANS_PER_PIXEL = 0.01
const MAX_FLING = 6 // radians per second
const HELD_STILL_MS = 80 // a pause before letting go means no fling

const point = new THREE.Vector3()

// The box on screen that holds the robot at any angle: the cylinder it turns inside.
function screenBox(model, x, camera, { width, height }) {
  const box = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity }
  const lift = robotLift(model)
  for (const y of [lift, lift + model.height]) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2
      point.set(x + Math.cos(angle) * model.radius, y, Math.sin(angle) * model.radius).project(camera)
      box.left = Math.min(box.left, ((point.x + 1) / 2) * width)
      box.right = Math.max(box.right, ((point.x + 1) / 2) * width)
      box.top = Math.min(box.top, ((1 - point.y) / 2) * height)
      box.bottom = Math.max(box.bottom, ((1 - point.y) / 2) * height)
    }
  }
  return {
    left: Math.max(box.left, 0),
    top: Math.max(box.top, 0),
    width: Math.min(box.right, width) - Math.max(box.left, 0),
    height: Math.min(box.bottom, height) - Math.max(box.top, 0),
  }
}

// The canvas lets every event through, so that the page on top of it keeps working. This
// element, in the page, is what the visitor grabs the robot by. Only ever there with a
// robot standing still on screen.
export default function RobotGrab({ station, ready }) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  const element = useRef(null)
  const stationId = useRef(station.id)
  stationId.current = station.id
  const stopDrag = useRef(() => {})

  useEffect(() => {
    const grab = document.createElement('div')
    grab.className = 'robot-grab'
    grab.hidden = true
    grab.setAttribute('aria-hidden', 'true')
    grab.dataset.testid = 'robot-grab'
    document.body.append(grab)
    element.current = grab
    if (debugEnabled) window.__spinOf = spinOf

    let drag = null
    const onDown = (event) => {
      if (drag || event.button !== 0) return
      grab.setPointerCapture(event.pointerId)
      const spin = spinOf(stationId.current)
      spin.velocity = 0
      drag = { id: event.pointerId, spin, x: event.clientX, time: event.timeStamp, speed: 0 }
    }
    const onMove = (event) => {
      if (event.pointerId !== drag?.id) return
      const turn = (event.clientX - drag.x) * RADIANS_PER_PIXEL
      const seconds = (event.timeStamp - drag.time) / 1000
      drag.spin.yaw += turn
      if (seconds > 0) drag.speed = drag.speed * 0.2 + (turn / seconds) * 0.8
      drag.x = event.clientX
      drag.time = event.timeStamp
      invalidate()
    }
    const end = (fling) => {
      if (!drag) return
      const { spin, speed, time } = drag
      drag = null
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (fling && !reduced && performance.now() - time < HELD_STILL_MS) {
        spin.velocity = THREE.MathUtils.clamp(speed, -MAX_FLING, MAX_FLING)
        invalidate()
      }
    }
    const onUp = (event) => event.pointerId === drag?.id && end(true)
    // The browser took the gesture over, or the element went away: stop where it is.
    const onCancel = (event) => event.pointerId === drag?.id && end(false)
    stopDrag.current = () => end(false)

    grab.addEventListener('pointerdown', onDown)
    grab.addEventListener('pointermove', onMove)
    grab.addEventListener('pointerup', onUp)
    grab.addEventListener('pointercancel', onCancel)
    grab.addEventListener('lostpointercapture', onCancel)
    return () => {
      grab.remove()
      element.current = null
    }
  }, [invalidate])

  useEffect(() => {
    const grab = element.current
    grab.hidden = !ready
    if (!ready) {
      stopDrag.current()
      return
    }
    camera.updateMatrixWorld()
    const box = screenBox(forLayout(MODELS[station.model], isUpright()), station.x, camera, size)
    for (const [side, value] of Object.entries(box)) grab.style[side] = `${value}px`
  }, [ready, station, camera, size])

  return null
}
