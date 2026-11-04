import { carouselSections } from '../data/entries.js'
import { MODELS } from '../data/models.js'
import { stationFor } from '../scene/stations.js'
import { parseHash } from '../state/deepLink.js'
import { assetUrl } from './assetUrl.js'

const modelFileUrl = (file) => assetUrl(`3d/${file}`)

const PREFETCH_AFTER_MS = 4000

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

// Once the page is quiet, the other robots go into the HTTP cache one by one, without
// decoding them or touching the GPU: arriving at one then only costs the decoding. Skipped
// when the visitor asks to save data, or with ?noprefetch for the tests of what loads when.
export function prefetchModels() {
  const connection = navigator.connection
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? '')) return
  if (new URLSearchParams(window.location.search).has('noprefetch')) return
  const idle = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 200))
  setTimeout(() => {
    const files = [...new Set(Object.values(MODELS).map((model) => model.file))]
    const next = () => {
      const file = files.shift()
      if (file) fetch(modelFileUrl(file)).catch(() => {}).finally(() => idle(next))
    }
    idle(next)
  }, PREFETCH_AFTER_MS)
}
