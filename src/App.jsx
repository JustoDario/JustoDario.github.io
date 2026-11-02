import { lazy, Suspense, useState } from 'react'
import ErrorBoundary from './ui/ErrorBoundary.jsx'
import SpaceBackground from './background/SpaceBackground.jsx'
import Navbar from './ui/Navbar.jsx'
import Hero from './ui/Hero.jsx'
import EntryPanel from './ui/EntryPanel.jsx'
import { About, Contact, Section, Skills } from './ui/Sections.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import { carouselSections } from './data/entries.js'
import { assetUrl } from './lib/assetUrl.js'
import { TEST_STATIONS } from './scene/rail.js'

const GlobalCanvas = lazy(() => import('./scene/GlobalCanvas.jsx'))
const DebugPanel = lazy(() => import('./scene/Debug.jsx').then((m) => ({ default: m.DebugPanel })))

const params = new URLSearchParams(window.location.search)
const debug = params.has('debug')

// Temporary until Hito 5: ?smoke=coco1 loads public/3d/coco1.glb on its own.
const smokeName = params.get('smoke')
const smokeUrl = /^[\w-]+$/.test(smokeName ?? '') ? assetUrl(`3d/${smokeName}.glb`) : null

export default function App() {
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

      <LanguageProvider>
        <Navbar />
        <main>
          <Hero />
          <About />
          {carouselSections.map(({ id, entries }) => (
            <Section key={id} id={id}>
              <div className="entries">
                {entries.map((entry) => (
                  <EntryPanel key={entry.id} entry={entry} />
                ))}
              </div>
            </Section>
          ))}
          <Skills />
          <Contact />
        </main>
      </LanguageProvider>

      {debug && (
        <button
          type="button"
          className="travel-test"
          data-testid="travel"
          onClick={() => setStation((s) => (s + 1) % TEST_STATIONS.length)}
        >
          {station === 0 ? 'Travel to the shapes →' : '← Back to Coco'}
        </button>
      )}
    </>
  )
}
