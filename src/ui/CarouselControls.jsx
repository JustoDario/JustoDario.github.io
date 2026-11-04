import { useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons.jsx'

const SWIPE_MIN_PX = 50

// Horizontal swipes only; CSS leaves vertical panning to the browser. A nested
// carousel handles its own swipes and stops them reaching the outer one.
export function useSwipe(onPrev, onNext) {
  const start = useRef(null)
  return {
    onTouchStart: (event) => {
      event.stopPropagation()
      if (event.touches.length > 1) {
        start.current = null // a pinch, not a swipe
        return
      }
      const { clientX, clientY } = event.changedTouches[0]
      start.current = { x: clientX, y: clientY }
    },
    onTouchEnd: (event) => {
      event.stopPropagation()
      if (!start.current) return
      const dx = event.changedTouches[0].clientX - start.current.x
      const dy = event.changedTouches[0].clientY - start.current.y
      start.current = null
      if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return
      if (dx > 0) onPrev()
      else onNext()
    },
  }
}

// Arrow keys while focus is inside the carousel. A video keeps them for seeking, and a
// nested carousel answers before the outer one.
export function useArrowKeys(onPrev, onNext) {
  return {
    onKeyDown: (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (event.target.tagName === 'VIDEO') {
        event.stopPropagation()
        return
      }
      event.stopPropagation()
      event.preventDefault()
      if (event.key === 'ArrowLeft') onPrev()
      else onNext()
    },
  }
}

// No wrap-around. The ends use aria-disabled rather than disabled, so a keyboard
// user who reaches one keeps focus on the button.
export default function CarouselControls({ index, count, onChange, prevLabel, nextLabel }) {
  const go = (target) => {
    if (target >= 0 && target < count) onChange(target)
  }
  return (
    <div className="carousel-controls">
      <button
        type="button"
        className="carousel-controls__button"
        aria-label={prevLabel}
        aria-disabled={index === 0}
        onClick={() => go(index - 1)}
      >
        <ChevronLeftIcon />
      </button>
      <span className="carousel-controls__position" aria-live="polite">
        {index + 1} / {count}
      </span>
      <button
        type="button"
        className="carousel-controls__button"
        aria-label={nextLabel}
        aria-disabled={index === count - 1}
        onClick={() => go(index + 1)}
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}
