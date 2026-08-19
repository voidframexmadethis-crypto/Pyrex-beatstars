import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.name || 'Component'}] caught an error:`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="p-6 md:p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto my-12"
          style={{
            background: 'rgba(11, 12, 16, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '16px',
            color: '#ffffff'
          }}
          id={`error-boundary-container-${this.props.name || 'general'}`}
        >
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong loading this section, but your player is still running!</h2>
          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            The {this.props.name || 'component'} encountered a temporary issue. The rest of the app is still operational.
          </p>
          {this.state.error && (
            <pre className="text-[10px] text-red-400 bg-black/40 border border-red-950 p-3 rounded-lg w-full text-left overflow-x-auto max-h-32 mb-6 font-mono leading-tight">
              {this.state.error.message || String(this.state.error)}
            </pre>
          )}
          <div className="flex gap-4">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 text-xs font-bold transition-all hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-[10px] bg-transparent cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-xs font-bold transition-all hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-[10px] bg-transparent cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
