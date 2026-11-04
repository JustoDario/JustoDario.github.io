import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { useNavigation } from '../state/NavigationProvider.jsx'
import CarouselControls, { useArrowKeys, useSwipe } from './CarouselControls.jsx'
import InfoPanel from './InfoPanel.jsx'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One entry of a section at a time, so only the entry on show loads its media. Changing
// entry fades the old page out while the new one rises from below.
export default function MainCarousel({ sectionId, entries }) {
  const { t } = useLanguage()
  const { activeSection, entryIndex, setEntryIndex } = useNavigation()
  const index = entryIndex(sectionId)
  const active = activeSection === sectionId
  const change = (target) => setEntryIndex(sectionId, target)
  const previous = () => change(Math.max(index - 1, 0))
  const following = () => change(Math.min(index + 1, entries.length - 1))
  const swipe = useSwipe(previous, following)
  const arrows = useArrowKeys(previous, following)

  // Adjusted during render, so the first frame of the new entry already has the old page.
  const [shown, setShown] = useState(index)
  const [leaving, setLeaving] = useState(null)
  if (shown !== index) {
    setShown(index)
    // A deep link from another section lands here too: there is nothing to animate then.
    setLeaving(active && !reducedMotion() ? entries[shown] : null)
  }

  const entry = entries[index]

  return (
    <div className="main-carousel" role="group" aria-label={t(`section.${sectionId}`)} {...swipe} {...arrows}>
      {entries.length > 1 && (
        <CarouselControls
          index={index}
          count={entries.length}
          onChange={change}
          prevLabel={t('carousel.previous')}
          nextLabel={t('carousel.next')}
        />
      )}
      <div
        className={`pages${leaving ? ' pages--changing' : ''}`}
        onAnimationEnd={(event) => {
          if (event.animationName === 'page-rise') setLeaving(null)
        }}
      >
        {/* Keyed here, so that each new page starts its own animation. */}
        <div key={entry.id} className="page page--current">
          <InfoPanel entry={entry} active={active} />
        </div>
        {leaving && (
          <div className="page page--old" inert>
            <InfoPanel key={leaving.id} entry={leaving} active={false} />
          </div>
        )}
      </div>
    </div>
  )
}
