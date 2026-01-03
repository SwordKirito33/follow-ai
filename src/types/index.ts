// Follow.ai TypeScript Type Definitions
// All shared types should be defined here for type safety

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  level: number;
  total_xp: number;
  xp: number; // Current level XP
  earnings: number;
  created_at: string;
  updated_at?: string;
  is_verified?: boolean;
  role: UserRole;
  settings?: UserSettings;
}

export type UserRole = 'user' | 'admin' | 'moderator' | 'developer';

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: SupportedLanguage;
  font: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  taskUpdates: boolean;
  achievements: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  showProfile: boolean;
  showActivity: boolean;
  showLeaderboard: boolean;
}

export interface UserProfile extends User {
  followers_count: number;
  following_count: number;
  tasks_completed: number;
  achievements_count: number;
  is_following?: boolean;
}

export interface UserStats {
  total_xp: number;
  level: number;
  tasks_completed: number;
  tasks_submitted: number;
  achievements_unlocked: number;
  streak_days: number;
  rank: number;
  total_users: number;
}

// ============================================
// Task Types
// ============================================

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  category: string;
  xp_reward: number;
  status: TaskStatus;
  tool_id?: string;
  tool?: Tool;
  created_at: string;
  updated_at?: string;
  deadline?: string;
  max_submissions?: number;
  current_submissions?: number;
  requirements?: string[];
  tags?: string[];
  is_featured?: boolean;
  is_favorited?: boolean;
}

export type TaskDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TaskStatus = 'active' | 'completed' | 'expired' | 'draft';

export interface TaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  user?: User;
  content: string;
  output_url?: string;
  output_files?: string[];
  status: SubmissionStatus;
  xp_earned?: number;
  feedback?: string;
  rating?: number;
  created_at: string;
  reviewed_at?: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision';

export interface TaskFilter {
  difficulty?: TaskDifficulty;
  category?: string;
  status?: TaskStatus;
  search?: string;
  sort?: 'newest' | 'oldest' | 'xp_high' | 'xp_low' | 'deadline';
  page?: number;
  limit?: number;
}

// ============================================
// Tool Types
// ============================================

export interface Tool {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  category: ToolCategory;
  pricing: ToolPricing;
  tags?: string[];
  rating_average?: number;
  rating_count?: number;
  review_count?: number;
  is_featured?: boolean;
  created_at: string;
}

export type ToolCategory = 
  | 'Image Generation'
  | 'Text Generation'
  | 'Video Generation'
  | 'Audio Generation'
  | 'Developer Tools'
  | 'Search & Research'
  | 'Productivity'
  | 'Other';

export type ToolPricing = 'Free' | 'Freemium' | 'Paid' | 'Enterprise';

export interface ToolReview {
  id: string;
  tool_id: string;
  user_id: string;
  user?: User;
  title: string;
  content: string;
  rating: number; // 1-5
  pros?: string[];
  cons?: string[];
  output_files?: string[];
  helpful_count?: number;
  created_at: string;
}

// ============================================
// Wallet & Transaction Types
// ============================================

export interface Wallet {
  user_id: string;
  balance_xp: number;
  total_purchased: number;
  total_spent: number;
  total_earned: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  xp_amount?: number;
  currency?: string;
  status: TransactionStatus;
  description?: string;
  reference_id?: string;
  created_at: string;
  completed_at?: string;
}

export type TransactionType = 
  | 'xp_purchase'
  | 'xp_earned'
  | 'xp_spent'
  | 'refund'
  | 'bonus'
  | 'referral';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface XPPackage {
  id: string;
  name: string;
  xp_amount: number;
  price: number;
  original_price?: number;
  currency: string;
  discount?: number;
  is_popular?: boolean;
  is_best_value?: boolean;
}

// ============================================
// Achievement Types
// ============================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  is_secret?: boolean;
}

export type AchievementCategory = 
  | 'tasks'
  | 'xp'
  | 'social'
  | 'streak'
  | 'special';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achievement?: Achievement;
  unlocked_at: string;
  claimed_at?: string;
  progress?: number;
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export type NotificationType = 
  | 'achievement'
  | 'task'
  | 'system'
  | 'reward'
  | 'social'
  | 'payment';

// ============================================
// Leaderboard Types
// ============================================

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user?: User;
  username: string;
  avatar_url?: string;
  level: number;
  total_xp: number;
  tasks_completed: number;
  change?: number; // Rank change from previous period
}

export type LeaderboardTimeRange = 'daily' | 'weekly' | 'monthly' | 'all-time';

// ============================================
// Check-in Types
// ============================================

export interface CheckInStatus {
  has_checked_in_today: boolean;
  streak_days: number;
  last_check_in?: string;
  xp_earned_today?: number;
  bonus_xp?: number;
}

export interface CheckInHistory {
  date: string;
  xp_earned: number;
  streak_day: number;
}

// ============================================
// Referral Types
// ============================================

export interface ReferralInfo {
  code: string;
  total_referrals: number;
  total_xp_earned: number;
  referrals: Referral[];
}

export interface Referral {
  id: string;
  referred_user_id: string;
  referred_user?: User;
  xp_earned: number;
  created_at: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ============================================
// Form Types
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupFormData {
  email: string;
  password: string;
  username: string;
  confirm_password: string;
}

export interface ProfileFormData {
  display_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
}

export interface TaskSubmissionFormData {
  content: string;
  output_files?: File[];
}

// ============================================
// UI Types
// ============================================

export type SupportedLanguage = 
  | 'en' | 'zh' | 'ja' | 'ko' 
  | 'es' | 'fr' | 'de' 
  | 'pt' | 'ru' | 'ar';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================
// Level System Types
// ============================================

export interface LevelInfo {
  level: number;
  currentXp: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progress: number; // 0-100
  title?: string;
}

export const LEVEL_TITLES: Record<number, string> = {
  1: '新手',
  5: '初级测试者',
  10: '中级测试者',
  15: '高级测试者',
  20: '专家测试者',
  25: '大师测试者',
  30: '传奇测试者',
};

// ============================================
// Utility Types
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
