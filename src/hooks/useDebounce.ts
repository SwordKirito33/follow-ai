import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * Custom hook for throttling function calls
 * @param callback - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastCall);
      }
    },
    [callback, delay]
  );
}

/**
 * Custom hook to prevent duplicate form submissions
 * @param callback - Function to execute
 * @param delay - Delay between submissions in milliseconds
 * @returns Function that prevents duplicate calls
 */
export function usePreventDuplicateSubmit<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  delay: number = 1000
): (...args: Parameters<T>) => Promise<void> {
  const isSubmittingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    async (...args: Parameters<T>) => {
      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;

      try {
        await callback(...args);
      } finally {
        timeoutRef.current = setTimeout(() => {
          isSubmittingRef.current = false;
        }, delay);
      }
    },
    [callback, delay]
  );
}
