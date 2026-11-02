// Scroll choreography, cursor light and rail parallax of the space background.
// Writes only compositor-friendly properties and sleeps while the page is idle.

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const ramp = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const wave = (x) => Math.sin(Math.PI * x)

// p = scroll progress, 0 (top) to 1 (bottom). Units: vw/vh, degrees.
const sceneFor = ($) =>
  [
    { el: $('.space-bg__sheet--tl'),
      at: (p) => ({ x: -5 * p, y: -16 * ramp(0, 1, p), r: 9 * p, s: 1 + 0.08 * p, o: 1 - 0.55 * ramp(0.35, 0.9, p) }) },
    { el: $('.space-bg__sheet--r'),
      at: (p) => ({ x: -5 * wave(p), y: -22 * p, r: -7 * p, s: 1 + 0.06 * wave(p) }) },
    { el: $('.space-bg__sheet--br'),
      at: (p) => ({ x: -7 * wave(p), y: -20 * wave(p), r: 5 * wave(p), s: 1 + 0.05 * wave(p) }) },
    { el: $('.space-bg__sheet--bl'),
      at: (p) => {
        const t = ramp(0.12, 0.65, p)
        return { x: -6 * (1 - t), y: 28 * (1 - t) - 6 * ramp(0.65, 1, p), r: -8 * (1 - t), s: 1, o: t * (1 - 0.3 * ramp(0.85, 1, p)) }
      } },
    { el: $('.space-bg__light--a'), at: (p) => ({ x: 0, y: -4 * wave(p), s: 1 + 0.08 * wave(p) }) },
    { el: $('.space-bg__light--b'), at: (p) => ({ x: 34 * p, y: 8 * wave(p) }) },
    { el: $('.space-bg__light--c'), at: (p) => ({ x: -8 * wave(p), y: -34 * p }) },
    { el: $('.space-bg__light--d'), at: (p) => ({ x: 18 * p, y: -26 * p, s: 1 + 0.1 * wave(p) }) },
    { el: $('.space-bg__tint--lavender'), at: (p) => ({ o: 0.9 * wave(p) }) },
    { el: $('.space-bg__tint--ice'), at: (p) => ({ o: 0.85 * ramp(0.55, 1, p) }) },
  ].filter((layer) => layer.el)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Set by the camera rig. Only moves the two containers, so it cannot fight the
// per-layer `translate` values written by the scroll choreography.
let applyParallax = () => {}
export const setBackgroundParallax = (railProgress) => applyParallax(railProgress)

const PARALLAX_GLASS_VW = 9
const PARALLAX_LIGHTS_VW = 4

export function startBackgroundMotion(root) {
  if (!root || reducedMotion()) return undefined

  const $ = (sel) => root.querySelector(sel)
  const SCENE = sceneFor($)
  const glass = $('.space-bg__glass')
  const lights = $('.space-bg__lights')

  applyParallax = (p) => {
    glass.style.translate = `${(-PARALLAX_GLASS_VW * p).toFixed(3)}vw 0`
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
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const v = parseFloat(getComputedStyle(root).getPropertyValue('--scroll-strength'))
    strength = Number.isFinite(v) ? v : 1
    target = clamp01(window.scrollY / maxScroll)
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
    target = clamp01(window.scrollY / maxScroll)
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
  window.addEventListener('scroll', onScroll, { passive: true })
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
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onLayout)
    window.removeEventListener('pointermove', onPointer)
    document.documentElement.removeEventListener('mouseleave', onLeave)
    applyParallax = () => {}
  }
}
