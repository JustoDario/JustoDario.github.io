import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { assetUrl } from '../lib/assetUrl.js'
import { useNavigation } from '../state/NavigationProvider.jsx'
import CarouselControls, { useSwipe } from './CarouselControls.jsx'
import { PlayIcon } from './icons.jsx'

const youtubeId = (embedUrl) => new URL(embedUrl).pathname.split('/').pop()
const thumbnail = (item, quality = 'sddefault') => `https://i.ytimg.com/vi/${youtubeId(item.url)}/${quality}.jpg`
const previewUrl = (item) => (item.type === 'video' ? thumbnail(item) : assetUrl(`media/${item.file}`))

// The thumbnail is always there, and YouTube only loads on play: its player is the
// heaviest thing on the page. An embed whose URL asks for autoplay starts by itself.
function Video({ item, active }) {
  const { l, t } = useLanguage()
  const { setVideoPlaying } = useNavigation()
  const [started, setStarted] = useState(false)
  const autoplays = item.url.includes('autoplay=1')
  const playing = active && (started || autoplays)

  useEffect(() => {
    if (!active) return undefined
    return () => setStarted(false) // leaving the section stops the video for good
  }, [active])

  useEffect(() => {
    if (!playing) return undefined
    setVideoPlaying(true)
    return () => setVideoPlaying(false)
  }, [playing, setVideoPlaying])

  const play = (event) => {
    setStarted(true)
    if (!active) event.currentTarget.closest('section').scrollIntoView()
  }

  const src = autoplays ? item.url : `${item.url}${item.url.includes('?') ? '&' : '?'}autoplay=1`

  return (
    <div className="media__video">
      <button
        type="button"
        className="media__thumbnail"
        disabled={playing}
        aria-label={`${t('media.play')}. ${l(item.title)}`}
        onClick={play}
      >
        <img
          src={thumbnail(item)}
          alt=""
          loading="lazy"
          onError={(event) => {
            const fallback = thumbnail(item, 'hqdefault')
            if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback
          }}
        />
        <span className="media__play">
          <PlayIcon />
        </span>
      </button>
      {playing && (
        <iframe
          src={src}
          title={l(item.title)}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  )
}

// `active` means this entry is the one on show in the settled section. No iframe
// mounts without it, so the page never has more than one.
export default function MediaCarousel({ media, index, onChange, active }) {
  const { l, t } = useLanguage()
  const swipe = useSwipe(
    () => onChange(Math.max(index - 1, 0)),
    () => onChange(Math.min(index + 1, media.length - 1)),
  )

  const next = media[index + 1]
  useEffect(() => {
    if (active && next) new Image().src = previewUrl(next)
  }, [active, next])

  if (media.length === 0) return null
  const item = media[index]

  return (
    <div className="media" role="group" aria-label={t('media.label')} {...swipe}>
      <div className="media__frame">
        {item.type === 'video' ? (
          <Video key={item.url} item={item} active={active} />
        ) : (
          <img key={item.file} src={previewUrl(item)} alt={l(item.alt)} loading="lazy" />
        )}
      </div>
      {media.length > 1 && (
        <CarouselControls
          index={index}
          count={media.length}
          onChange={onChange}
          prevLabel={t('media.previous')}
          nextLabel={t('media.next')}
        />
      )}
    </div>
  )
}
