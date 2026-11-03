import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { useNavigation } from '../state/NavigationProvider.jsx'
import CarouselControls, { useSwipe } from './CarouselControls.jsx'
import InfoPanel from './InfoPanel.jsx'

// One entry of a section at a time, so only the entry on show loads its media.
export default function MainCarousel({ sectionId, entries }) {
  const { t } = useLanguage()
  const { activeSection, entryIndex, setEntryIndex } = useNavigation()
  const index = entryIndex(sectionId)
  const change = (target) => setEntryIndex(sectionId, target)
  const swipe = useSwipe(
    () => change(Math.max(index - 1, 0)),
    () => change(Math.min(index + 1, entries.length - 1)),
  )
  const entry = entries[index]

  return (
    <div className="main-carousel" role="group" aria-label={t(`section.${sectionId}`)} {...swipe}>
      {entries.length > 1 && (
        <CarouselControls
          index={index}
          count={entries.length}
          onChange={change}
          prevLabel={t('carousel.previous')}
          nextLabel={t('carousel.next')}
        />
      )}
      <InfoPanel key={entry.id} entry={entry} active={activeSection === sectionId} />
    </div>
  )
}
