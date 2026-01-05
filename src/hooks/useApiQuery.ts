/**
 * API Query Hooks Factory
 * Provides type-safe, reusable hooks for fetching data
 */

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import { handleApiError } from '@/lib/errorHandler';

/**
 * Generic hook for fetching data from Supabase
 */
export function useSupabaseQuery<T>(
  key: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn,
    ...options,
  });
}

/**
 * Fetch user profile
 */
export function useUserProfile(userId: string, enabled = true) {
  return useSupabaseQuery(
    queryKeys.user.profile(userId),
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    { enabled: !!userId && enabled }
  );
}

/**
 * Fetch user XP history
 */
export function useUserXpHistory(userId: string, limit = 50) {
  return useSupabaseQuery(
    queryKeys.user.xpHistory(userId),
    async () => {
      const { data, error } = await supabase
        .from('xp_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

/**
 * Fetch user achievements
 */
export function useUserAchievements(userId: string) {
  return useSupabaseQuery(
    queryKeys.user.achievements(userId),
    async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

/**
 * Fetch user stats
 */
export function useUserStats(userId: string) {
  return useSupabaseQuery(
    queryKeys.user.stats(userId),
    async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

/**
 * Fetch tasks list
 */
export function useTasksList(
  filters?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }
) {
  return useSupabaseQuery(
    queryKeys.task.list(filters),
    async () => {
      let query = supabase.from('tasks').select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const limit = filters?.limit || 20;
      const offset = ((filters?.page || 1) - 1) * limit;

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    }
  );
}

/**
 * Fetch task detail
 */
export function useTaskDetail(taskId: string, enabled = true) {
  return useSupabaseQuery(
    queryKeys.task.detail(taskId),
    async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return data;
    },
    { enabled: !!taskId && enabled }
  );
}

/**
 * Fetch task submissions
 */
export function useTaskSubmissions(taskId: string) {
  return useSupabaseQuery(
    queryKeys.task.submissions(taskId),
    async () => {
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    { enabled: !!taskId }
  );
}

/**
 * Fetch leaderboard
 */
export function useLeaderboard(limit = 100) {
  return useSupabaseQuery(
    queryKeys.task.leaderboard(),
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, total_xp, level')
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    }
  );
}

/**
 * Fetch tools list
 */
export function useToolsList(
  filters?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }
) {
  return useSupabaseQuery(
    queryKeys.tool.list(filters),
    async () => {
      let query = supabase.from('tools').select('*');

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const limit = filters?.limit || 20;
      const offset = ((filters?.page || 1) - 1) * limit;

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    }
  );
}

/**
 * Fetch tool detail
 */
export function useToolDetail(toolId: string, enabled = true) {
  return useSupabaseQuery(
    queryKeys.tool.detail(toolId),
    async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single();

      if (error) throw error;
      return data;
    },
    { enabled: !!toolId && enabled }
  );
}

/**
 * Fetch tool reviews
 */
export function useToolReviews(toolId: string) {
  return useSupabaseQuery(
    queryKeys.tool.reviews(toolId),
    async () => {
      const { data, error } = await supabase
        .from('tool_reviews')
        .select('*')
        .eq('tool_id', toolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    { enabled: !!toolId }
  );
}

/**
 * Fetch notifications
 */
export function useNotifications() {
  return useSupabaseQuery(
    queryKeys.notification.list(),
    async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  );
}

/**
 * Fetch unread notifications count
 */
export function useUnreadNotificationsCount() {
  return useSupabaseQuery(
    queryKeys.notification.unread(),
    async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    }
  );
}

/**
 * Fetch wallet balance
 */
export function useWalletBalance(userId: string, enabled = true) {
  return useSupabaseQuery(
    queryKeys.wallet.balance(userId),
    async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    { enabled: !!userId && enabled }
  );
}

/**
 * Fetch wallet transactions
 */
export function useWalletTransactions(userId: string, limit = 50) {
  return useSupabaseQuery(
    queryKeys.wallet.transactions(userId),
    async () => {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

export default {
  useUserProfile,
  useUserXpHistory,
  useUserAchievements,
  useUserStats,
  useTasksList,
  useTaskDetail,
  useTaskSubmissions,
  useLeaderboard,
  useToolsList,
  useToolDetail,
  useToolReviews,
  useNotifications,
  useUnreadNotificationsCount,
  useWalletBalance,
  useWalletTransactions,
};
