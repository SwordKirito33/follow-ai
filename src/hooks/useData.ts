// Data Fetching Hooks for Follow.ai
// Provides hooks for fetching and caching data

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// Types
// ============================================

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============================================
// useAsync Hook
// ============================================

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncState<T> & {
  execute: () => Promise<T | null>;
  reset: () => void;
} {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    isError: false,
    isSuccess: false,
  });

  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isError: false,
    }));

    try {
      const data = await asyncFn();
      
      if (mountedRef.current) {
        setState({
          data,
          error: null,
          isLoading: false,
          isError: false,
          isSuccess: true,
        });
        onSuccess?.(data);
      }
      
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      if (mountedRef.current) {
        setState({
          data: null,
          error: err,
          isLoading: false,
          isError: true,
          isSuccess: false,
        });
        onError?.(err);
      }
      
      return null;
    }
  }, [asyncFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { ...state, execute, reset };
}

// ============================================
// useFetch Hook
// ============================================

interface UseFetchOptions extends RequestInit {
  immediate?: boolean;
  transform?: (data: unknown) => unknown;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): UseAsyncState<T> & {
  execute: () => Promise<T | null>;
  refetch: () => Promise<T | null>;
} {
  const { immediate = true, transform, onSuccess, onError, ...fetchOptions } = options;

  const fetchFn = useCallback(async () => {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data = await response.json();
    
    if (transform) {
      data = transform(data);
    }
    
    return data as T;
  }, [url, JSON.stringify(fetchOptions)]);

  const result = useAsync<T>(fetchFn, { immediate, onSuccess, onError });

  return {
    ...result,
    refetch: result.execute,
  };
}

// ============================================
// usePagination Hook
// ============================================

export function usePagination(options: UsePaginationOptions = {}): PaginationState & {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
} {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems: initialTotalItems = 0,
  } = options;

  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [totalItems, setTotalItemsState] = useState(initialTotalItems);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const setPage = useCallback((newPage: number) => {
    setPageState(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(Math.max(1, newSize));
    setPageState(1); // Reset to first page when page size changes
  }, []);

  const setTotalItems = useCallback((total: number) => {
    setTotalItemsState(Math.max(0, total));
  }, []);

  const nextPage = useCallback(() => {
    if (hasNextPage) setPage(page + 1);
  }, [hasNextPage, page, setPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setPage(page - 1);
  }, [hasPrevPage, page, setPage]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [setPage, totalPages]);

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    setPage,
    setPageSize,
    setTotalItems,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  };
}

// ============================================
// useInfiniteScroll Hook
// ============================================

interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<T[]>;
  pageSize?: number;
  threshold?: number;
}

export function useInfiniteScroll<T>({
  fetchFn,
  pageSize = 10,
  threshold = 100,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const newItems = await fetchFn(page);
      
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
      
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, pageSize, isLoading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  // Set up intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMore, hasMore, isLoading, threshold]);

  return {
    items,
    isLoading,
    hasMore,
    error,
    loadMoreRef,
    loadMore,
    reset,
  };
}

// ============================================
// useDebounce Hook
// ============================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// useThrottle Hook
// ============================================

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    
    if (now - lastUpdated.current >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

// ============================================
// useLocalStorage Hook
// ============================================

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// ============================================
// useSessionStorage Hook
// ============================================

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// ============================================
// Export all
// ============================================

export default {
  useAsync,
  useFetch,
  usePagination,
  useInfiniteScroll,
  useDebounce,
  useThrottle,
  useLocalStorage,
  useSessionStorage,
};
