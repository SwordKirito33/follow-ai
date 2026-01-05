/**
 * Global Error Handler
 * Centralized error handling and logging
 */

import { captureException, captureMessage, addBreadcrumb } from '@/lib/sentry';
import { toast } from '@/lib/toast';

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorContext {
  userId?: string;
  page?: string;
  action?: string;
  [key: string]: any;
}

/**
 * Handle API errors
 */
export function handleApiError(
  error: any,
  context?: ErrorContext,
  showToast: boolean = true
) {
  const errorMessage = getErrorMessage(error);
  const errorCode = getErrorCode(error);

  // Log to Sentry
  addBreadcrumb(`API Error: ${errorCode}`, 'api-error', 'error', {
    message: errorMessage,
    ...context,
  });

  if (error instanceof Error) {
    captureException(error, {
      errorCode,
      ...context,
    });
  } else {
    captureMessage(`API Error: ${errorMessage}`, 'error', context);
  }

  // Show user-friendly toast
  if (showToast) {
    const userMessage = getUserFriendlyMessage(errorCode, errorMessage);
    toast.error('Operation Failed', { description: userMessage });
  }

  console.error('API Error:', { errorCode, errorMessage, context });
}

/**
 * Handle authentication errors
 */
export function handleAuthError(error: any, context?: ErrorContext) {
  const errorMessage = getErrorMessage(error);

  addBreadcrumb('Auth Error', 'auth', 'error', { message: errorMessage, ...context });

  if (error instanceof Error) {
    captureException(error, { type: 'auth', ...context });
  }

  toast.error('Authentication Failed', {
    description: 'Please check your credentials and try again.',
  });

  console.error('Auth Error:', errorMessage);
}

/**
 * Handle validation errors
 */
export function handleValidationError(
  errors: Record<string, string>,
  context?: ErrorContext
) {
  addBreadcrumb('Validation Error', 'validation', 'warning', {
    errors,
    ...context,
  });

  const errorList = Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join(', ');

  toast.error('Validation Failed', { description: errorList });

  console.warn('Validation Error:', errors);
}

/**
 * Handle network errors
 */
export function handleNetworkError(error: any, context?: ErrorContext) {
  const errorMessage = getErrorMessage(error);

  addBreadcrumb('Network Error', 'network', 'error', {
    message: errorMessage,
    ...context,
  });

  if (error instanceof Error) {
    captureException(error, { type: 'network', ...context });
  }

  toast.error('Network Error', {
    description: 'Please check your internet connection and try again.',
  });

  console.error('Network Error:', errorMessage);
}

/**
 * Handle permission errors
 */
export function handlePermissionError(error: any, context?: ErrorContext) {
  const errorMessage = getErrorMessage(error);

  addBreadcrumb('Permission Error', 'permission', 'warning', {
    message: errorMessage,
    ...context,
  });

  if (error instanceof Error) {
    captureException(error, { type: 'permission', ...context });
  }

  toast.error('Permission Denied', {
    description: 'You do not have permission to perform this action.',
  });

  console.warn('Permission Error:', errorMessage);
}

/**
 * Handle unknown errors
 */
export function handleUnknownError(error: any, context?: ErrorContext) {
  const errorMessage = getErrorMessage(error);

  addBreadcrumb('Unknown Error', 'error', 'error', {
    message: errorMessage,
    ...context,
  });

  if (error instanceof Error) {
    captureException(error, { type: 'unknown', ...context });
  } else {
    captureMessage(`Unknown Error: ${errorMessage}`, 'error', context);
  }

  toast.error('Something Went Wrong', {
    description: 'An unexpected error occurred. Please try again later.',
  });

  console.error('Unknown Error:', error);
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Extract error code from various error types
 */
export function getErrorCode(error: any): string {
  if (error?.code) {
    return error.code;
  }

  if (error?.status) {
    return `HTTP_${error.status}`;
  }

  if (error?.error?.code) {
    return error.error.code;
  }

  return 'UNKNOWN_ERROR';
}

/**
 * Get user-friendly error message based on error code
 */
export function getUserFriendlyMessage(errorCode: string, fallback: string): string {
  const messages: Record<string, string> = {
    // Network errors
    NETWORK_ERROR: 'Network connection failed. Please check your internet.',
    TIMEOUT: 'Request timed out. Please try again.',
    'HTTP_400': 'Invalid request. Please check your input.',
    'HTTP_401': 'Authentication required. Please log in.',
    'HTTP_403': 'You do not have permission to perform this action.',
    'HTTP_404': 'The requested resource was not found.',
    'HTTP_409': 'Conflict detected. Please refresh and try again.',
    'HTTP_429': 'Too many requests. Please wait a moment and try again.',
    'HTTP_500': 'Server error. Please try again later.',
    'HTTP_503': 'Service unavailable. Please try again later.',

    // Auth errors
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_NOT_FOUND: 'User not found.',
    USER_ALREADY_EXISTS: 'This email is already registered.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',

    // Validation errors
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PASSWORD: 'Password does not meet requirements.',
    INVALID_INPUT: 'Please check your input and try again.',

    // Payment errors
    PAYMENT_FAILED: 'Payment failed. Please check your payment method.',
    INSUFFICIENT_FUNDS: 'Insufficient funds. Please check your account.',
    CARD_DECLINED: 'Your card was declined. Please try another payment method.',

    // File errors
    FILE_TOO_LARGE: 'File is too large. Please upload a smaller file.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported file.',
    FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',

    // Database errors
    DATABASE_ERROR: 'Database error. Please try again later.',
    DUPLICATE_ENTRY: 'This entry already exists.',
    CONSTRAINT_VIOLATION: 'Operation violates data constraints.',
  };

  return messages[errorCode] || fallback;
}

/**
 * Log a user action for debugging
 */
export function logUserAction(action: string, data?: any) {
  addBreadcrumb(action, 'user-action', 'info', data);
  console.log(`User Action: ${action}`, data);
}

/**
 * Log a system event
 */
export function logSystemEvent(event: string, data?: any) {
  addBreadcrumb(event, 'system', 'info', data);
  console.log(`System Event: ${event}`, data);
}

/**
 * Create a safe error for display
 */
export function createSafeError(message: string, code?: string): Error {
  const error = new Error(message);
  (error as any).code = code || 'SAFE_ERROR';
  return error;
}

export default {
  handleApiError,
  handleAuthError,
  handleValidationError,
  handleNetworkError,
  handlePermissionError,
  handleUnknownError,
  getErrorMessage,
  getErrorCode,
  getUserFriendlyMessage,
  logUserAction,
  logSystemEvent,
  createSafeError,
};
