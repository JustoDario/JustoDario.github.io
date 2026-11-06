import { useSyncExternalStore } from 'react'

// Two looks of the same page: 'dark' (the studio, with the spot) and 'light' (the pearl
// backdrop). The attribute on <html> is the source of truth: index.html sets it before
// the first paint, so the page never flashes the other one. Which one: the visitor's own
// choice if they made one, else the system's theme, else dark (the system does not say).
const KEY = 'theme'
const META = { dark: { color: '#030304', scheme: 'only dark' }, light: { color: '#e7ebf4', scheme: 'only light' } }

const listeners = new Set()
export const getTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

function apply(theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META[theme].color)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', META[theme].scheme)
  listeners.forEach((listener) => listener())
}

const stored = () => {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

// The button: from then on the page keeps this choice, whatever the system does.
export function toggleTheme() {
  const theme = getTheme() === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // private mode: the choice lasts for this visit only
  }
  apply(theme)
}

// Until the visitor chooses, the page follows the system when it switches (e.g. at dusk).
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
  if (!stored()) apply(event.matches ? 'light' : 'dark')
})

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useTheme = () => useSyncExternalStore(subscribe, getTheme)
