import React from 'react'

type ErrorBoundaryProps = {
  children: React.ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep the error visible in the console even when we render a fallback UI.
    console.error('Render error:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    const isDev = (import.meta as any).env?.DEV

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          background:
            'radial-gradient(circle at top, rgba(217,181,109,0.18), transparent 22%), linear-gradient(180deg, #f8f3ea 0%, #f3ede4 52%, #efe7dc 100%)'
        }}
      >
        <div
          style={{
            width: 'min(820px, 100%)',
            padding: '28px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid rgba(8,26,44,0.08)',
            boxShadow: '0 24px 56px rgba(15, 23, 42, 0.08)'
          }}
        >
          <div style={{ color: '#9b8660', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '12px' }}>
            App Error
          </div>
          <h1 style={{ margin: '12px 0 8px', color: '#081A2C', fontSize: '28px', letterSpacing: '-0.02em' }}>
            Something crashed while rendering this page
          </h1>
          <div style={{ color: '#5f5a54', lineHeight: 1.7 }}>
            {this.state.error.message || 'Unknown error'}
          </div>

          {isDev && this.state.error.stack && (
            <pre
              style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(8,26,44,0.04)',
                border: '1px solid rgba(8,26,44,0.08)',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                color: '#0f172a',
                fontSize: '12px',
                lineHeight: 1.6
              }}
            >
              {this.state.error.stack}
            </pre>
          )}

          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: '18px',
              height: '44px',
              padding: '0 16px',
              borderRadius: '999px',
              border: 'none',
              background: '#081A2C',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}

