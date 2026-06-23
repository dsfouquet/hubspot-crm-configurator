import { Component } from 'react'

// Generic render-error safety net. Wrap any subtree that could throw at render
// time (e.g. the live preview pane) so one bad value shows a contained fallback
// instead of unmounting the whole app. Pass a `resetKey` that changes when the
// boundary should retry (e.g. the current step key) — a new key clears the error
// so navigating away from a broken view recovers automatically.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error, info) {
    // Surface in the console for debugging; the UI stays up via the fallback.
    console.error('Preview render error:', error, info?.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-xs">
              <div className="mx-auto w-11 h-11 rounded-lg bg-white border border-hs-border flex items-center justify-center text-hs-orange shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>
              <h3 className="mt-4 font-preview font-semibold text-hs-navy">Preview unavailable</h3>
              <p className="mt-2 text-sm text-hs-text-light font-preview">
                This preview hit a snag. Your answers are safe — move to another step and back, or keep configuring.
              </p>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
