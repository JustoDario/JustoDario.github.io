// Scroll choreography, cursor light and rail parallax of the space background.
// Writes only compositor-friendly properties and sleeps while the page is idle.

import { scrollPosition, scrollRange } from '../lib/layout.js'

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const ramp = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const wave = (x) => Math.sin(Math.PI * x)

// p = scroll progress, 0 (top) to 1 (bottom). Units: vw/vh, degrees.
const sceneFor = ($) =>
  [
    { el: $('.space-bg__light--sheen'), at: (p) => ({ x: -26 * p, y: 4 * wave(p) }) },
    { el: $('.space-bg__light--rim'), at: (p) => ({ x: 20 * p, y: 6 * wave(p), s: 1 + 0.12 * wave(p) }) },
    { el: $('.space-bg__light--floor'), at: (p) => ({ x: -6 * wave(p), s: 1 + 0.06 * wave(p) }) },
  ].filter((layer) => layer.el)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Set by the camera rig. Only moves the container, so it cannot fight the
// per-layer `translate` values written by the scroll choreography.
let applyParallax = () => {}
export const setBackgroundParallax = (railProgress) => applyParallax(railProgress)

const PARALLAX_LIGHTS_VW = 4

export function startBackgroundMotion(root) {
  if (!root || reducedMotion()) return undefined

  const $ = (sel) => root.querySelector(sel)
  const SCENE = sceneFor($)
  const lights = $('.space-bg__lights')

  applyParallax = (p) => {
    lights.style.translate = `${(-PARALLAX_LIGHTS_VW * p).toFixed(3)}vw 0`
  }

  const EASE = 0.075
  let vw = 0
  let vh = 0
  let maxScroll = 1
  let strength = 1
  let target = 0
  let current = 0
  let frame = 0

  const measure = () => {
    vw = window.innerWidth / 100
    vh = window.innerHeight / 100
    maxScroll = scrollRange()
    const v = parseFloat(getComputedStyle(root).getPropertyValue('--scroll-strength'))
    strength = Number.isFinite(v) ? v : 1
    target = clamp01(scrollPosition() / maxScroll)
  }

  const apply = (p) => {
    for (const { el, at } of SCENE) {
      const st = at(p)
      if ('x' in st || 'y' in st) {
        el.style.translate = `${((st.x || 0) * strength * vw).toFixed(2)}px ${((st.y || 0) * strength * vh).toFixed(2)}px`
      }
      if ('r' in st) el.style.rotate = `${(st.r * strength).toFixed(3)}deg`
      if ('s' in st) el.style.scale = (1 + (st.s - 1) * strength).toFixed(4)
      if ('o' in st) el.style.opacity = clamp01(st.o).toFixed(3)
    }
  }

  const tick = () => {
    current += (target - current) * EASE
    if (Math.abs(target - current) < 0.0004) current = target
    apply(current)
    frame = current !== target ? requestAnimationFrame(tick) : 0
  }
  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick)
  }

  const onScroll = () => {
    target = clamp01(scrollPosition() / maxScroll)
    wake()
  }
  // The page height changes as the React sections mount, not only on resize.
  const onLayout = () => {
    measure()
    wake()
  }
  const observer = new ResizeObserver(onLayout)
  observer.observe(document.documentElement)
  observer.observe(document.body)
  const main = document.getElementById('main')
  if (main) {
    observer.observe(main)
    // In the upright layout main is a fixed pane: its box stays put while its content grows.
    for (const section of main.children) observer.observe(section)
  }
  // In the capture phase, to hear the upright layout's scrolling pane as well as the window.
  document.addEventListener('scroll', onScroll, { passive: true, capture: true })
  window.addEventListener('resize', onLayout, { passive: true })

  measure()
  current = target
  apply(current)

  // Cursor light: desktop mouse only.
  const light = $('.space-bg__cursor')
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const C_EASE = 0.06
  let tx = window.innerWidth / 2
  let ty = window.innerHeight / 2
  let cx = tx
  let cy = ty
  let cFrame = 0

  const follow = () => {
    cx += (tx - cx) * C_EASE
    cy += (ty - cy) * C_EASE
    light.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
    cFrame = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5 ? requestAnimationFrame(follow) : 0
  }
  const onPointer = (e) => {
    if (e.pointerType !== 'mouse') return
    tx = e.clientX
    ty = e.clientY
    light.classList.add('is-active')
    if (!cFrame) cFrame = requestAnimationFrame(follow)
  }
  const onLeave = () => light.classList.remove('is-active')
  if (light && hasMouse) {
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
  }

  return () => {
    cancelAnimationFrame(frame)
    cancelAnimationFrame(cFrame)
    observer.disconnect()
    document.removeEventListener('scroll', onScroll, { capture: true })
    window.removeEventListener('resize', onLayout)
    window.removeEventListener('pointermove', onPointer)
    document.documentElement.removeEventListener('mouseleave', onLeave)
    applyParallax = () => {}
  }
}
