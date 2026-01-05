/**
 * Toast notification system
 * Wrapper around sonner for consistent notifications
 */

import { toast as sonnerToast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show success toast
 */
export function showSuccess(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, {
    duration: options?.duration ?? 3000,
    description: options?.description,
    action: options?.action,
  });
}

/**
 * Show error toast
 */
export function showError(message: string, options?: ToastOptions) {
  return sonnerToast.error(message, {
    duration: options?.duration ?? 4000,
    description: options?.description,
    action: options?.action,
  });
}

/**
 * Show info toast
 */
export function showInfo(message: string, options?: ToastOptions) {
  return sonnerToast.info(message, {
    duration: options?.duration ?? 3000,
    description: options?.description,
    action: options?.action,
  });
}

/**
 * Show warning toast
 */
export function showWarning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(message, {
    duration: options?.duration ?? 3000,
    description: options?.description,
    action: options?.action,
  });
}

/**
 * Show loading toast
 */
export function showLoading(message: string, options?: ToastOptions) {
  return sonnerToast.loading(message, {
    duration: options?.duration,
    description: options?.description,
  });
}

/**
 * Show promise-based toast
 * Useful for async operations
 */
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: ToastOptions
) {
  return sonnerToast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    duration: options?.duration,
  });
}

/**
 * Dismiss toast
 */
export function dismissToast(toastId?: string | number) {
  sonnerToast.dismiss(toastId);
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts() {
  sonnerToast.dismiss();
}

export const toast = {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  loading: showLoading,
  promise: showPromise,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
};
