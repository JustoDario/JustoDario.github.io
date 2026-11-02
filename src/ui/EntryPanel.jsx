import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { assetUrl } from '../lib/assetUrl.js'
import { ExternalIcon } from './icons.jsx'

// All the information of one entry. The media list here is plain and temporary:
// the main and media carousels replace it in Hito 3.
const watchUrl = (embedUrl) => {
  const url = new URL(embedUrl)
  return `https://www.youtube.com/watch?v=${url.pathname.split('/').pop()}`
}

export default function EntryPanel({ entry }) {
  const { l } = useLanguage()
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

      <p>{l(entry.description)}</p>

      {entry.highlights && (
        <ul className="entry__highlights">
          {entry.highlights.map((item) => (
            <li key={item.en}>{l(item)}</li>
          ))}
        </ul>
      )}
      {entry.research && <p>{l(entry.research)}</p>}

      {entry.link && (
        <a className="button" href={entry.link.url} target="_blank" rel="noreferrer">
          {l(entry.link.label)} <ExternalIcon />
        </a>
      )}

      {entry.media.length > 0 && (
        <ul className="entry__media">
          {entry.media.map((item) => (
            <li key={item.url ?? item.file}>
              {item.type === 'video' ? (
                <a className="entry__video" href={watchUrl(item.url)} target="_blank" rel="noreferrer">
                  {l(item.title)} <ExternalIcon />
                </a>
              ) : (
                <img src={assetUrl(`media/${item.file}`)} alt={l(item.alt)} loading="lazy" />
              )}
            </li>
          ))}
        </ul>
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
