// React Query hooks for API calls
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import api from '../services/api';

// Query keys
export const queryKeys = {
  user: {
    profile: (userId?: string) => ['user', 'profile', userId] as const,
    stats: (userId?: string) => ['user', 'stats', userId] as const,
    activity: (userId?: string) => ['user', 'activity', userId] as const,
    followers: (userId?: string) => ['user', 'followers', userId] as const,
    following: (userId?: string) => ['user', 'following', userId] as const,
  },
  tasks: {
    list: (params?: any) => ['tasks', 'list', params] as const,
    detail: (taskId: string) => ['tasks', 'detail', taskId] as const,
    submissions: (taskId: string) => ['tasks', 'submissions', taskId] as const,
    favorites: () => ['tasks', 'favorites'] as const,
  },
  leaderboard: {
    list: (timeRange: string) => ['leaderboard', timeRange] as const,
    rank: (userId?: string) => ['leaderboard', 'rank', userId] as const,
  },
  wallet: {
    balance: () => ['wallet', 'balance'] as const,
    transactions: (params?: any) => ['wallet', 'transactions', params] as const,
  },
  achievements: {
    list: () => ['achievements', 'list'] as const,
    user: (userId?: string) => ['achievements', 'user', userId] as const,
  },
  notifications: {
    list: () => ['notifications', 'list'] as const,
    unreadCount: () => ['notifications', 'unread'] as const,
  },
  checkIn: {
    status: () => ['checkIn', 'status'] as const,
    history: (month?: string) => ['checkIn', 'history', month] as const,
  },
  tools: {
    list: (params?: any) => ['tools', 'list', params] as const,
    detail: (toolId: string) => ['tools', 'detail', toolId] as const,
  },
  referral: {
    code: () => ['referral', 'code'] as const,
    list: () => ['referral', 'list'] as const,
    stats: () => ['referral', 'stats'] as const,
  },
  settings: () => ['settings'] as const,
};

// User hooks
export const useProfile = (userId?: string) =>
  useQuery({
    queryKey: queryKeys.user.profile(userId),
    queryFn: () => api.users.getProfile(userId),
  });

export const useUserStats = (userId?: string) =>
  useQuery({
    queryKey: queryKeys.user.stats(userId),
    queryFn: () => api.users.getStats(userId),
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.users.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
};

export const useFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.users.follow(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.following() });
    },
  });
};

export const useUnfollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.users.unfollow(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.following() });
    },
  });
};

// Tasks hooks
export const useTasks = (params?: any) =>
  useQuery({
    queryKey: queryKeys.tasks.list(params),
    queryFn: () => api.tasks.list(params),
  });

export const useTask = (taskId: string) =>
  useQuery({
    queryKey: queryKeys.tasks.detail(taskId),
    queryFn: () => api.tasks.get(taskId),
    enabled: !!taskId,
  });

export const useSubmitTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
      api.tasks.submit(taskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
    },
  });
};

export const useFavoriteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.tasks.favorite(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.favorites() });
    },
  });
};

// Leaderboard hooks
export const useLeaderboard = (timeRange: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time') =>
  useQuery({
    queryKey: queryKeys.leaderboard.list(timeRange),
    queryFn: () => api.leaderboard.get(timeRange),
  });

export const useUserRank = (userId?: string) =>
  useQuery({
    queryKey: queryKeys.leaderboard.rank(userId),
    queryFn: () => api.leaderboard.getUserRank(userId),
  });

// Wallet hooks
export const useWalletBalance = () =>
  useQuery({
    queryKey: queryKeys.wallet.balance(),
    queryFn: () => api.wallet.getBalance(),
  });

export const useTransactions = (params?: any) =>
  useQuery({
    queryKey: queryKeys.wallet.transactions(params),
    queryFn: () => api.wallet.getTransactions(params),
  });

export const usePurchaseXp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ packageId, paymentMethod }: { packageId: string; paymentMethod: string }) =>
      api.wallet.purchaseXp(packageId, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions() });
    },
  });
};

// Achievements hooks
export const useAchievements = () =>
  useQuery({
    queryKey: queryKeys.achievements.list(),
    queryFn: () => api.achievements.list(),
  });

export const useUserAchievements = (userId?: string) =>
  useQuery({
    queryKey: queryKeys.achievements.user(userId),
    queryFn: () => api.achievements.getUserAchievements(userId),
  });

export const useClaimAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (achievementId: string) => api.achievements.claim(achievementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.user() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
    },
  });
};

// Notifications hooks
export const useNotifications = () =>
  useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => api.notifications.list(),
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => api.notifications.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => api.notifications.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
};

// Check-in hooks
export const useCheckInStatus = () =>
  useQuery({
    queryKey: queryKeys.checkIn.status(),
    queryFn: () => api.checkIn.getStatus(),
  });

export const useDailyCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.checkIn.daily(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.checkIn.status() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.stats() });
    },
  });
};

// Tools hooks
export const useTools = (params?: any) =>
  useQuery({
    queryKey: queryKeys.tools.list(params),
    queryFn: () => api.tools.list(params),
  });

export const useTool = (toolId: string) =>
  useQuery({
    queryKey: queryKeys.tools.detail(toolId),
    queryFn: () => api.tools.get(toolId),
    enabled: !!toolId,
  });

// Referral hooks
export const useReferralCode = () =>
  useQuery({
    queryKey: queryKeys.referral.code(),
    queryFn: () => api.referral.getCode(),
  });

export const useReferralStats = () =>
  useQuery({
    queryKey: queryKeys.referral.stats(),
    queryFn: () => api.referral.getStats(),
  });

export const useApplyReferralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => api.referral.applyCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
    },
  });
};

// Settings hooks
export const useSettings = () =>
  useQuery({
    queryKey: queryKeys.settings(),
    queryFn: () => api.settings.get(),
  });

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: any) => api.settings.update(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings() });
    },
  });
};
