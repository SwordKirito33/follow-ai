import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertCircle size={32} className="text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
                <summary className="cursor-pointer font-semibold mb-2">Error details</summary>
                <pre className="whitespace-pre-wrap overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

