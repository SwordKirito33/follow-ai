/**
 * API Request Utilities with retry, caching, and error handling
 */

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTime?: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Create a fetch request with timeout
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Sleep utility for retry delay
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate cache key from URL and options
 */
const getCacheKey = (url: string, options?: RequestInit): string => {
  const method = options?.method || 'GET';
  const body = options?.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
};

/**
 * Check if cache entry is valid
 */
const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() < entry.expiresAt;
};

/**
 * Main API request function
 */
export const apiRequest = async <T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<T> => {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    cache: useCache = false,
    cacheTime = DEFAULT_CACHE_TIME,
    ...fetchOptions
  } = config;

  // Check cache for GET requests
  if (useCache && (!fetchOptions.method || fetchOptions.method === 'GET')) {
    const cacheKey = getCacheKey(url, fetchOptions);
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      return cached.data;
    }
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions, timeout);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorBody
        );
      }

      const data = await response.json();

      // Cache successful GET responses
      if (useCache && (!fetchOptions.method || fetchOptions.method === 'GET')) {
        const cacheKey = getCacheKey(url, fetchOptions);
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          expiresAt: Date.now() + cacheTime,
        });
      }

      return data;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Don't retry on abort
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      // Wait before retrying
      if (attempt < retries) {
        await sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Request failed');
};

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  status: number;
  body?: string;

  constructor(message: string, status: number, body?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * GET request helper
 */
export const get = <T = any>(url: string, config?: RequestConfig): Promise<T> => {
  return apiRequest<T>(url, { ...config, method: 'GET' });
};

/**
 * POST request helper
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return apiRequest<T>(url, {
    ...config,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(data),
  });
};

/**
 * PUT request helper
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return apiRequest<T>(url, {
    ...config,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(data),
  });
};

/**
 * PATCH request helper
 */
export const patch = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return apiRequest<T>(url, {
    ...config,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request helper
 */
export const del = <T = any>(url: string, config?: RequestConfig): Promise<T> => {
  return apiRequest<T>(url, { ...config, method: 'DELETE' });
};

/**
 * Clear API cache
 */
export const clearCache = (pattern?: string) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

/**
 * Create an API client with base URL
 */
export const createApiClient = (baseUrl: string, defaultConfig?: RequestConfig) => {
  return {
    get: <T = any>(path: string, config?: RequestConfig) =>
      get<T>(`${baseUrl}${path}`, { ...defaultConfig, ...config }),
    post: <T = any>(path: string, data?: any, config?: RequestConfig) =>
      post<T>(`${baseUrl}${path}`, data, { ...defaultConfig, ...config }),
    put: <T = any>(path: string, data?: any, config?: RequestConfig) =>
      put<T>(`${baseUrl}${path}`, data, { ...defaultConfig, ...config }),
    patch: <T = any>(path: string, data?: any, config?: RequestConfig) =>
      patch<T>(`${baseUrl}${path}`, data, { ...defaultConfig, ...config }),
    delete: <T = any>(path: string, config?: RequestConfig) =>
      del<T>(`${baseUrl}${path}`, { ...defaultConfig, ...config }),
  };
};

export default {
  apiRequest,
  get,
  post,
  put,
  patch,
  delete: del,
  clearCache,
  createApiClient,
  ApiError,
};
