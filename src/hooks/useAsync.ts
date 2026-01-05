/**
 * useAsync Hook
 * Manages async operations with loading, error, and data states
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options: UseAsyncOptions = {}
) {
  const { onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
    isLoading: false,
  });

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      status: 'pending',
      isLoading: true,
    }));

    try {
      const result = await asyncFunction();

      if (isMountedRef.current) {
        setState({
          status: 'success',
          data: result,
          error: null,
          isLoading: false,
        });
        onSuccess?.(result);
      }

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (isMountedRef.current) {
        setState({
          status: 'error',
          data: null,
          error: err,
          isLoading: false,
        });
        onError?.(err);
      }

      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [execute, immediate]);

  return {
    ...state,
    execute,
  };
}
