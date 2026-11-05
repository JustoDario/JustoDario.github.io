import { useSyncExternalStore } from 'react'

// The two page layouts. Upright screens keep the robot in the top half and scroll a pane
// below it; everything else scrolls the page. Same breakpoints as the CSS.
export const UPRIGHT_QUERY = '(max-width: 960px) and (orientation: portrait), (max-width: 639px)'

export const isUpright = () => window.matchMedia(UPRIGHT_QUERY).matches

const subscribeUpright = (listener) => {
  const query = window.matchMedia(UPRIGHT_QUERY)
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}

export const useUpright = () => useSyncExternalStore(subscribeUpright, isUpright)

const pane = () => document.getElementById('main')

// What scrolls now. Scroll events do not bubble, but a listener on document in the capture
// phase hears both this pane and the window, so nothing needs rewiring on rotation.
export const scroller = () => (isUpright() ? pane() : window)

export const scrollPosition = () => (isUpright() ? pane().scrollTop : window.scrollY)

export const scrollRange = () => {
  const element = isUpright() ? pane() : document.documentElement
  return Math.max(1, element.scrollHeight - element.clientHeight)
}

// The part of the screen where the scrolling content shows.
export function contentBox() {
  if (!isUpright()) return { top: 0, height: window.innerHeight }
  const { top, height } = pane().getBoundingClientRect()
  return { top, height }
}
