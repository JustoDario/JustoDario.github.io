import { Component } from 'react'
import { reportContextRestored, reportSceneUnavailable, watchForWebGL } from '../state/sceneHealth.js'

// R3F rethrows scene errors out of <Canvas>. This keeps them from taking the
// HTML interface down with the scene.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('3D scene unavailable:', error.message)
    reportSceneUnavailable()
    // A page loaded during the browser's WebGL block starts here: it can still recover.
    if (/WebGL/.test(error.message)) {
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
