import { carouselSections } from '../data/entries.js'

// The exhibition, in visiting order along one rail in X: one station per entry,
// so changing entry is also a trip. Plain data: `model: null` is an empty spot.
export const STATION_SPACING = 6

const list = [
  { id: 'home', section: 'home', model: 'coco1' },
  ...carouselSections.flatMap(({ id: section, entries }) =>
    entries.map((entry) => ({ id: `${section}/${entry.id}`, section, model: entry.model })),
  ),
  { id: 'skills', section: 'skills', model: null },
  { id: 'contact', section: 'contact', model: null },
]

export const STATIONS = list.map((station, index) => ({ ...station, x: index * STATION_SPACING }))
export const RAIL_LENGTH = STATIONS[STATIONS.length - 1].x

// About shares the station of the hero. Anything unknown falls back to the start.
export function stationFor(sectionId, entryIndex) {
  const section = sectionId === 'about' ? 'home' : sectionId
  const candidates = STATIONS.filter((station) => station.section === section)
  return candidates[entryIndex] ?? candidates[0] ?? STATIONS[0]
}

// The stations worth having in memory. On a trip, only the destination: no preloading
// while the camera moves. Stopped, also the next one along the rail and the section
// the scroll is approaching.
export function computeWindow(station, approaching, traveling) {
  const extras = traveling ? [] : [STATIONS[STATIONS.indexOf(station) + 1], approaching]
  return [...new Set([station, ...extras])].filter((candidate) => candidate?.model)
}
