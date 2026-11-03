import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { assetUrl } from '../lib/assetUrl.js'
import { useNavigation } from '../state/NavigationProvider.jsx'
import CarouselControls, { useSwipe } from './CarouselControls.jsx'
import { ExternalIcon, PlayIcon } from './icons.jsx'

const previewUrl = (item) => assetUrl(`media/${item.poster ?? item.file}`)
const videoUrl = (item, codec) => assetUrl(`video/${item.slug}.${codec}.mp4`)

// Nothing downloads until play. A video that asks for autoplay starts by itself,
// muted, whenever its section becomes active.
function Video({ item, active }) {
  const { l, t } = useLanguage()
  const { setVideoPlaying } = useNavigation()
  const video = useRef(null)
  const playRequested = useRef(false)
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)

  const fail = () => {
    setFailed(true)
    setVideoPlaying(false) // no pause event comes from a removed element
  }

  useEffect(() => {
    if (!active) return undefined
    const element = video.current
    if (element && item.autoplay) element.muted = true
    if (element && (item.autoplay || playRequested.current)) {
      playRequested.current = false
      element.play().catch(() => {}) // the browser may refuse: the poster stays
    }
    return () => element?.pause() // leaving the section stops the video
  }, [active, item.autoplay])

  useEffect(() => () => setVideoPlaying(false), [setVideoPlaying])

  const play = (event) => {
    if (active) {
      video.current.play().catch(() => {})
    } else {
      // Waits for the section: leaving it before then must not leave sound behind.
      playRequested.current = true
      event.currentTarget.closest('section').scrollIntoView()
    }
  }

  if (failed) {
    return (
      <a
        className="media__video media__fallback"
        href={`https://www.youtube.com/watch?v=${item.youtube}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`${t('media.watch')}: ${l(item.name)}`}
      >
        <img src={previewUrl(item)} alt="" />
        <span className="media__watch">
          {t('media.watch')} <ExternalIcon />
        </span>
      </a>
    )
  }

  return (
    <div className="media__video">
      <video
        ref={video}
        poster={previewUrl(item)}
        controls={started}
        preload="none"
        playsInline
        aria-label={l(item.title)}
        onPlay={() => {
          setStarted(true)
          setVideoPlaying(true)
        }}
        onPause={() => setVideoPlaying(false)}
        onEnded={() => setVideoPlaying(false)}
        onError={fail}
      >
        <source src={videoUrl(item, 'av1')} type='video/mp4; codecs="av01.0.05M.08, opus"' />
        <source
          src={videoUrl(item, 'h264')}
          type='video/mp4; codecs="avc1.640020, mp4a.40.2"'
          onError={fail}
        />
      </video>
      {!started && (
        <button
          type="button"
          className="media__start"
          aria-label={`${t('media.play')}: ${l(item.name)}`}
          onClick={play}
        >
          <span className="media__play">
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  )
}

// `active` means this entry is the one on show in the settled section.
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
          <Video key={item.slug} item={item} active={active} />
        ) : (
          <img key={item.file} src={previewUrl(item)} alt={l(item.alt)} loading="lazy" />
        )}
      </div>
      {item.type === 'video' && <p className="media__caption">{l(item.name)}</p>}
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
