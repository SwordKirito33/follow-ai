// Centralized API service for Follow.ai
import { APP_CONFIG } from '../config/app';

const API_BASE = APP_CONFIG.urls.api;

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {}, timeout = 30000 } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          data: null,
          error: data?.message || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      return { data, error: null, status: response.status };
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return { data: null, error: 'Request timeout', status: 408 };
      }
      
      return { data: null, error: error.message || 'Network error', status: 0 };
    }
  }

  // Auth endpoints
  auth = {
    login: (email: string, password: string) =>
      this.request<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      }),

    signup: (email: string, password: string, username: string) =>
      this.request<{ user: any; token: string }>('/auth/signup', {
        method: 'POST',
        body: { email, password, username },
      }),

    logout: () =>
      this.request('/auth/logout', { method: 'POST' }),

    refreshToken: () =>
      this.request<{ token: string }>('/auth/refresh', { method: 'POST' }),

    forgotPassword: (email: string) =>
      this.request('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      }),

    resetPassword: (token: string, password: string) =>
      this.request('/auth/reset-password', {
        method: 'POST',
        body: { token, password },
      }),

    verifyEmail: (token: string) =>
      this.request('/auth/verify-email', {
        method: 'POST',
        body: { token },
      }),
  };

  // User endpoints
  users = {
    getProfile: (userId?: string) =>
      this.request<any>(userId ? `/users/${userId}` : '/users/me'),

    updateProfile: (data: any) =>
      this.request<any>('/users/me', {
        method: 'PATCH',
        body: data,
      }),

    uploadAvatar: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch(`${API_BASE}/users/me/avatar`, {
        method: 'POST',
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        body: formData,
      });
      
      return response.json();
    },

    getStats: (userId?: string) =>
      this.request<any>(userId ? `/users/${userId}/stats` : '/users/me/stats'),

    getActivity: (userId?: string, page = 1, limit = 20) =>
      this.request<any>(
        `${userId ? `/users/${userId}` : '/users/me'}/activity?page=${page}&limit=${limit}`
      ),

    follow: (userId: string) =>
      this.request(`/users/${userId}/follow`, { method: 'POST' }),

    unfollow: (userId: string) =>
      this.request(`/users/${userId}/follow`, { method: 'DELETE' }),

    getFollowers: (userId?: string, page = 1, limit = 20) =>
      this.request<any>(
        `${userId ? `/users/${userId}` : '/users/me'}/followers?page=${page}&limit=${limit}`
      ),

    getFollowing: (userId?: string, page = 1, limit = 20) =>
      this.request<any>(
        `${userId ? `/users/${userId}` : '/users/me'}/following?page=${page}&limit=${limit}`
      ),
  };

  // Tasks endpoints
  tasks = {
    list: (params?: {
      page?: number;
      limit?: number;
      difficulty?: string;
      category?: string;
      search?: string;
      sort?: string;
    }) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value));
        });
      }
      return this.request<any>(`/tasks?${query}`);
    },

    get: (taskId: string) =>
      this.request<any>(`/tasks/${taskId}`),

    submit: (taskId: string, data: any) =>
      this.request<any>(`/tasks/${taskId}/submit`, {
        method: 'POST',
        body: data,
      }),

    getSubmissions: (taskId: string, page = 1, limit = 20) =>
      this.request<any>(`/tasks/${taskId}/submissions?page=${page}&limit=${limit}`),

    rate: (taskId: string, rating: number, comment?: string) =>
      this.request(`/tasks/${taskId}/rate`, {
        method: 'POST',
        body: { rating, comment },
      }),

    favorite: (taskId: string) =>
      this.request(`/tasks/${taskId}/favorite`, { method: 'POST' }),

    unfavorite: (taskId: string) =>
      this.request(`/tasks/${taskId}/favorite`, { method: 'DELETE' }),

    getFavorites: (page = 1, limit = 20) =>
      this.request<any>(`/tasks/favorites?page=${page}&limit=${limit}`),
  };

  // Leaderboard endpoints
  leaderboard = {
    get: (timeRange: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time', page = 1, limit = 50) =>
      this.request<any>(`/leaderboard?timeRange=${timeRange}&page=${page}&limit=${limit}`),

    getUserRank: (userId?: string) =>
      this.request<any>(userId ? `/leaderboard/rank/${userId}` : '/leaderboard/rank'),
  };

  // Wallet endpoints
  wallet = {
    getBalance: () =>
      this.request<any>('/wallet/balance'),

    getTransactions: (params?: {
      page?: number;
      limit?: number;
      type?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value));
        });
      }
      return this.request<any>(`/wallet/transactions?${query}`);
    },

    purchaseXp: (packageId: string, paymentMethod: string) =>
      this.request<any>('/wallet/purchase', {
        method: 'POST',
        body: { packageId, paymentMethod },
      }),

    createPaymentIntent: (packageId: string) =>
      this.request<any>('/wallet/payment-intent', {
        method: 'POST',
        body: { packageId },
      }),
  };

  // Achievements endpoints
  achievements = {
    list: () =>
      this.request<any>('/achievements'),

    getUserAchievements: (userId?: string) =>
      this.request<any>(userId ? `/users/${userId}/achievements` : '/users/me/achievements'),

    claim: (achievementId: string) =>
      this.request(`/achievements/${achievementId}/claim`, { method: 'POST' }),
  };

  // Notifications endpoints
  notifications = {
    list: (page = 1, limit = 20, unreadOnly = false) =>
      this.request<any>(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`),

    markAsRead: (notificationId: string) =>
      this.request(`/notifications/${notificationId}/read`, { method: 'POST' }),

    markAllAsRead: () =>
      this.request('/notifications/read-all', { method: 'POST' }),

    getUnreadCount: () =>
      this.request<{ count: number }>('/notifications/unread-count'),
  };

  // Check-in endpoints
  checkIn = {
    daily: () =>
      this.request<any>('/check-in', { method: 'POST' }),

    getStatus: () =>
      this.request<any>('/check-in/status'),

    getHistory: (month?: string) =>
      this.request<any>(`/check-in/history${month ? `?month=${month}` : ''}`),
  };

  // Tools endpoints
  tools = {
    list: (params?: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
    }) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value));
        });
      }
      return this.request<any>(`/tools?${query}`);
    },

    get: (toolId: string) =>
      this.request<any>(`/tools/${toolId}`),

    getReviews: (toolId: string, page = 1, limit = 20) =>
      this.request<any>(`/tools/${toolId}/reviews?page=${page}&limit=${limit}`),
  };

  // Referral endpoints
  referral = {
    getCode: () =>
      this.request<{ code: string }>('/referral/code'),

    getReferrals: (page = 1, limit = 20) =>
      this.request<any>(`/referral/list?page=${page}&limit=${limit}`),

    applyCode: (code: string) =>
      this.request('/referral/apply', {
        method: 'POST',
        body: { code },
      }),

    getStats: () =>
      this.request<any>('/referral/stats'),
  };

  // Settings endpoints
  settings = {
    get: () =>
      this.request<any>('/settings'),

    update: (settings: any) =>
      this.request('/settings', {
        method: 'PATCH',
        body: settings,
      }),

    updateNotifications: (settings: any) =>
      this.request('/settings/notifications', {
        method: 'PATCH',
        body: settings,
      }),

    updatePrivacy: (settings: any) =>
      this.request('/settings/privacy', {
        method: 'PATCH',
        body: settings,
      }),
  };
}

export const api = new ApiService();
export default api;
