// Leaderboard System Component for Follow.ai
// Comprehensive leaderboard with multiple views and time periods

import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

type LeaderboardType = 'xp' | 'reviews' | 'tasks' | 'streak';
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';

interface LeaderboardUser {
  id: string;
  rank: number;
  previousRank?: number;
  username: string;
  displayName?: string;
  avatar?: string;
  level: number;
  xp: number;
  reviewCount?: number;
  taskCount?: number;
  streak?: number;
  badges?: string[];
  isCurrentUser?: boolean;
}

interface LeaderboardSystemProps {
  users: LeaderboardUser[];
  currentUserId?: string;
  defaultType?: LeaderboardType;
  defaultPeriod?: TimePeriod;
  onUserClick?: (userId: string) => void;
  className?: string;
}

// ============================================
// Constants
// ============================================

const typeConfig: Record<LeaderboardType, { label: string; icon: string; valueKey: keyof LeaderboardUser; suffix: string }> = {
  xp: { label: 'XP 排行', icon: '⭐', valueKey: 'xp', suffix: 'XP' },
  reviews: { label: '评价排行', icon: '💬', valueKey: 'reviewCount', suffix: '条评价' },
  tasks: { label: '任务排行', icon: '✅', valueKey: 'taskCount', suffix: '个任务' },
  streak: { label: '连续登录', icon: '🔥', valueKey: 'streak', suffix: '天' },
};

const periodConfig: Record<TimePeriod, { label: string }> = {
  daily: { label: '今日' },
  weekly: { label: '本周' },
  monthly: { label: '本月' },
  all_time: { label: '总榜' },
};

// ============================================
// Helper Components
// ============================================

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
        <span className="text-xl">🥇</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg">
        <span className="text-xl">🥈</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg">
        <span className="text-xl">🥉</span>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-gray-700 flex items-center justify-center">
      <span className="text-sm font-bold text-gray-400 dark:text-gray-300">{rank}</span>
    </div>
  );
}

function RankChange({ current, previous }: { current: number; previous?: number }) {
  if (!previous || current === previous) {
    return <span className="text-gray-400 dark:text-gray-500">—</span>;
  }

  const change = previous - current;
  if (change > 0) {
    return (
      <span className="flex items-center text-green-500 text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {change}
      </span>
    );
  }
  return (
    <span className="flex items-center text-red-500 text-sm">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      {Math.abs(change)}
    </span>
  );
}

function UserAvatar({ user, size = 'md' }: { user: LeaderboardUser; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.displayName || user.username}
        className={cn('rounded-full object-cover', sizeClasses[size])}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold',
        sizeClasses[size]
      )}
    >
      {(user.displayName || user.username).charAt(0).toUpperCase()}
    </div>
  );
}

// ============================================
// Podium Component (Top 3)
// ============================================

function Podium({ users, type, onUserClick }: { users: LeaderboardUser[]; type: LeaderboardType; onUserClick?: (userId: string) => void }) {
  const config = typeConfig[type];
  const [first, second, third] = [
    users.find((u) => u.rank === 1),
    users.find((u) => u.rank === 2),
    users.find((u) => u.rank === 3),
  ];

  const PodiumUser = ({ user, position }: { user?: LeaderboardUser; position: 1 | 2 | 3 }) => {
    if (!user) return null;

    const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
    const colors = {
      1: 'from-yellow-400 to-amber-500',
      2: 'from-gray-300 to-gray-400',
      3: 'from-amber-600 to-amber-700',
    };

    return (
      <div
        className={cn(
          'flex flex-col items-center cursor-pointer',
          position === 1 ? 'order-2' : position === 2 ? 'order-1' : 'order-3'
        )}
        onClick={() => onUserClick?.(user.id)}
      >
        <div className="relative mb-2">
          <UserAvatar user={user} size="lg" />
          <div className={cn(
            'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
            `bg-gradient-to-br ${colors[position]} text-white shadow-lg`
          )}>
            {position}
          </div>
        </div>
        <div className="text-center mb-2">
          <div className="font-semibold text-white dark:text-white truncate max-w-[100px]">
            {user.displayName || user.username}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Lv.{user.level}
          </div>
        </div>
        <div className={cn(
          'w-20 rounded-t-lg flex items-end justify-center pb-2',
          `bg-gradient-to-t ${colors[position]}`,
          heights[position]
        )}>
          <span className="text-white font-bold text-sm">
            {(user[config.valueKey] as number)?.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-4 mb-8 pt-8">
      <PodiumUser user={second} position={2} />
      <PodiumUser user={first} position={1} />
      <PodiumUser user={third} position={3} />
    </div>
  );
}

// ============================================
// Leaderboard Row Component
// ============================================

interface LeaderboardRowProps {
  user: LeaderboardUser;
  type: LeaderboardType;
  onClick?: () => void;
}

function LeaderboardRow({ user, type, onClick }: LeaderboardRowProps) {
  const config = typeConfig[type];
  const value = user[config.valueKey] as number;

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer',
        user.isCurrentUser
          ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700'
          : 'bg-white dark:bg-gray-800 border border-white/10 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
      )}
    >
      {/* Rank */}
      <RankBadge rank={user.rank} />

      {/* Rank Change */}
      <div className="w-12 text-center">
        <RankChange current={user.rank} previous={user.previousRank} />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <UserAvatar user={user} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              'font-semibold truncate',
              user.isCurrentUser ? 'text-purple-700 dark:text-purple-300' : 'text-white dark:text-white'
            )}>
              {user.displayName || user.username}
            </span>
            {user.isCurrentUser && (
              <span className="px-2 py-0.5 rounded-full bg-primary-purple/20 dark:bg-purple-900/50 text-primary-purple dark:text-purple-400 text-xs">
                你
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Lv.{user.level}
          </div>
        </div>
      </div>

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <div className="hidden md:flex gap-1">
          {user.badges.slice(0, 3).map((badge, index) => (
            <span key={index} className="text-lg" title={badge}>
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Value */}
      <div className="text-right">
        <div className="font-bold text-white dark:text-white">
          {value?.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {config.suffix}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Leaderboard System Component
// ============================================

export function LeaderboardSystem({
  users,
  currentUserId,
  defaultType = 'xp',
  defaultPeriod = 'weekly',
  onUserClick,
  className,
}: LeaderboardSystemProps) {
  const [type, setType] = useState<LeaderboardType>(defaultType);
  const [period, setPeriod] = useState<TimePeriod>(defaultPeriod);
  const [showPodium, setShowPodium] = useState(true);

  // Mark current user
  const processedUsers = useMemo(() => {
    return users.map((user) => ({
      ...user,
      isCurrentUser: user.id === currentUserId,
    }));
  }, [users, currentUserId]);

  // Find current user's rank
  const currentUserRank = processedUsers.find((u) => u.isCurrentUser);

  // Top 3 and rest
  const top3 = processedUsers.filter((u) => u.rank <= 3);
  const rest = processedUsers.filter((u) => u.rank > 3);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(typeConfig) as LeaderboardType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                type === t
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 dark:bg-gray-800 text-gray-300 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700'
              )}
            >
              {typeConfig[t].icon} {typeConfig[t].label}
            </button>
          ))}
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(Object.keys(periodConfig) as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                period === p
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-white'
                  : 'bg-white/10 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700'
              )}
            >
              {periodConfig[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Highlight */}
      {currentUserRank && currentUserRank.rank > 10 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-sm text-primary-purple dark:text-purple-400 mb-2">你的排名</div>
          <LeaderboardRow user={currentUserRank} type={type} onClick={() => onUserClick?.(currentUserRank.id)} />
        </div>
      )}

      {/* Podium Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white dark:text-white">
          {typeConfig[type].label} - {periodConfig[period].label}
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPodium}
            onChange={(e) => setShowPodium(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 dark:border-gray-600 text-primary-purple focus:ring-purple-500"
          />
          <span className="text-sm text-gray-400 dark:text-gray-400">显示领奖台</span>
        </label>
      </div>

      {/* Podium */}
      {showPodium && top3.length >= 3 && (
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6">
          <Podium users={top3} type={type} onUserClick={onUserClick} />
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-3">
        {(showPodium ? rest : processedUsers).map((user) => (
          <LeaderboardRow
            key={user.id}
            user={user}
            type={type}
            onClick={() => onUserClick?.(user.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {processedUsers.length === 0 && (
        <div className="text-center py-12 bg-white/5 dark:bg-gray-800/50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">暂无排行数据</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Demo Users Data
// ============================================

export const demoLeaderboardUsers: LeaderboardUser[] = [
  { id: '1', rank: 1, previousRank: 2, username: 'ai_master', displayName: 'AI大师', level: 42, xp: 125000, reviewCount: 156, taskCount: 89, streak: 45, badges: ['🏆', '⭐', '🔥'] },
  { id: '2', rank: 2, previousRank: 1, username: 'tech_guru', displayName: '技术达人', level: 38, xp: 98000, reviewCount: 134, taskCount: 76, streak: 32, badges: ['🥇', '💎'] },
  { id: '3', rank: 3, previousRank: 3, username: 'tool_hunter', displayName: '工具猎人', level: 35, xp: 87000, reviewCount: 98, taskCount: 65, streak: 28, badges: ['🎯', '🌟'] },
  { id: '4', rank: 4, previousRank: 6, username: 'review_king', displayName: '评价之王', level: 32, xp: 76000, reviewCount: 187, taskCount: 54, streak: 21, badges: ['💬'] },
  { id: '5', rank: 5, previousRank: 4, username: 'xp_collector', displayName: 'XP收集者', level: 30, xp: 68000, reviewCount: 67, taskCount: 82, streak: 15, badges: ['⚡'] },
  { id: '6', rank: 6, previousRank: 5, username: 'daily_player', displayName: '每日玩家', level: 28, xp: 54000, reviewCount: 45, taskCount: 48, streak: 60, badges: ['🔥'] },
  { id: '7', rank: 7, previousRank: 8, username: 'ai_explorer', displayName: 'AI探索者', level: 25, xp: 42000, reviewCount: 38, taskCount: 42, streak: 12 },
  { id: '8', rank: 8, previousRank: 7, username: 'tool_tester', displayName: '工具测试员', level: 23, xp: 38000, reviewCount: 56, taskCount: 35, streak: 8 },
  { id: '9', rank: 9, previousRank: 10, username: 'newbie_star', displayName: '新星', level: 20, xp: 32000, reviewCount: 28, taskCount: 30, streak: 14 },
  { id: '10', rank: 10, previousRank: 9, username: 'casual_user', displayName: '休闲用户', level: 18, xp: 28000, reviewCount: 22, taskCount: 25, streak: 5 },
];

// ============================================
// Export
// ============================================

export default LeaderboardSystem;
