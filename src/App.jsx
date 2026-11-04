import { lazy, Suspense, useEffect, useState } from 'react'
import ErrorBoundary from './ui/ErrorBoundary.jsx'
import SpaceBackground from './background/SpaceBackground.jsx'
import Navbar from './ui/Navbar.jsx'
import Hero from './ui/Hero.jsx'
import MainCarousel from './ui/MainCarousel.jsx'
import ModelStatus from './ui/ModelStatus.jsx'
import SkipLink from './ui/SkipLink.jsx'
import { About, Contact, Section, Skills } from './ui/Sections.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import { NavigationProvider } from './state/NavigationProvider.jsx'
import { carouselSections } from './data/entries.js'
import { afterFirstPaint } from './lib/afterFirstPaint.js'

const GlobalCanvas = lazy(() => import('./scene/GlobalCanvas.jsx'))
const DebugPanel = lazy(() => import('./scene/Debug.jsx').then((m) => ({ default: m.DebugPanel })))

const params = new URLSearchParams(window.location.search)
const debug = params.has('debug')

export default function App() {
  // The text comes first: the 3D code and the robot only start once it is on screen.
  const [sceneAllowed, setSceneAllowed] = useState(false)
  useEffect(() => afterFirstPaint(() => setSceneAllowed(true)), [])

  return (
    <>
      <SpaceBackground />

      <NavigationProvider>
        <ErrorBoundary>
          <Suspense fallback={null}>
            {sceneAllowed && <GlobalCanvas />}
            {sceneAllowed && debug && <DebugPanel />}
          </Suspense>
        </ErrorBoundary>

        <LanguageProvider>
          <SkipLink />
          <Navbar />
          <ModelStatus />
          <main id="main" tabIndex={-1}>
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
