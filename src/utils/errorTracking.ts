/**
 * Error Tracking and Logging Utilities
 */

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  additionalInfo?: Record<string, any>;
}

interface ErrorTrackingConfig {
  enabled: boolean;
  endpoint?: string;
  sampleRate: number; // 0-1, percentage of errors to report
  ignorePatterns: RegExp[];
}

const defaultConfig: ErrorTrackingConfig = {
  enabled: true,
  sampleRate: 1,
  ignorePatterns: [
    /ResizeObserver loop/i,
    /Script error/i,
    /Loading chunk/i,
  ],
};

let config = { ...defaultConfig };
let errorQueue: ErrorInfo[] = [];
const MAX_QUEUE_SIZE = 50;

/**
 * Initialize error tracking
 */
export const initErrorTracking = (customConfig?: Partial<ErrorTrackingConfig>) => {
  config = { ...defaultConfig, ...customConfig };

  if (!config.enabled) return;

  // Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    trackError({
      message: String(message),
      stack: error?.stack,
      additionalInfo: { source, lineno, colno },
    });
    return false;
  };

  // Unhandled promise rejection handler
  window.onunhandledrejection = (event) => {
    trackError({
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
    });
  };

  // Console error override
  const originalConsoleError = console.error;
  console.error = (...args) => {
    trackError({
      message: args.map((arg) => String(arg)).join(' '),
      additionalInfo: { type: 'console.error' },
    });
    originalConsoleError.apply(console, args);
  };
};

/**
 * Track an error
 */
export const trackError = (error: {
  message: string;
  stack?: string;
  componentStack?: string;
  additionalInfo?: Record<string, any>;
}) => {
  if (!config.enabled) return;

  // Check if error should be ignored
  if (config.ignorePatterns.some((pattern) => pattern.test(error.message))) {
    return;
  }

  // Sample rate check
  if (Math.random() > config.sampleRate) {
    return;
  }

  const errorInfo: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    componentStack: error.componentStack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    userId: getUserId(),
    additionalInfo: error.additionalInfo,
  };

  // Add to queue
  errorQueue.push(errorInfo);
  if (errorQueue.length > MAX_QUEUE_SIZE) {
    errorQueue.shift();
  }

  // Send to endpoint if configured
  if (config.endpoint) {
    sendError(errorInfo);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🔴 Error Tracked');
    console.log('Message:', errorInfo.message);
    console.log('Stack:', errorInfo.stack);
    console.log('Additional Info:', errorInfo.additionalInfo);
    console.groupEnd();
  }
};

/**
 * Send error to tracking endpoint
 */
const sendError = async (error: ErrorInfo) => {
  if (!config.endpoint) return;

  try {
    await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error),
    });
  } catch (e) {
    // Silently fail to avoid infinite loops
  }
};

/**
 * Get user ID from storage
 */
const getUserId = (): string | undefined => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.id || parsed.userId;
    }
  } catch {
    return undefined;
  }
  return undefined;
};

/**
 * Get error queue for debugging
 */
export const getErrorQueue = (): ErrorInfo[] => {
  return [...errorQueue];
};

/**
 * Clear error queue
 */
export const clearErrorQueue = () => {
  errorQueue = [];
};

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

let currentLogLevel = LogLevel.INFO;

/**
 * Set log level
 */
export const setLogLevel = (level: LogLevel) => {
  currentLogLevel = level;
};

/**
 * Logger utility
 */
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (currentLogLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, error?: Error, ...args: any[]) => {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error, ...args);
      if (error) {
        trackError({
          message,
          stack: error.stack,
          additionalInfo: { args },
        });
      }
    }
  },
};

/**
 * Create a breadcrumb trail for debugging
 */
const breadcrumbs: Array<{
  type: string;
  message: string;
  timestamp: string;
  data?: any;
}> = [];
const MAX_BREADCRUMBS = 30;

export const addBreadcrumb = (
  type: 'navigation' | 'click' | 'api' | 'console' | 'custom',
  message: string,
  data?: any
) => {
  breadcrumbs.push({
    type,
    message,
    timestamp: new Date().toISOString(),
    data,
  });

  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs.shift();
  }
};

export const getBreadcrumbs = () => [...breadcrumbs];

export const clearBreadcrumbs = () => {
  breadcrumbs.length = 0;
};

export default {
  initErrorTracking,
  trackError,
  getErrorQueue,
  clearErrorQueue,
  setLogLevel,
  logger,
  addBreadcrumb,
  getBreadcrumbs,
  clearBreadcrumbs,
  LogLevel,
};
