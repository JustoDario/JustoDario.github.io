import { Component } from 'react'
import { reportContextRestored, reportSceneUnavailable, watchForWebGL, webglRefusalIsTemporary } from '../state/sceneHealth.js'

const RELOADED_AT = 'portfolioChunkReload'
const RELOAD_AT_MOST_EVERY_MS = 60000

// After a new deploy, a page from before it asks for code files that no longer exist. One
// reload fixes it. Returns whether it reloads; never twice in a row if the cause is another.
function reloadForNewDeploy(error) {
  if (!/dynamically imported module|Importing a module script failed|error loading dynamically/i.test(error.message)) return false
  const last = Number(sessionStorage.getItem(RELOADED_AT) ?? 0)
  if (Date.now() - last < RELOAD_AT_MOST_EVERY_MS) return false
  sessionStorage.setItem(RELOADED_AT, String(Date.now()))
  window.location.reload()
  return true
}

// R3F rethrows scene errors out of <Canvas>. This keeps them from taking the
// HTML interface down with the scene.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('3D scene unavailable:', error.message)
    if (reloadForNewDeploy(error)) return
    // A page loaded during the browser's WebGL block starts here: it can still recover.
    const webgl = /WebGL/.test(error.message)
    reportSceneUnavailable(webgl ? (webglRefusalIsTemporary() ? 'paused' : 'none') : 'failed')
    if (webgl) {
      this.stopWatching = watchForWebGL(() => {
        reportContextRestored()
        this.setState({ failed: false })
      })
    }
  }

  componentWillUnmount() {
    this.stopWatching?.()
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
