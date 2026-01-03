// Profile System Component for Follow.ai
// Comprehensive user profile with stats, achievements, and activity

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  joinedAt: string;
  lastActiveAt?: string;
  stats: {
    reviews: number;
    tasks: number;
    streak: number;
    followers: number;
    following: number;
    rank: number;
  };
  badges: Badge[];
  recentActivity: Activity[];
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

interface Activity {
  id: string;
  type: 'review' | 'task' | 'badge' | 'level_up' | 'follow';
  title: string;
  description?: string;
  xp?: number;
  timestamp: string;
}

interface ProfileSystemProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onEditProfile?: () => void;
  onShareProfile?: () => void;
  className?: string;
}

// ============================================
// Constants
// ============================================

const rarityColors: Record<Badge['rarity'], { bg: string; text: string; border: string }> = {
  common: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600' },
  rare: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-700' },
  epic: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-700' },
  legendary: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-700' },
};

const activityIcons: Record<Activity['type'], string> = {
  review: '💬',
  task: '✅',
  badge: '🏆',
  level_up: '⬆️',
  follow: '👥',
};

// ============================================
// Helper Components
// ============================================

function ProfileAvatar({ profile, size = 'lg' }: { profile: UserProfile; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl',
  };

  if (profile.avatar) {
    return (
      <img
        src={profile.avatar}
        alt={profile.displayName || profile.username}
        className={cn('rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg', sizeClasses[size])}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border-4 border-white dark:border-gray-800 shadow-lg',
        sizeClasses[size]
      )}
    >
      {(profile.displayName || profile.username).charAt(0).toUpperCase()}
    </div>
  );
}

function LevelProgress({ level, xp, xpToNextLevel }: { level: number; xp: number; xpToNextLevel: number }) {
  const progress = (xp / (xp + xpToNextLevel)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-purple-600 dark:text-purple-400">Lv.{level}</span>
        <span className="text-gray-500 dark:text-gray-400">{xp.toLocaleString()} / {(xp + xpToNextLevel).toLocaleString()} XP</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const colors = rarityColors[badge.rarity];

  return (
    <div
      className={cn(
        'p-4 rounded-xl border-2 transition-transform hover:scale-105',
        colors.bg,
        colors.border
      )}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <div className={cn('font-semibold', colors.text)}>{badge.name}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {new Date(badge.earnedAt).toLocaleDateString()}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
        {activityIcons[activity.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-white">{activity.title}</div>
        {activity.description && (
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.description}</div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(activity.timestamp).toLocaleDateString()}
          </span>
          {activity.xp && (
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              +{activity.xp} XP
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Profile Header Component
// ============================================

function ProfileHeader({
  profile,
  isOwnProfile,
  isFollowing,
  onFollow,
  onUnfollow,
  onEditProfile,
  onShareProfile,
}: {
  profile: UserProfile;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onEditProfile?: () => void;
  onShareProfile?: () => void;
}) {
  return (
    <div className="relative">
      {/* Cover */}
      <div className="h-32 md:h-48 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-t-2xl" />

      {/* Profile Info */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <ProfileAvatar profile={profile} size="xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 border-4 border-white dark:border-gray-800" title="在线" />
        </div>

        {/* Name & Bio */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.displayName || profile.username}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 加入于 {new Date(profile.joinedAt).toLocaleDateString()}</span>
              <span>🏆 排名 #{profile.stats.rank}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <button
                onClick={onEditProfile}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                编辑资料
              </button>
            ) : (
              <button
                onClick={isFollowing ? onUnfollow : onFollow}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  isFollowing
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                )}
              >
                {isFollowing ? '取消关注' : '关注'}
              </button>
            )}
            <button
              onClick={onShareProfile}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Social Links */}
        {profile.socialLinks && (
          <div className="flex items-center gap-3 mt-4">
            {profile.socialLinks.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {profile.socialLinks.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            )}
            {profile.socialLinks.website && (
              <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
          </div>
        )}

        {/* Level Progress */}
        <div className="mt-6">
          <LevelProgress level={profile.level} xp={profile.xp} xpToNextLevel={profile.xpToNextLevel} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Profile System Component
// ============================================

export function ProfileSystem({
  profile,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onEditProfile,
  onShareProfile,
  className,
}: ProfileSystemProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity'>('overview');

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden', className)}>
      {/* Header */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        onEditProfile={onEditProfile}
        onShareProfile={onShareProfile}
      />

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6">
        <div className="flex gap-6">
          {(['overview', 'badges', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'py-4 border-b-2 font-medium transition-colors',
                activeTab === tab
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {tab === 'overview' && '概览'}
              {tab === 'badges' && `徽章 (${profile.badges.length})`}
              {tab === 'activity' && '动态'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="评价" value={profile.stats.reviews} icon="💬" />
              <StatCard label="任务" value={profile.stats.tasks} icon="✅" />
              <StatCard label="连续登录" value={`${profile.stats.streak}天`} icon="🔥" />
              <StatCard label="粉丝" value={profile.stats.followers} icon="👥" />
              <StatCard label="关注" value={profile.stats.following} icon="➡️" />
              <StatCard label="排名" value={`#${profile.stats.rank}`} icon="🏆" />
            </div>

            {/* Recent Badges */}
            {profile.badges.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">最近获得的徽章</h3>
                  <button
                    onClick={() => setActiveTab('badges')}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    查看全部
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.badges.slice(0, 4).map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {profile.recentActivity.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">最近动态</h3>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    查看全部
                  </button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  {profile.recentActivity.slice(0, 5).map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            {profile.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.badges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🏆</div>
                <p className="text-gray-500 dark:text-gray-400">还没有获得任何徽章</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">完成任务和活动来获得徽章</p>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div>
            {profile.recentActivity.length > 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                {profile.recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-500 dark:text-gray-400">还没有任何动态</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Demo Profile Data
// ============================================

export const demoProfile: UserProfile = {
  id: '1',
  username: 'test99',
  displayName: 'Test User',
  email: 'test99@gmail.com',
  bio: '热爱探索各种AI工具，分享使用心得。每天都在学习新东西！',
  level: 5,
  xp: 1350,
  xpToNextLevel: 2250,
  joinedAt: '2023-12-01',
  lastActiveAt: new Date().toISOString(),
  stats: {
    reviews: 12,
    tasks: 25,
    streak: 7,
    followers: 45,
    following: 23,
    rank: 156,
  },
  badges: [
    { id: '1', name: '新手', description: '完成首次登录', icon: '🌱', rarity: 'common', earnedAt: '2023-12-01' },
    { id: '2', name: '初级测试者', description: '达到5级', icon: '🌿', rarity: 'rare', earnedAt: '2024-01-01' },
    { id: '3', name: '评论家', description: '发表10条评价', icon: '💬', rarity: 'rare', earnedAt: '2024-01-02' },
    { id: '4', name: '连续登录', description: '连续登录7天', icon: '🔥', rarity: 'epic', earnedAt: '2024-01-03' },
  ],
  recentActivity: [
    { id: '1', type: 'review', title: '评价了 ChatGPT', description: '非常强大的AI助手...', xp: 50, timestamp: '2024-01-03T10:00:00Z' },
    { id: '2', type: 'task', title: '完成每日任务', description: '浏览5个AI工具', xp: 100, timestamp: '2024-01-03T09:00:00Z' },
    { id: '3', type: 'badge', title: '获得徽章：连续登录', timestamp: '2024-01-03T08:00:00Z' },
    { id: '4', type: 'level_up', title: '升级到 Lv.5', xp: 200, timestamp: '2024-01-02T15:00:00Z' },
    { id: '5', type: 'follow', title: '关注了 AI大师', timestamp: '2024-01-02T12:00:00Z' },
  ],
  socialLinks: {
    twitter: 'https://twitter.com/test99',
    github: 'https://github.com/test99',
    website: 'https://test99.dev',
  },
};

// ============================================
// Export
// ============================================

export default ProfileSystem;
