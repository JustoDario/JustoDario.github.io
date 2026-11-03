import { lazy, Suspense } from 'react'
import ErrorBoundary from './ui/ErrorBoundary.jsx'
import SpaceBackground from './background/SpaceBackground.jsx'
import Navbar from './ui/Navbar.jsx'
import Hero from './ui/Hero.jsx'
import MainCarousel from './ui/MainCarousel.jsx'
import { About, Contact, Section, Skills } from './ui/Sections.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import { NavigationProvider } from './state/NavigationProvider.jsx'
import { carouselSections } from './data/entries.js'
import { assetUrl } from './lib/assetUrl.js'

const GlobalCanvas = lazy(() => import('./scene/GlobalCanvas.jsx'))
const DebugPanel = lazy(() => import('./scene/Debug.jsx').then((m) => ({ default: m.DebugPanel })))

const params = new URLSearchParams(window.location.search)
const debug = params.has('debug')

// Temporary until Hito 5: ?smoke=coco1 loads public/3d/coco1.glb on its own.
const smokeName = params.get('smoke')
const smokeUrl = /^[\w-]+$/.test(smokeName ?? '') ? assetUrl(`3d/${smokeName}.glb`) : null

export default function App() {
  return (
    <>
      <SpaceBackground />

      <NavigationProvider>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <GlobalCanvas smokeUrl={smokeUrl} />
            {debug && <DebugPanel />}
          </Suspense>
        </ErrorBoundary>

        <LanguageProvider>
          <Navbar />
          <main>
            <Hero />
            <About />
            {carouselSections.map(({ id, entries }) => (
              <Section key={id} id={id} carousel>
                <MainCarousel sectionId={id} entries={entries} />
              </Section>
            ))}
            <Skills />
            <Contact />
          </main>
        </LanguageProvider>
      </NavigationProvider>
    </>
  )
}
