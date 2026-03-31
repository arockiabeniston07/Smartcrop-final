import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a2010] p-6 text-center">
          <div className="glass-card p-8 max-w-md border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page or navigating back.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary w-full py-3"
            >
              Go to Home
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-6 p-4 bg-black/40 rounded-xl text-left text-xs text-red-400 overflow-auto max-h-40 border border-white/5">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
