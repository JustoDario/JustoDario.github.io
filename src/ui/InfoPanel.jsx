import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { useNavigation } from '../state/NavigationProvider.jsx'
import { ExternalIcon } from './icons.jsx'
import MediaCarousel from './MediaCarousel.jsx'

// All the information of one entry. Every field except the title is optional.
export default function InfoPanel({ entry, active }) {
  const { l } = useLanguage()
  const { mediaIndex, setMediaIndex } = useNavigation()
  return (
    <article className="panel entry">
      <header>
        <h3>{l(entry.title)}</h3>
        {entry.subtitle && <p className="entry__subtitle">{l(entry.subtitle)}</p>}
        {entry.role && <p className="entry__role">{l(entry.role)}</p>}
        {(entry.organization || entry.dates) && (
          <p className="entry__meta">{[entry.organization, l(entry.dates)].filter(Boolean).join(' · ')}</p>
        )}
      </header>

      <MediaCarousel
        media={entry.media ?? []}
        index={mediaIndex(entry.id)}
        onChange={(index) => setMediaIndex(entry.id, index)}
        active={active}
      />

      {entry.description && <p>{l(entry.description)}</p>}
      {entry.research && <p>{l(entry.research)}</p>}

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

      {entry.credit && (
        <p className="entry__credit">
          <a href={entry.credit.url} target="_blank" rel="noreferrer">
            {l(entry.credit.text)}
          </a>
        </p>
      )}
    </article>
  )
}
