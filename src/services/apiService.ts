// Unified API Service for Follow.ai
// All API calls should go through this service

import { supabase } from '../lib/supabase';
import { 
  AppError, 
  handleApiError, 
  retryWithBackoff,
  NetworkError 
} from '../utils/errorHandler';
import type {
  User,
  UserProfile,
  UserStats,
  Task,
  TaskFilter,
  TaskSubmission,
  Tool,
  ToolReview,
  Transaction,
  Achievement,
  UserAchievement,
  Notification,
  LeaderboardEntry,
  LeaderboardTimeRange,
  CheckInStatus,
  ReferralInfo,
  ApiResponse,
  PaginatedResponse,
} from '../types';

// ============================================
// Configuration
// ============================================

const DEFAULT_PAGE_SIZE = 20;
const MAX_RETRIES = 3;

// ============================================
// Helper Functions
// ============================================

/**
 * Wrap Supabase response in ApiResponse format
 */
function wrapResponse<T>(data: T | null, error: Error | null): ApiResponse<T> {
  return {
    data,
    error: error?.message || null,
    status: error ? 500 : 200,
  };
}

/**
 * Handle Supabase errors
 */
function handleSupabaseError(error: unknown, context: string): never {
  handleApiError(error, context, { showToast: false });
  throw error;
}

// ============================================
// User API
// ============================================

export const userApi = {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return wrapResponse(null, new AppError('Not authenticated', 'AUTH_ERROR', 401));
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return wrapResponse(data as User, null);
    } catch (error) {
      handleSupabaseError(error, 'userApi.getCurrentUser');
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          followers:follows!follows_following_id_fkey(count),
          following:follows!follows_follower_id_fkey(count)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return wrapResponse(data as UserProfile, null);
    } catch (error) {
      handleSupabaseError(error, 'userApi.getUserById');
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return wrapResponse(data as User, null);
    } catch (error) {
      handleSupabaseError(error, 'userApi.updateProfile');
    }
  },

  /**
   * Get user stats
   */
  async getUserStats(userId: string): Promise<ApiResponse<UserStats>> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_stats', { user_id: userId });

      if (error) throw error;
      return wrapResponse(data as UserStats, null);
    } catch (error) {
      handleSupabaseError(error, 'userApi.getUserStats');
    }
  },

  /**
   * Follow a user
   */
  async followUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_ERROR', 401);

      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: userId });

      if (error) throw error;
      return wrapResponse(true, null);
    } catch (error) {
      handleSupabaseError(error, 'userApi.followUser');
    }
  },

  /**
   * Unfollow a user
   */
  async unfollowUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_ERROR', 401);

      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;
      return wrapResponse(true, null);
    } catch (error) {
      handleSupabaseError(error, 'userApi.unfollowUser');
    }
  },
};

// ============================================
// Task API
// ============================================

export const taskApi = {
  /**
   * Get tasks with filters
   */
  async getTasks(filter: TaskFilter = {}): Promise<ApiResponse<PaginatedResponse<Task>>> {
    try {
      const {
        difficulty,
        category,
        status = 'active',
        search,
        sort = 'newest',
        page = 1,
        limit = DEFAULT_PAGE_SIZE,
      } = filter;

      let query = supabase
        .from('tasks')
        .select('*, tool:tools(*)', { count: 'exact' })
        .eq('status', status);

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      if (category) {
        query = query.eq('category', category);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      // Sorting
      switch (sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'xp_high':
          query = query.order('xp_reward', { ascending: false });
          break;
        case 'xp_low':
          query = query.order('xp_reward', { ascending: true });
          break;
        case 'deadline':
          query = query.order('deadline', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return wrapResponse({
        data: data as Task[],
        total: count || 0,
        page,
        limit,
        has_more: (count || 0) > page * limit,
      }, null);
    } catch (error) {
      handleSupabaseError(error, 'taskApi.getTasks');
    }
  },

  /**
   * Get task by ID
   */
  async getTaskById(taskId: string): Promise<ApiResponse<Task>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, tool:tools(*)')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return wrapResponse(data as Task, null);
    } catch (error) {
      handleSupabaseError(error, 'taskApi.getTaskById');
    }
  },

  /**
   * Submit task
   */
  async submitTask(
    taskId: string,
    content: string,
    outputFiles?: string[]
  ): Promise<ApiResponse<TaskSubmission>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_ERROR', 401);

      const { data, error } = await supabase
        .from('task_submissions')
        .insert({
          task_id: taskId,
          user_id: user.id,
          content,
          output_files: outputFiles,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return wrapResponse(data as TaskSubmission, null);
    } catch (error) {
      handleSupabaseError(error, 'taskApi.submitTask');
    }
  },

  /**
   * Get user's task submissions
   */
  async getUserSubmissions(userId: string): Promise<ApiResponse<TaskSubmission[]>> {
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*, task:tasks(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return wrapResponse(data as TaskSubmission[], null);
    } catch (error) {
      handleSupabaseError(error, 'taskApi.getUserSubmissions');
    }
  },
};

// ============================================
// Tool API
// ============================================

export const toolApi = {
  /**
   * Get all tools
   */
  async getTools(category?: string): Promise<ApiResponse<Tool[]>> {
    try {
      let query = supabase
        .from('tools')
        .select('*')
        .order('name');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return wrapResponse(data as Tool[], null);
    } catch (error) {
      handleSupabaseError(error, 'toolApi.getTools');
    }
  },

  /**
   * Get tool by ID
   */
  async getToolById(toolId: string): Promise<ApiResponse<Tool>> {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single();

      if (error) throw error;
      return wrapResponse(data as Tool, null);
    } catch (error) {
      handleSupabaseError(error, 'toolApi.getToolById');
    }
  },

  /**
   * Get tool reviews
   */
  async getToolReviews(toolId: string): Promise<ApiResponse<ToolReview[]>> {
    try {
      const { data, error } = await supabase
        .from('tool_reviews')
        .select('*, user:profiles(username, avatar_url, level)')
        .eq('tool_id', toolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return wrapResponse(data as ToolReview[], null);
    } catch (error) {
      handleSupabaseError(error, 'toolApi.getToolReviews');
    }
  },

  /**
   * Submit tool review
   */
  async submitReview(
    toolId: string,
    review: Omit<ToolReview, 'id' | 'user_id' | 'created_at'>
  ): Promise<ApiResponse<ToolReview>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_ERROR', 401);

      const { data, error } = await supabase
        .from('tool_reviews')
        .insert({
          ...review,
          tool_id: toolId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return wrapResponse(data as ToolReview, null);
    } catch (error) {
      handleSupabaseError(error, 'toolApi.submitReview');
    }
  },
};

// ============================================
// Transaction API
// ============================================

export const transactionApi = {
  /**
   * Get user transactions
   */
  async getUserTransactions(userId: string): Promise<ApiResponse<Transaction[]>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return wrapResponse(data as Transaction[], null);
    } catch (error) {
      handleSupabaseError(error, 'transactionApi.getUserTransactions');
    }
  },

  /**
   * Create transaction
   */
  async createTransaction(
    transaction: Omit<Transaction, 'id' | 'created_at'>
  ): Promise<ApiResponse<Transaction>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      if (error) throw error;
      return wrapResponse(data as Transaction, null);
    } catch (error) {
      handleSupabaseError(error, 'transactionApi.createTransaction');
    }
  },
};

// ============================================
// Achievement API
// ============================================

export const achievementApi = {
  /**
   * Get all achievements
   */
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('rarity');

      if (error) throw error;
      return wrapResponse(data as Achievement[], null);
    } catch (error) {
      handleSupabaseError(error, 'achievementApi.getAchievements');
    }
  },

  /**
   * Get user achievements
   */
  async getUserAchievements(userId: string): Promise<ApiResponse<UserAchievement[]>> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return wrapResponse(data as UserAchievement[], null);
    } catch (error) {
      handleSupabaseError(error, 'achievementApi.getUserAchievements');
    }
  },
};

// ============================================
// Leaderboard API
// ============================================

export const leaderboardApi = {
  /**
   * Get leaderboard
   */
  async getLeaderboard(
    timeRange: LeaderboardTimeRange = 'all-time',
    limit: number = 100
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, level, total_xp')
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const entries: LeaderboardEntry[] = (data || []).map((user, index) => ({
        rank: index + 1,
        user_id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        level: user.level,
        total_xp: user.total_xp,
        tasks_completed: 0, // Would need separate query
      }));

      return wrapResponse(entries, null);
    } catch (error) {
      handleSupabaseError(error, 'leaderboardApi.getLeaderboard');
    }
  },

  /**
   * Get user rank
   */
  async getUserRank(userId: string): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_rank', { user_id: userId });

      if (error) throw error;
      return wrapResponse(data as number, null);
    } catch (error) {
      handleSupabaseError(error, 'leaderboardApi.getUserRank');
    }
  },
};

// ============================================
// Notification API
// ============================================

export const notificationApi = {
  /**
   * Get user notifications
   */
  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return wrapResponse(data as Notification[], null);
    } catch (error) {
      handleSupabaseError(error, 'notificationApi.getNotifications');
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      return wrapResponse(true, null);
    } catch (error) {
      handleSupabaseError(error, 'notificationApi.markAsRead');
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return wrapResponse(true, null);
    } catch (error) {
      handleSupabaseError(error, 'notificationApi.markAllAsRead');
    }
  },
};

// ============================================
// Check-in API
// ============================================

export const checkInApi = {
  /**
   * Get check-in status
   */
  async getCheckInStatus(userId: string): Promise<ApiResponse<CheckInStatus>> {
    try {
      const { data, error } = await supabase
        .rpc('get_checkin_status', { user_id: userId });

      if (error) throw error;
      return wrapResponse(data as CheckInStatus, null);
    } catch (error) {
      handleSupabaseError(error, 'checkInApi.getCheckInStatus');
    }
  },

  /**
   * Perform daily check-in
   */
  async checkIn(): Promise<ApiResponse<{ xp_earned: number; streak_days: number }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_ERROR', 401);

      const { data, error } = await supabase
        .rpc('perform_daily_checkin', { user_id: user.id });

      if (error) throw error;
      return wrapResponse(data, null);
    } catch (error) {
      handleSupabaseError(error, 'checkInApi.checkIn');
    }
  },
};

// ============================================
// Referral API
// ============================================

export const referralApi = {
  /**
   * Get referral info
   */
  async getReferralInfo(userId: string): Promise<ApiResponse<ReferralInfo>> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*, referred_user:profiles!referrals_referred_user_id_fkey(username, avatar_url)')
        .eq('referrer_id', userId);

      if (error) throw error;

      // Get referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', userId)
        .single();

      const referralInfo: ReferralInfo = {
        code: profile?.referral_code || '',
        total_referrals: data?.length || 0,
        total_xp_earned: data?.reduce((sum, r) => sum + (r.xp_earned || 0), 0) || 0,
        referrals: data || [],
      };

      return wrapResponse(referralInfo, null);
    } catch (error) {
      handleSupabaseError(error, 'referralApi.getReferralInfo');
    }
  },

  /**
   * Apply referral code
   */
  async applyReferralCode(code: string): Promise<ApiResponse<boolean>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_ERROR', 401);

      const { data, error } = await supabase
        .rpc('apply_referral_code', { user_id: user.id, referral_code: code });

      if (error) throw error;
      return wrapResponse(data, null);
    } catch (error) {
      handleSupabaseError(error, 'referralApi.applyReferralCode');
    }
  },
};

// ============================================
// Export all APIs
// ============================================

export const api = {
  user: userApi,
  task: taskApi,
  tool: toolApi,
  transaction: transactionApi,
  achievement: achievementApi,
  leaderboard: leaderboardApi,
  notification: notificationApi,
  checkIn: checkInApi,
  referral: referralApi,
};

export default api;
