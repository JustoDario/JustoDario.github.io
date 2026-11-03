import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { carouselSections } from '../data/entries.js'
import { stationFor } from '../scene/stations.js'
import { parseHash } from './deepLink.js'

// A section only counts as active once scrolling has stopped in it for this long,
// so passing through one on the way to another never starts its video.
const SETTLE_MS = 300

// The camera changes station once the centre of the viewport is this far inside
// the next section, as a share of the viewport, so a border never makes it dither.
const STATION_MARGIN = 0.12

// A neighbouring section counts as approached once 10% of it shows: the top of the
// next one is above this share of the viewport height.
const APPROACH_SHARE = 0.9

// A reload lands at the top or on the deep link, never on a stale scroll position
// that would disagree with the initial station.
window.history.scrollRestoration = 'manual'

// Three independent levels: the active section, the entry shown in each section
// and the medium shown in each entry. Moving one never resets the others.
function applyLink(state, link) {
  if (link?.entry === undefined) return state
  const section = carouselSections.find(({ id }) => id === link.id)
  const next = { ...state, entries: { ...state.entries, [link.id]: link.entry } }
  if (link.media !== undefined) {
    next.media = { ...state.media, [section.entries[link.entry].id]: link.media }
  }
  return next
}

const readLink = () => parseHash(window.location.hash, carouselSections)

function scrollToLink(link, behavior) {
  if (link) document.getElementById(link.id)?.scrollIntoView({ behavior, block: 'start' })
}

const NavigationContext = createContext(null)

export function NavigationProvider({ children }) {
  const [state, setState] = useState(() => applyLink({ entries: {}, media: {} }, readLink()))
  const [activeSection, setActiveSection] = useState(null)
  const [stationSection, setStationSection] = useState(() => readLink()?.id ?? 'home')
  const [approachingSection, setApproachingSection] = useState(null)
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section')]
    let current = null
    let settled = null
    let anchorTop = 0
    let settleTimer
    let idleTimer
    let destination = null

    const track = () => {
      if (document.fullscreenElement) return // leaving the section would end the video
      const middle = window.innerHeight / 2
      const margin = window.innerHeight * STATION_MARGIN

      // Half-open bounds: the centre of the viewport is in one section at most, even
      // when it rests exactly on the border between two.
      let section = null
      for (const candidate of sections) {
        const { top, bottom } = candidate.getBoundingClientRect()
        if (top <= middle && bottom > middle) section = candidate
        if (!destination && top <= middle - margin && bottom > middle + margin) {
          setStationSection(candidate.id)
        }
      }
      if (!section) return

      anchorTop = section.getBoundingClientRect().top

      // Which section the scroll is heading for, once the next one starts to show.
      const index = sections.indexOf(section)
      const nextTop = sections[index + 1]?.getBoundingClientRect().top ?? Infinity
      const previousBottom = sections[index - 1]?.getBoundingClientRect().bottom ?? -Infinity
      const height = window.innerHeight
      if (nextTop < height * APPROACH_SHARE) setApproachingSection(sections[index + 1].id)
      else if (previousBottom > height * (1 - APPROACH_SHARE)) setApproachingSection(sections[index - 1].id)
      else setApproachingSection(null)
      if (section !== current) {
        current = section
        settled = null
        setActiveSection(null)
      }
      if (settled === current) return
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => {
        settled = current
        setActiveSection(current.id)
      }, SETTLE_MS)
    }

    // A destination holds the camera until scrolling stops, wherever that happens,
    // so the sections crossed on the way are not stations of the trip.
    const armRelease = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        destination = null
        track()
      }, SETTLE_MS)
    }

    const onScroll = () => {
      track()
      armRelease()
    }

    const goTo = (link, behavior) => {
      if (!link || !document.getElementById(link.id)) return
      destination = link.id
      // Render the linked entry first, so the scroll lands on its final layout.
      flushSync(() => {
        setState((previous) => applyLink(previous, link))
        setStationSection(link.id)
      })
      scrollToLink(link, behavior)
      armRelease()
    }

    const onHashChange = () => goTo(readLink(), 'auto') // follows the CSS, which honours reduced motion

    // A link to the hash already in the URL fires no hashchange.
    const onClick = (event) => {
      const href = event.target.closest?.('a[href^="#"]')?.getAttribute('href')
      if (href && href === window.location.hash) goTo(readLink(), 'auto')
    }

    // Sections are at least 100vh tall, so a new viewport height moves every section
    // below the first. Keep the current one where it was.
    const onResize = () => {
      if (destination) {
        // Moving the page would cancel a scroll under way: finish it instead.
        document.getElementById(destination)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      } else if (current) {
        const shift = current.getBoundingClientRect().top - anchorTop
        window.scrollBy({ top: shift, behavior: 'instant' })
      }
      track()
    }

    // The browser's own jump to the fragment happens before React has rendered.
    scrollToLink(readLink(), 'instant')

    // Changing entry can resize a section without any scrolling.
    const contentObserver = new ResizeObserver(track)
    contentObserver.observe(document.querySelector('main'))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', onHashChange)
    document.addEventListener('click', onClick)
    return () => {
      clearTimeout(settleTimer)
      clearTimeout(idleTimer)
      contentObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('click', onClick)
    }
  }, [])

  // Nothing else needs a new frame while a video plays: it gets the whole GPU.
  useEffect(() => {
    document.querySelector('.space-bg')?.classList.toggle('is-paused', videoPlaying)
  }, [videoPlaying])

  const value = useMemo(
    () => ({
      activeSection,
      station: stationFor(stationSection, state.entries[stationSection] ?? 0),
      approaching: approachingSection && stationFor(approachingSection, state.entries[approachingSection] ?? 0),
      videoPlaying,
      setVideoPlaying,
      entryIndex: (sectionId) => state.entries[sectionId] ?? 0,
      mediaIndex: (entryId) => state.media[entryId] ?? 0,
      setEntryIndex: (sectionId, index) =>
        setState((current) => ({ ...current, entries: { ...current.entries, [sectionId]: index } })),
      setMediaIndex: (entryId, index) =>
        setState((current) => ({ ...current, media: { ...current.media, [entryId]: index } })),
    }),
    [activeSection, stationSection, approachingSection, videoPlaying, state],
  )

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export const useNavigation = () => useContext(NavigationContext)
