// Unified Error State Components for Follow.ai
// Use these components for all error displays

import React from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Error Icons
// ============================================

const ErrorIcon = () => (
  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const NetworkErrorIcon = () => (
  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    />
  </svg>
);

const NotFoundIcon = () => (
  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ServerErrorIcon = () => (
  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
    />
  </svg>
);

const AuthErrorIcon = () => (
  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

// ============================================
// Main Error State Component
// ============================================

type ErrorType = 'generic' | 'network' | 'notFound' | 'server' | 'auth' | 'permission';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  error?: Error | string | null;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
  className?: string;
}

const errorConfig: Record<ErrorType, { icon: React.ReactNode; title: string; message: string }> = {
  generic: {
    icon: <ErrorIcon />,
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
  network: {
    icon: <NetworkErrorIcon />,
    title: 'Connection error',
    message: 'Please check your internet connection and try again.',
  },
  notFound: {
    icon: <NotFoundIcon />,
    title: 'Page not found',
    message: 'The page you\'re looking for doesn\'t exist or has been moved.',
  },
  server: {
    icon: <ServerErrorIcon />,
    title: 'Server error',
    message: 'Our servers are having trouble. Please try again later.',
  },
  auth: {
    icon: <AuthErrorIcon />,
    title: 'Authentication required',
    message: 'Please log in to access this content.',
  },
  permission: {
    icon: <AuthErrorIcon />,
    title: 'Access denied',
    message: 'You don\'t have permission to view this content.',
  },
};

export function ErrorState({
  type = 'generic',
  title,
  message,
  error,
  onRetry,
  onGoBack,
  onGoHome,
  showDetails = false,
  className,
}: ErrorStateProps) {
  const config = errorConfig[type];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const errorDetails = error instanceof Error ? error.message : error;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      <div className="text-red-400 mb-4">{config.icon}</div>
      
      <h2 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">
        {displayTitle}
      </h2>
      
      <p className="text-gray-400 dark:text-gray-300 max-w-md mb-6">
        {displayMessage}
      </p>

      {showDetails && errorDetails && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <p className="text-sm text-red-600 dark:text-red-400 font-mono break-all">
            {errorDetails}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
        
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="px-4 py-2 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
          >
            Go Back
          </button>
        )}
        
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="px-4 py-2 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// Inline Error Component
// ============================================

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className }: InlineErrorProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm text-red-700 dark:text-red-300">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ============================================
// Form Error Component
// ============================================

interface FormErrorProps {
  error?: string | null;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;

  return (
    <p className={cn('text-sm text-red-600 dark:text-red-400 mt-1', className)}>
      {error}
    </p>
  );
}

// ============================================
// Alert Error Component
// ============================================

interface AlertErrorProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function AlertError({ title, message, onDismiss, className }: AlertErrorProps) {
  return (
    <div
      className={cn(
        'relative p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg',
        className
      )}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-red-400 hover:text-red-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {title && (
        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">{title}</h4>
      )}
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}

// ============================================
// Error Boundary Fallback
// ============================================

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorBoundaryFallback({ error, resetErrorBoundary }: ErrorBoundaryFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white/5 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full">
        <ErrorState
          type="generic"
          title="Application Error"
          message="Something went wrong in the application. Please try refreshing the page."
          error={error}
          showDetails={process.env.NODE_ENV === 'development'}
          onRetry={resetErrorBoundary}
          onGoHome={() => window.location.href = '/'}
        />
      </div>
    </div>
  );
}

// ============================================
// 404 Page Component
// ============================================

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-200 dark:text-gray-200 mb-4">404</div>
        <ErrorState
          type="notFound"
          onGoBack={() => window.history.back()}
          onGoHome={() => window.location.href = '/'}
        />
      </div>
    </div>
  );
}

// ============================================
// Export all
// ============================================

export default {
  ErrorState,
  InlineError,
  FormError,
  AlertError,
  ErrorBoundaryFallback,
  NotFoundPage,
};
