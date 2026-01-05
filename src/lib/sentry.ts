/**
 * Sentry Error Tracking Configuration
 * Initializes Sentry for error tracking, performance monitoring, and session replay
 */

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Initialize Sentry with error tracking and performance monitoring
 * Should be called as early as possible in the application lifecycle
 */
export function initSentry() {
  // Only initialize in production or when explicitly enabled
  const isDev = import.meta.env.DEV;
  const enableInDev = import.meta.env.VITE_SENTRY_DEBUG === 'true';

  if (isDev && !enableInDev) {
    console.log('Sentry disabled in development mode');
    return;
  }

  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn('VITE_SENTRY_DSN not configured, Sentry disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_ENV || 'development',
    integrations: [
      new BrowserTracing({
        // Set sampling rate for performance monitoring
        tracePropagationTargets: ['localhost', /^\/$/],
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
    // We recommend adjusting this value in production
    tracesSampleRate: isDev ? 1.0 : 0.1,

    // Additional configuration
    beforeSend(event, hint) {
      // Filter out certain errors or modify events before sending
      if (event.exception) {
        const error = hint.originalException;

        // Don't send network errors in development
        if (isDev && error instanceof Error && error.message.includes('Network')) {
          return null;
        }
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'chrome-extension://',
      'moz-extension://',
      // Network errors
      'NetworkError',
      'Network request failed',
      // User cancelled
      'AbortError',
      'cancelled',
      // Random errors from third party scripts
      'Script error',
      'ResizeObserver loop limit exceeded',
    ],
  });

  console.log('Sentry initialized successfully');
}

/**
 * Capture an exception with Sentry
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
    }
    Sentry.captureException(error);
  });
}

/**
 * Capture a message with Sentry
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
    }
    Sentry.captureMessage(message, level);
  });
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, email?: string, username?: string) {
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
}

/**
 * Clear user context
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Set custom context for error tracking
 */
export function setCustomContext(key: string, value: any) {
  Sentry.setContext(key, value);
}

/**
 * Add breadcrumb for error tracking
 */
export function addBreadcrumb(
  message: string,
  category: string = 'user-action',
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Start a transaction for performance monitoring
 */
export function startTransaction(
  name: string,
  op: string = 'http.request'
): any {
  // Note: startTransaction API may not be available in newer Sentry versions
  // Use captureMessage or other APIs instead
  try {
    return (Sentry as any).startTransaction?.({
      name,
      op,
    }) || null;
  } catch (error) {
    console.warn('startTransaction not available:', error);
    return null;
  }
}

export default Sentry;
