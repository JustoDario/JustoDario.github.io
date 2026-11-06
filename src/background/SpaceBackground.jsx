import { useEffect } from 'react'
import { startBackgroundMotion } from './backgroundMotion.js'
import './space-background.css'

// Persistent studio backdrop behind the transparent Canvas.
export default function SpaceBackground() {
  useEffect(() => startBackgroundMotion(document.querySelector('.space-bg')), [])

  return (
    <div className="space-bg" aria-hidden="true">
      <div className="space-bg__lights">
        <div className="space-bg__light space-bg__light--rim" />
        <div className="space-bg__light space-bg__light--sheen" />
        <div className="space-bg__light space-bg__light--floor" />
      </div>
      <div className="space-bg__vignette" />
      <div className="space-bg__cursor" />
      <div className="space-bg__grain" />
    </div>
  )
}
