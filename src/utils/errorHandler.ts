// Centralized error handling for Follow.ai
// All errors should be processed through this module

import { toast } from 'sonner';

// ============================================
// Error Types
// ============================================

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    
    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(message, 'FORBIDDEN', 403, true);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404, true);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 0, true);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super(
      'Too many requests. Please try again later.',
      'RATE_LIMIT',
      429,
      true,
      retryAfter ? { retryAfter } : undefined
    );
  }
}

// ============================================
// Error Messages (i18n ready)
// ============================================

export const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  en: {
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    AUTH_ERROR: 'Please log in to continue.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    RATE_LIMIT: 'Too many requests. Please wait a moment.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Our team has been notified.',
  },
  zh: {
    UNKNOWN_ERROR: '发生未知错误，请重试。',
    VALIDATION_ERROR: '请检查输入并重试。',
    AUTH_ERROR: '请登录后继续。',
    FORBIDDEN: '您没有权限执行此操作。',
    NOT_FOUND: '请求的资源未找到。',
    NETWORK_ERROR: '网络错误，请检查您的连接。',
    RATE_LIMIT: '请求过于频繁，请稍后再试。',
    TIMEOUT: '请求超时，请重试。',
    SERVER_ERROR: '服务器错误，我们的团队已收到通知。',
  },
};

// ============================================
// Error Handler Functions
// ============================================

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown, language: string = 'en'): string {
  const messages = ERROR_MESSAGES[language] || ERROR_MESSAGES.en;
  
  if (error instanceof AppError) {
    return messages[error.code] || error.message;
  }
  
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('fetch')) {
      return messages.NETWORK_ERROR;
    }
    if (error.message.includes('timeout')) {
      return messages.TIMEOUT;
    }
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return messages.UNKNOWN_ERROR;
}

/**
 * Log error to console with context
 */
export function logError(
  error: unknown,
  context?: string,
  additionalInfo?: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    ...additionalInfo,
  };

  if (error instanceof AppError) {
    console.error(`[${timestamp}] [${error.code}]`, {
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      ...errorInfo,
    });
  } else if (error instanceof Error) {
    console.error(`[${timestamp}] [ERROR]`, {
      message: error.message,
      stack: error.stack,
      ...errorInfo,
    });
  } else {
    console.error(`[${timestamp}] [UNKNOWN]`, {
      error,
      ...errorInfo,
    });
  }
}

/**
 * Show error toast to user
 */
export function showErrorToast(
  error: unknown,
  language: string = 'en',
  customMessage?: string
): void {
  const message = customMessage || getErrorMessage(error, language);
  toast.error(message);
}

/**
 * Handle API errors consistently
 */
export function handleApiError(
  error: unknown,
  context: string,
  options: {
    showToast?: boolean;
    language?: string;
    customMessage?: string;
    rethrow?: boolean;
  } = {}
): void {
  const {
    showToast = true,
    language = 'en',
    customMessage,
    rethrow = false,
  } = options;

  // Log the error
  logError(error, context);

  // Show toast if enabled
  if (showToast) {
    showErrorToast(error, language, customMessage);
  }

  // Rethrow if needed
  if (rethrow) {
    throw error;
  }
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: string,
  options: {
    showToast?: boolean;
    language?: string;
    fallbackValue?: unknown;
  } = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, context, {
        showToast: options.showToast ?? true,
        language: options.language,
      });
      return options.fallbackValue;
    }
  }) as T;
}

/**
 * Parse error from API response
 */
export function parseApiError(response: Response, data?: unknown): AppError {
  const status = response.status;
  
  // Extract message from response data
  let message = 'An error occurred';
  if (data && typeof data === 'object' && 'message' in data) {
    message = String((data as { message: string }).message);
  } else if (data && typeof data === 'object' && 'error' in data) {
    message = String((data as { error: string }).error);
  }

  // Map status codes to error types
  switch (status) {
    case 400:
      return new ValidationError(message);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AuthorizationError(message);
    case 404:
      return new NotFoundError();
    case 429:
      return new RateLimitError();
    default:
      return new AppError(message, 'API_ERROR', status);
  }
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (!shouldRetry(error) || attempt === maxRetries - 1) {
        throw error;
      }
      
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// ============================================
// React Error Boundary Helper
// ============================================

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export function createErrorBoundaryState(): ErrorBoundaryState {
  return {
    hasError: false,
    error: null,
    errorInfo: null,
  };
}

export function handleErrorBoundary(
  error: Error,
  errorInfo: React.ErrorInfo
): ErrorBoundaryState {
  logError(error, 'ErrorBoundary', {
    componentStack: errorInfo.componentStack,
  });
  
  return {
    hasError: true,
    error,
    errorInfo,
  };
}
