import { carouselSections } from '../data/entries.js'
import { MODELS } from '../data/models.js'
import { stationFor } from '../scene/stations.js'
import { getModelStatus, subscribeModelStatus } from '../state/modelStatus.js'
import { parseHash } from '../state/deepLink.js'
import { assetUrl } from './assetUrl.js'

const modelFileUrl = (file) => assetUrl(`3d/${file}`)

const PREFETCH_AFTER_MS = 4000
const MIN_PREFETCH_BYTES_PER_SECOND = 1_500_000 / 8 // 1.5 Mbit/s

// The robot of the first station starts downloading at once, alongside the 3D code rather
// than after it.
export function preloadFirstModel() {
  const link = parseHash(window.location.hash, carouselSections)
  const station = stationFor(link?.id ?? 'home', link?.entry ?? 0)
  const model = MODELS[station.model]
  if (!model) return
  const preload = Object.assign(document.createElement('link'), { rel: 'preload', as: 'fetch', href: modelFileUrl(model.file) })
  preload.crossOrigin = 'anonymous'
  document.head.append(preload)
}

// Reads the whole body: fetch settles with the headers, so waiting for it alone would start
// every download at once. Discards the data, which stays in the HTTP cache. Returns the speed.
async function download(url) {
  const start = performance.now()
  const response = await fetch(url)
  const reader = response.body.getReader()
  let bytes = 0
  for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) bytes += chunk.value.length
  return bytes / Math.max((performance.now() - start) / 1000, 0.001)
}

// A photo on screen still loading goes first: on a phone line the robots of later stations
// would otherwise take its bandwidth. Gives up waiting after a while, as a broken image
// must not stop the rest for good.
const PHOTO_WAIT_MS = 15000
function photosSettled() {
  const loading = () =>
    [...document.querySelectorAll('.media__frame img')].some((img) => {
      if (img.complete) return false
      const box = img.getBoundingClientRect()
      return box.bottom > 0 && box.top < window.innerHeight
    })
  return new Promise((resolve) => {
    const end = performance.now() + PHOTO_WAIT_MS
    const check = () => (!loading() || performance.now() > end ? resolve() : setTimeout(check, 250))
    check()
  })
}

function prefetchOneByOne() {
  const idle = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 200))
  const files = [...new Set(Object.values(MODELS).map((model) => model.file))]
  const next = async () => {
    const file = files.shift()
    if (!file) return
    await photosSettled()
    const speed = await download(modelFileUrl(file)).catch(() => 0)
    if (speed >= MIN_PREFETCH_BYTES_PER_SECOND) idle(next) // on a slow line, leave it for the visitor
  }
  idle(next)
}

// Once a robot is on screen, the others go into the HTTP cache one by one, without decoding
// them or touching the GPU: arriving at one then only costs the decoding. Never before: on a
// slow line these would compete with the 3D code and the robot the visitor is waiting for.
// Skipped when the visitor asks to save data or the line is slow, and with ?noprefetch for
// the tests of what loads when.
export function prefetchModels() {
  const connection = navigator.connection
  if (connection?.saveData || (connection?.effectiveType && connection.effectiveType !== '4g')) return
  if (new URLSearchParams(window.location.search).has('noprefetch')) return
  const unsubscribe = subscribeModelStatus(() => {
    if (Object.keys(getModelStatus().loaded).length === 0) return
    unsubscribe()
    setTimeout(prefetchOneByOne, PREFETCH_AFTER_MS)
  })
}
