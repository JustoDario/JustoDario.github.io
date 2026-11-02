import { lazy, Suspense, useState } from 'react'
import ErrorBoundary from './ui/ErrorBoundary.jsx'
import { assetUrl } from './lib/assetUrl.js'

const GlobalCanvas = lazy(() => import('./scene/GlobalCanvas.jsx'))

// Hito 0 smoke page: ?smoke=coco1 loads public/3d/coco1.glb.
const smokeName = new URLSearchParams(window.location.search).get('smoke')
const smokeUrl = /^[\w-]+$/.test(smokeName ?? '') ? assetUrl(`3d/${smokeName}.glb`) : null

export default function App() {
  const [clicks, setClicks] = useState(0)

  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <GlobalCanvas smokeUrl={smokeUrl} />
        </Suspense>
      </ErrorBoundary>

      <main className="smoke-ui">
        <h1>Justo Dario Valverde Torres</h1>
        <p>Portfolio v2: project base (Hito 0)</p>
        <button type="button" data-testid="click-test" onClick={() => setClicks((n) => n + 1)}>
          Clicks: <span data-testid="click-count">{clicks}</span>
        </button>
        <a href={assetUrl('assets/CVJustoDario.pdf')} target="_blank" rel="noreferrer">
          CV
        </a>
      </main>
    </>
  )
}
