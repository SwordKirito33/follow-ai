/**
 * React Query Configuration
 * Centralized QueryClient setup with caching, retry, and sync strategies
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { captureException } from '@/lib/sentry';

/**
 * Default query options
 */
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache time: 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests 3 times
    retry: 3,
    // Retry delay: exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Refetch on mount
    refetchOnMount: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Don't retry on 4xx errors
    retryOnMount: true,
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
    // Retry delay
    retryDelay: 1000,
  },
};

/**
 * Create QueryClient instance
 */
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
  logger: {
    log: (message) => {
      if (import.meta.env.DEV) {
        console.log('[React Query]', message);
      }
    },
    warn: (message) => {
      if (import.meta.env.DEV) {
        console.warn('[React Query]', message);
      }
    },
    error: (message) => {
      console.error('[React Query]', message);
      // Report to Sentry
      captureException(new Error(message), { source: 'react-query' });
    },
  },
});

/**
 * Query key factory for type-safe query keys
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  // User queries
  user: {
    all: ['user'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
    xpHistory: (userId: string) => [...queryKeys.user.all, 'xpHistory', userId] as const,
    achievements: (userId: string) => [...queryKeys.user.all, 'achievements', userId] as const,
    stats: (userId: string) => [...queryKeys.user.all, 'stats', userId] as const,
  },

  // Task queries
  task: {
    all: ['task'] as const,
    list: (filters?: any) => [...queryKeys.task.all, 'list', filters] as const,
    detail: (taskId: string) => [...queryKeys.task.all, 'detail', taskId] as const,
    submissions: (taskId: string) => [...queryKeys.task.all, 'submissions', taskId] as const,
    leaderboard: () => [...queryKeys.task.all, 'leaderboard'] as const,
  },

  // Tool queries
  tool: {
    all: ['tool'] as const,
    list: (filters?: any) => [...queryKeys.tool.all, 'list', filters] as const,
    detail: (toolId: string) => [...queryKeys.tool.all, 'detail', toolId] as const,
    reviews: (toolId: string) => [...queryKeys.tool.all, 'reviews', toolId] as const,
  },

  // Hire queries
  hire: {
    all: ['hire'] as const,
    list: (filters?: any) => [...queryKeys.hire.all, 'list', filters] as const,
    detail: (hireId: string) => [...queryKeys.hire.all, 'detail', hireId] as const,
    applications: () => [...queryKeys.hire.all, 'applications'] as const,
  },

  // Notification queries
  notification: {
    all: ['notification'] as const,
    list: () => [...queryKeys.notification.all, 'list'] as const,
    unread: () => [...queryKeys.notification.all, 'unread'] as const,
  },

  // Wallet queries
  wallet: {
    all: ['wallet'] as const,
    balance: (userId: string) => [...queryKeys.wallet.all, 'balance', userId] as const,
    transactions: (userId: string) => [...queryKeys.wallet.all, 'transactions', userId] as const,
  },

  // Admin queries
  admin: {
    all: ['admin'] as const,
    users: (filters?: any) => [...queryKeys.admin.all, 'users', filters] as const,
    tasks: (filters?: any) => [...queryKeys.admin.all, 'tasks', filters] as const,
    reports: (filters?: any) => [...queryKeys.admin.all, 'reports', filters] as const,
  },
};

export default queryClient;
