/**
 * Global Error Handler Hook
 * Provides centralized error handling for the entire application
 */

import { useCallback, useEffect } from 'react';
import { handleApiError, handleAuthError, handleNetworkError, handleUnknownError } from '@/lib/errorHandler';
import { captureException } from '@/lib/sentry';

/**
 * Hook for handling errors globally
 */
export function useGlobalErrorHandler() {
  // Handle unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      
      // Determine error type and handle accordingly
      if (event.reason?.message?.includes('auth') || event.reason?.code === 'PGRST301') {
        handleAuthError(error);
      } else if (event.reason?.message?.includes('network') || event.reason?.code === 'NETWORK_ERROR') {
        handleNetworkError(error);
      } else {
        handleUnknownError(error);
      }
      
      // Prevent default browser behavior
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  // Handle global errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      const error = event.error instanceof Error ? event.error : new Error(event.message);
      
      // Log to Sentry
      captureException(error, {
        type: 'global_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      
      // Handle the error
      handleUnknownError(error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Callback for manual error handling
  const handleError = useCallback((error: any, context?: any) => {
    if (error?.response?.status === 401 || error?.code === 'PGRST301') {
      handleAuthError(error, context);
    } else if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
      handleNetworkError(error, context);
    } else if (error?.response?.status) {
      handleApiError(error, context);
    } else {
      handleUnknownError(error, context);
    }
  }, []);

  return { handleError };
}

export default useGlobalErrorHandler;
