/**
 * Route Code Splitting Utilities
 * Optimizes bundle size by lazy loading route components
 */

import { lazy, ComponentType, ReactNode } from 'react';

/**
 * Create a lazy-loaded route component with error handling
 * @param importFunc - The dynamic import function
 * @param componentName - Name of the component for error logging
 * @returns A lazy-loaded component
 */
export function createLazyRoute<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string
): T {
  return lazy(() =>
    importFunc().catch((err) => {
      console.error(`Failed to load ${componentName}:`, err);
      // Return a fallback component
      return {
        default: (() => (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Failed to load {componentName}
              </h1>
              <p className="text-gray-600 mb-4">
                An error occurred while loading this page. Please try refreshing.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )) as T,
      };
    })
  ) as T;
}

/**
 * Preload a lazy route component
 * Useful for preloading routes that are likely to be visited next
 * @param importFunc - The dynamic import function
 */
export function preloadRoute(
  importFunc: () => Promise<{ default: any }>
): void {
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback if available, otherwise use setTimeout
    const callback = () => {
      importFunc().catch((err) => {
        console.warn('Failed to preload route:', err);
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback);
    } else {
      setTimeout(callback, 2000);
    }
  }
}

/**
 * Batch preload multiple routes
 * @param importFuncs - Array of dynamic import functions
 */
export function preloadRoutes(
  importFuncs: Array<() => Promise<{ default: any }>>
): void {
  importFuncs.forEach((importFunc) => {
    preloadRoute(importFunc);
  });
}

/**
 * Get route chunk size information
 * Useful for monitoring bundle size
 */
export function getRouteChunkInfo(): Record<string, string> {
  return {
    'Home': 'Main landing page',
    'Profile': 'User profile and settings',
    'Tasks': 'Task management',
    'Dashboard': 'User dashboard',
    'Leaderboard': 'Leaderboard and rankings',
    'Payments': 'Payment management',
    'Admin': 'Admin dashboard',
  };
}

export default {
  createLazyRoute,
  preloadRoute,
  preloadRoutes,
  getRouteChunkInfo,
};
