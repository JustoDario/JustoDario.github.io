import { Component } from 'react'

// R3F rethrows scene errors out of <Canvas>. This keeps them from taking the
// HTML interface down with the scene.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('3D scene unavailable:', error.message)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
