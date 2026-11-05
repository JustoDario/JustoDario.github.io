import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { useNavigation } from '../state/NavigationProvider.jsx'
import { ExternalIcon } from './icons.jsx'
import MediaCarousel from './MediaCarousel.jsx'

// All the information of one entry. Every field except the title is optional.
// `split`: the media gets a box of its own, to the left of the text.
export default function InfoPanel({ entry, active, split = false }) {
  const { l, t } = useLanguage()
  const { mediaIndex, setMediaIndex } = useNavigation()
  const media = !entry.noMedia && (
    <MediaCarousel
      media={entry.media ?? []}
      index={mediaIndex(entry.id)}
      onChange={(index) => setMediaIndex(entry.id, index)}
      active={active}
    />
  )
  const article = (
    <article className="panel entry">
      <header>
        <h3>{l(entry.title)}</h3>
        {entry.simulated && <span className="tag tag--header">{t('entry.simulated')}</span>}
        {entry.subtitle && <p className="entry__subtitle">{l(entry.subtitle)}</p>}
        {entry.role && <p className="entry__role">{l(entry.role)}</p>}
        {(entry.organization || entry.dates) && (
          <p className="entry__meta">{[entry.organization, l(entry.dates)].filter(Boolean).join(' · ')}</p>
        )}
      </header>

      {!split && media}

      {entry.description && <p>{l(entry.description)}</p>}

      {entry.highlights && (
        <ul className="entry__highlights">
          {entry.highlights.map((item) => (
            <li key={item.en}>{l(item)}</li>
          ))}
        </ul>
      )}

      {entry.link && (
        <a className="button" href={entry.link.url} target="_blank" rel="noreferrer">
          {l(entry.link.label)} <ExternalIcon />
        </a>
      )}

      {entry.note && <p className="entry__meta">{l(entry.note)}</p>}
    </article>
  )
  if (!split) return article
  return (
    <div className="entry-split">
      <div className="panel entry-split__media">{media}</div>
      {article}
    </div>
  )
}
