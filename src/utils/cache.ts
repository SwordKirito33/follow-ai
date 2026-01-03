// Cache Management Utilities for Follow.ai
// Tools for caching data and optimizing network requests

// ============================================
// Types
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

// ============================================
// Memory Cache
// ============================================

class MemoryCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number;
  private defaultTTL: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
  }

  set(key: string, data: T, ttl?: number): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// ============================================
// Storage Cache
// ============================================

class StorageCache<T> {
  private prefix: string;
  private storage: Storage;
  private defaultTTL: number;

  constructor(
    prefix: string = 'cache',
    storage: 'localStorage' | 'sessionStorage' = 'localStorage',
    options: CacheOptions = {}
  ) {
    this.prefix = prefix;
    this.storage = typeof window !== 'undefined' 
      ? (storage === 'localStorage' ? localStorage : sessionStorage)
      : ({} as Storage);
    this.defaultTTL = options.ttl || 24 * 60 * 60 * 1000; // 24 hours default
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  set(key: string, data: T, ttl?: number): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL,
      };
      this.storage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (error) {
      // Handle quota exceeded error
      console.warn('Cache storage error:', error);
      this.cleanup();
    }
  }

  get(key: string): T | null {
    try {
      const item = this.storage.getItem(this.getKey(key));
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Check if entry has expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => this.storage.removeItem(key));
  }

  cleanup(): void {
    const now = Date.now();
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        try {
          const item = this.storage.getItem(key);
          if (item) {
            const entry: CacheEntry<T> = JSON.parse(item);
            if (now - entry.timestamp > entry.ttl) {
              this.storage.removeItem(key);
            }
          }
        } catch {
          this.storage.removeItem(key);
        }
      }
    }
  }
}

// ============================================
// Request Cache (SWR-like)
// ============================================

interface RequestCacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  dedupe?: boolean;
  dedupeInterval?: number;
}

class RequestCache {
  private cache: MemoryCache<unknown>;
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private lastFetchTime: Map<string, number> = new Map();
  private dedupeInterval: number;

  constructor(options: RequestCacheOptions = {}) {
    this.cache = new MemoryCache({ ttl: options.ttl || 5 * 60 * 1000 });
    this.dedupeInterval = options.dedupeInterval || 2000;
  }

  async fetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: RequestCacheOptions = {}
  ): Promise<T> {
    // Check for cached data
    const cached = this.cache.get(key) as T | null;
    
    // Check for pending request (dedupe)
    if (options.dedupe !== false) {
      const pending = this.pendingRequests.get(key);
      if (pending) {
        return pending as Promise<T>;
      }

      // Check if we recently fetched this key
      const lastFetch = this.lastFetchTime.get(key);
      if (lastFetch && Date.now() - lastFetch < this.dedupeInterval && cached) {
        return cached;
      }
    }

    // Return stale data while revalidating
    if (options.staleWhileRevalidate && cached) {
      // Revalidate in background
      this.revalidate(key, fetcher);
      return cached;
    }

    // Fetch fresh data
    const promise = fetcher().then((data) => {
      this.cache.set(key, data, options.ttl);
      this.pendingRequests.delete(key);
      this.lastFetchTime.set(key, Date.now());
      return data;
    }).catch((error) => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  private async revalidate<T>(key: string, fetcher: () => Promise<T>): Promise<void> {
    try {
      const data = await fetcher();
      this.cache.set(key, data);
      this.lastFetchTime.set(key, Date.now());
    } catch (error) {
      console.warn('Revalidation failed:', error);
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.lastFetchTime.delete(key);
  }

  invalidateAll(): void {
    this.cache.clear();
    this.lastFetchTime.clear();
  }
}

// ============================================
// LRU Cache
// ============================================

class LRUCache<T> {
  private cache: Map<string, T> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: string, value: T): void {
    // Delete if exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// ============================================
// Cache Factory
// ============================================

export function createCache<T>(options: CacheOptions = {}): MemoryCache<T> | StorageCache<T> {
  if (options.storage === 'localStorage' || options.storage === 'sessionStorage') {
    return new StorageCache<T>('follow-ai', options.storage, options);
  }
  return new MemoryCache<T>(options);
}

// ============================================
// Singleton Instances
// ============================================

export const memoryCache = new MemoryCache<unknown>();
export const localStorageCache = new StorageCache<unknown>('follow-ai', 'localStorage');
export const sessionStorageCache = new StorageCache<unknown>('follow-ai', 'sessionStorage');
export const requestCache = new RequestCache();
export const lruCache = new LRUCache<unknown>(100);

// ============================================
// Cache Decorators
// ============================================

/**
 * Memoize function results with cache
 */
export function memoize<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  options: { ttl?: number; keyResolver?: (...args: Parameters<T>) => string } = {}
): T {
  const cache = new MemoryCache<ReturnType<T>>({ ttl: options.ttl });

  return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = options.keyResolver
      ? options.keyResolver(...args)
      : JSON.stringify(args);

    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
}

/**
 * Cache async function results
 */
export function cacheAsync<T extends (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>>(
  fn: T,
  options: { ttl?: number; keyResolver?: (...args: Parameters<T>) => string } = {}
): T {
  const cache = new MemoryCache<Awaited<ReturnType<T>>>({ ttl: options.ttl });

  return async function (this: unknown, ...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    const key = options.keyResolver
      ? options.keyResolver(...args)
      : JSON.stringify(args);

    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
}

// ============================================
// Export All
// ============================================

export {
  MemoryCache,
  StorageCache,
  RequestCache,
  LRUCache,
};

export default {
  createCache,
  memoryCache,
  localStorageCache,
  sessionStorageCache,
  requestCache,
  lruCache,
  memoize,
  cacheAsync,
};
