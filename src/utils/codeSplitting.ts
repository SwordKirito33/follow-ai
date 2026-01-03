// Code Splitting and Lazy Loading Utilities for Follow.ai
// Tools for optimizing bundle size and loading performance

import React, { Suspense, ComponentType, lazy } from 'react';

// ============================================
// Types
// ============================================

interface LazyComponentOptions {
  fallback?: React.ReactNode;
  preload?: boolean;
  retry?: number;
  retryDelay?: number;
}

interface PreloadableComponent<T extends ComponentType<unknown>> {
  Component: React.LazyExoticComponent<T>;
  preload: () => Promise<{ default: T }>;
}

// ============================================
// Lazy Component Factory
// ============================================

/**
 * Create a lazy-loaded component with preload capability
 */
export function createLazyComponent<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): PreloadableComponent<T> {
  const { retry = 3, retryDelay = 1000 } = options;

  // Retry logic for failed imports
  const importWithRetry = async (): Promise<{ default: T }> => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retry; i++) {
      try {
        return await importFn();
      } catch (error) {
        lastError = error as Error;
        if (i < retry - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (i + 1)));
        }
      }
    }
    
    throw lastError;
  };

  const Component = lazy(importWithRetry);

  return {
    Component,
    preload: importWithRetry,
  };
}

// ============================================
// Lazy Component Wrapper
// ============================================

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Default loading fallback component
 */
function DefaultFallback(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <span className="text-sm text-gray-500">加载中...</span>
      </div>
    </div>
  );
}

/**
 * Wrapper component for lazy-loaded components
 */
export function LazyWrapper({ children, fallback }: LazyWrapperProps): JSX.Element {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  );
}

// ============================================
// Route-based Code Splitting
// ============================================

/**
 * Lazy load page components
 */
export const lazyPages = {
  Home: createLazyComponent(() => import('../pages/Home')),
  Tasks: createLazyComponent(() => import('../pages/Tasks')),
  Profile: createLazyComponent(() => import('../pages/Profile')),
  Dashboard: createLazyComponent(() => import('../pages/Dashboard')),
  Leaderboard: createLazyComponent(() => import('../pages/Leaderboard')),
  DeveloperWallet: createLazyComponent(() => import('../pages/DeveloperWallet')),
  Settings: createLazyComponent(() => import('../pages/Settings')),
  Help: createLazyComponent(() => import('../pages/Help')),
  NotFound: createLazyComponent(() => import('../pages/NotFound')),
};

// ============================================
// Preload Strategies
// ============================================

/**
 * Preload component on mouse enter (hover intent)
 */
export function usePreloadOnHover<T extends ComponentType<unknown>>(
  component: PreloadableComponent<T>
): {
  onMouseEnter: () => void;
  Component: React.LazyExoticComponent<T>;
} {
  let preloaded = false;

  return {
    onMouseEnter: () => {
      if (!preloaded) {
        component.preload();
        preloaded = true;
      }
    },
    Component: component.Component,
  };
}

/**
 * Preload component when visible in viewport
 */
export function preloadOnVisible<T extends ComponentType<unknown>>(
  component: PreloadableComponent<T>,
  element: Element
): () => void {
  let preloaded = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !preloaded) {
          component.preload();
          preloaded = true;
          observer.disconnect();
        }
      });
    },
    { rootMargin: '100px' }
  );

  observer.observe(element);

  return () => observer.disconnect();
}

/**
 * Preload component after idle time
 */
export function preloadOnIdle<T extends ComponentType<unknown>>(
  component: PreloadableComponent<T>,
  timeout: number = 2000
): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => component.preload(),
      { timeout }
    );
  } else {
    setTimeout(() => component.preload(), timeout);
  }
}

/**
 * Preload multiple components
 */
export function preloadComponents<T extends ComponentType<unknown>>(
  components: PreloadableComponent<T>[]
): Promise<void[]> {
  return Promise.all(components.map((c) => c.preload().then(() => undefined)));
}

// ============================================
// Dynamic Import Helpers
// ============================================

/**
 * Dynamically import a module
 */
export async function dynamicImport<T>(
  importFn: () => Promise<T>
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    console.error('Failed to load module:', error);
    throw error;
  }
}

/**
 * Import with named export
 */
export async function importNamed<T, K extends keyof T>(
  importFn: () => Promise<T>,
  name: K
): Promise<T[K]> {
  const module = await importFn();
  return module[name];
}

// ============================================
// Chunk Naming
// ============================================

/**
 * Create a named chunk for webpack
 * Usage: lazyWithChunkName(() => import(/* webpackChunkName: "my-chunk" * / './MyComponent'))
 */
export function lazyWithChunkName<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  chunkName: string
): React.LazyExoticComponent<T> {
  // The chunk name is handled by the import comment in the actual usage
  // This function just provides a clear API
  return lazy(importFn);
}

// ============================================
// Bundle Analysis Helpers
// ============================================

/**
 * Log loaded chunks for debugging
 */
export function logLoadedChunks(): void {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const chunks = scripts
    .map((script) => script.getAttribute('src'))
    .filter((src): src is string => src !== null && src.includes('chunk'));

  console.group('Loaded Chunks');
  chunks.forEach((chunk) => console.log(chunk));
  console.groupEnd();
}

/**
 * Get estimated bundle size
 */
export function getEstimatedBundleSize(): { js: number; css: number; total: number } {
  if (typeof window === 'undefined') {
    return { js: 0, css: 0, total: 0 };
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const jsSize = resources
    .filter((r) => r.name.endsWith('.js'))
    .reduce((acc, r) => acc + (r.transferSize || 0), 0);
  
  const cssSize = resources
    .filter((r) => r.name.endsWith('.css'))
    .reduce((acc, r) => acc + (r.transferSize || 0), 0);

  return {
    js: Math.round(jsSize / 1024),
    css: Math.round(cssSize / 1024),
    total: Math.round((jsSize + cssSize) / 1024),
  };
}

// ============================================
// Export All
// ============================================

export default {
  createLazyComponent,
  LazyWrapper,
  lazyPages,
  usePreloadOnHover,
  preloadOnVisible,
  preloadOnIdle,
  preloadComponents,
  dynamicImport,
  importNamed,
  lazyWithChunkName,
  logLoadedChunks,
  getEstimatedBundleSize,
};
