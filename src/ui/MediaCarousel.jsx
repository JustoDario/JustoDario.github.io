import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { assetUrl } from '../lib/assetUrl.js'
import { note } from '../lib/diagnostics.js'
import { useNavigation } from '../state/NavigationProvider.jsx'
import CarouselControls, { useArrowKeys, useSwipe } from './CarouselControls.jsx'
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

  useEffect(() => {
    if (!active) return undefined
    const element = video.current
    const autoplay = item.autoplay && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (element && autoplay) element.muted = true
    if (element && (autoplay || playRequested.current)) {
      playAttempted.current = true
      playRequested.current = false
      element.play().catch((error) => note(`${item.slug}: play refused, ${error.name}`)) // the poster stays
    }
    return () => element?.pause() // leaving the section stops the video
  }, [active, item.autoplay])

  // The old page of a turn unmounts too, and it must not speak for the new one.
  const playing = useRef(false)
  const notePlaying = (value) => {
    playing.current = value
    setVideoPlaying(value)
  }
  useEffect(
    () => () => {
      if (playing.current) setVideoPlaying(false)
    },
    [setVideoPlaying],
  )

  // A source can report an error long before anyone asks to play it, and some browsers do
  // so for a codec they merely skip. Only a play that fails counts: the player stays either
  // way, and YouTube is offered beside it.
  const playAttempted = useRef(false)
  const fail = (reason) => {
    note(`${item.slug}: ${reason}`)
    if (!playAttempted.current) return
    setFailed(true)
    setStarted(false) // play was announced before the failure: the button comes back
    notePlaying(false)
  }

  const start = () => {
    const element = video.current
    playAttempted.current = true
    if (element.networkState === element.NETWORK_NO_SOURCE) element.load() // try the sources again
    element.play().catch((error) => {
      note(`${item.slug}: play refused, ${error.name}`)
      if (error.name !== 'AbortError') fail(error.name)
    })
  }

  const play = (event) => {
    if (active) {
      start()
    } else {
      // Waits for the section: leaving it before then must not leave sound behind.
      playRequested.current = true
      event.currentTarget.closest('section').scrollIntoView()
    }
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
          notePlaying(true)
        }}
        onPause={() => notePlaying(false)}
        onEnded={() => notePlaying(false)}
        onError={(event) => fail(`video error ${event.currentTarget.error?.code}: ${event.currentTarget.error?.message}`)}
        onLoadStart={() => note(`${item.slug}: load start`)}
        onLoadedMetadata={(event) => note(`${item.slug}: metadata, ${event.currentTarget.currentSrc.split('/').pop()}`)}
        onCanPlay={() => note(`${item.slug}: can play`)}
        onStalled={() => note(`${item.slug}: stalled`)}
      >
        <source
          src={videoUrl(item, 'av1')}
          type='video/mp4; codecs="av01.0.05M.08, opus"'
          onError={() => note(`${item.slug}: AV1 source error`)}
        />
        <source
          src={videoUrl(item, 'h264')}
          type='video/mp4; codecs="avc1.64001F, mp4a.40.2"'
          onError={() => fail('H.264 source error')}
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
      {failed && item.youtube && (
        <a
          className="media__fallback"
          href={`https://www.youtube.com/watch?v=${item.youtube}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t('media.watch')}: ${l(item.name)}`}
        >
          {t('media.watch')} <ExternalIcon />
        </a>
      )}
    </div>
  )
}

// `active` means this entry is the one on show in the settled section.
export default function MediaCarousel({ media, index, onChange, active }) {
  const { l, t } = useLanguage()
  const previous = () => onChange(Math.max(index - 1, 0))
  const following = () => onChange(Math.min(index + 1, media.length - 1))
  const swipe = useSwipe(previous, following)
  const arrows = useArrowKeys(previous, following)

  const next = media[index + 1]
  useEffect(() => {
    if (active && next) new Image().src = previewUrl(next)
  }, [active, next])

  if (media.length === 0) {
    return (
      <div className="media" role="group" aria-label={t('media.label')}>
        <div className="media__frame media__frame--empty">{t('media.empty')}</div>
      </div>
    )
  }
  const item = media[index]

  return (
    <div className="media" role="group" aria-label={t('media.label')} {...swipe} {...arrows}>
      <div className="media__frame">
        {item.type === 'video' ? (
          <Video key={item.slug} item={item} active={active} />
        ) : (
          <picture key={item.file}>
            {item.still && <source media="(prefers-reduced-motion: reduce)" srcSet={assetUrl(`media/${item.still}`)} />}
            <img src={previewUrl(item)} alt={l(item.alt)} loading="lazy" />
          </picture>
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
