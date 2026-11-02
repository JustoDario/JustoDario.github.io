import { lazy, Suspense, useState } from 'react'
import ErrorBoundary from './ui/ErrorBoundary.jsx'
import SpaceBackground from './background/SpaceBackground.jsx'
import { assetUrl } from './lib/assetUrl.js'
import { TEST_STATIONS } from './scene/rail.js'

const GlobalCanvas = lazy(() => import('./scene/GlobalCanvas.jsx'))
const DebugPanel = lazy(() => import('./scene/Debug.jsx').then((m) => ({ default: m.DebugPanel })))

const params = new URLSearchParams(window.location.search)
const debug = params.has('debug')

// Temporary test page (Hitos 0 and 1): ?smoke=coco1 loads public/3d/coco1.glb.
const smokeName = params.get('smoke')
const smokeUrl = /^[\w-]+$/.test(smokeName ?? '') ? assetUrl(`3d/${smokeName}.glb`) : null

export default function App() {
  const [clicks, setClicks] = useState(0)
  const [station, setStation] = useState(0)

  return (
    <>
      <SpaceBackground />

      <ErrorBoundary>
        <Suspense fallback={null}>
          <GlobalCanvas smokeUrl={smokeUrl} stationX={TEST_STATIONS[station]} />
          {debug && <DebugPanel />}
        </Suspense>
      </ErrorBoundary>

      <main className="smoke-ui">
        <h1>Justo Dario Valverde Torres</h1>
        <p>Portfolio v2: infinite space test (Hito 1)</p>
        <button type="button" data-testid="click-test" onClick={() => setClicks((n) => n + 1)}>
          Clicks: <span data-testid="click-count">{clicks}</span>
        </button>
        <a href={assetUrl('assets/CVJustoDario.pdf')} target="_blank" rel="noreferrer">
          CV
        </a>
      </main>

      <button
        type="button"
        className="travel-test"
        data-testid="travel"
        onClick={() => setStation((s) => (s + 1) % TEST_STATIONS.length)}
      >
        {station === 0 ? 'Travel to the shapes →' : '← Back to Coco'}
      </button>
    </>
  )
}
