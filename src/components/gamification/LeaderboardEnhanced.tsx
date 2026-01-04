import React, { useState } from 'react';

// =====================================================
// 增强版排行榜组件
// 任务: 221-240 排行榜相关任务
// =====================================================

interface LeaderboardUser {
  id: string;
  rank: number;
  previousRank?: number;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  badges: number;
  tasksCompleted: number;
  streak: number;
  country?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardEnhancedProps {
  users: LeaderboardUser[];
  currentUserRank?: number;
  totalUsers: number;
  type: 'xp' | 'tasks' | 'reviews' | 'streak';
  period: 'daily' | 'weekly' | 'monthly' | 'all';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly' | 'all') => void;
  onTypeChange: (type: 'xp' | 'tasks' | 'reviews' | 'streak') => void;
  isLoading?: boolean;
}

export const LeaderboardEnhanced: React.FC<LeaderboardEnhancedProps> = ({
  users,
  currentUserRank,
  totalUsers,
  type,
  period,
  onPeriodChange,
  onTypeChange,
  isLoading = false
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const periods = [
    { id: 'daily', name: '今日' },
    { id: 'weekly', name: '本周' },
    { id: 'monthly', name: '本月' },
    { id: 'all', name: '总榜' }
  ];

  const types = [
    { id: 'xp', name: 'XP', icon: '⚡' },
    { id: 'tasks', name: '任务', icon: '✅' },
    { id: 'reviews', name: '评价', icon: '⭐' },
    { id: 'streak', name: '连续', icon: '🔥' }
  ];

  const getRankChange = (user: LeaderboardUser) => {
    if (!user.previousRank) return null;
    const change = user.previousRank - user.rank;
    if (change > 0) return { direction: 'up', value: change };
    if (change < 0) return { direction: 'down', value: Math.abs(change) };
    return { direction: 'same', value: 0 };
  };

  const getValueByType = (user: LeaderboardUser) => {
    switch (type) {
      case 'xp': return `${user.xp.toLocaleString()} XP`;
      case 'tasks': return `${user.tasksCompleted} 任务`;
      case 'reviews': return `${user.badges} 评价`;
      case 'streak': return `${user.streak} 天`;
    }
  };

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">排行榜</h2>
          <p className="text-muted-foreground">
            共 {totalUsers.toLocaleString()} 名用户
            {currentUserRank && ` · 你的排名 #${currentUserRank}`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-lg border border-border hover:bg-muted transition-colors md:hidden"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      {/* 筛选器 */}
      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
        {/* 时间段 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id as typeof period)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${period === p.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* 类型 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => onTypeChange(t.id as typeof type)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${type === t.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* 前三名领奖台 */}
          {top3.length >= 3 && (
            <div className="flex items-end justify-center gap-4 py-8">
              {/* 第二名 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 mx-auto flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                    {top3[1].avatar ? (
                      <img loading="lazy" src={top3[1].avatar} alt={top3[1].name} className="w-full h-full object-cover" />
                    ) : (
                      top3[1].name.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-400 text-white text-sm font-bold flex items-center justify-center">
                    2
                  </div>
                </div>
                <p className="mt-4 font-medium text-foreground truncate max-w-[80px]">{top3[1].name}</p>
                <p className="text-sm text-muted-foreground">{getValueByType(top3[1])}</p>
                <div className="mt-2 h-20 w-20 bg-white/10 rounded-t-lg mx-auto" />
              </div>

              {/* 第一名 */}
              <div className="text-center -mt-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mx-auto flex items-center justify-center text-white text-2xl font-bold overflow-hidden ring-4 ring-yellow-400/30">
                    {top3[0].avatar ? (
                      <img loading="lazy" src={top3[0].avatar} alt={top3[0].name} className="w-full h-full object-cover" />
                    ) : (
                      top3[0].name.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-500 text-white font-bold flex items-center justify-center">
                    👑
                  </div>
                </div>
                <p className="mt-4 font-semibold text-foreground truncate max-w-[100px]">{top3[0].name}</p>
                <p className="text-sm text-primary font-medium">{getValueByType(top3[0])}</p>
                <div className="mt-2 h-28 w-24 bg-yellow-200 rounded-t-lg mx-auto" />
              </div>

              {/* 第三名 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 mx-auto flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                    {top3[2].avatar ? (
                      <img loading="lazy" src={top3[2].avatar} alt={top3[2].name} className="w-full h-full object-cover" />
                    ) : (
                      top3[2].name.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                    3
                  </div>
                </div>
                <p className="mt-4 font-medium text-foreground truncate max-w-[70px]">{top3[2].name}</p>
                <p className="text-sm text-muted-foreground">{getValueByType(top3[2])}</p>
                <div className="mt-2 h-14 w-16 bg-orange-200 rounded-t-lg mx-auto" />
              </div>
            </div>
          )}

          {/* 其余排名 */}
          <div className="space-y-2">
            {rest.map(user => {
              const rankChange = getRankChange(user);
              return (
                <div
                  key={user.id}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border transition-all
                    ${user.isCurrentUser
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                    }
                  `}
                >
                  {/* 排名 */}
                  <div className="w-12 text-center">
                    <span className="text-lg font-bold text-foreground">#{user.rank}</span>
                    {rankChange && (
                      <div className="flex items-center justify-center text-xs mt-1">
                        {rankChange.direction === 'up' && (
                          <span className="text-green-500 flex items-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            {rankChange.value}
                          </span>
                        )}
                        {rankChange.direction === 'down' && (
                          <span className="text-red-500 flex items-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {rankChange.value}
                          </span>
                        )}
                        {rankChange.direction === 'same' && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 头像 */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden">
                    {user.avatar ? (
                      <img loading="lazy" src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{user.name}</p>
                      {user.isCurrentUser && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">你</span>
                      )}
                      {user.country && (
                        <span className="text-sm">{user.country}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Lv.{user.level}</span>
                      <span>·</span>
                      <span>{user.badges} 徽章</span>
                    </div>
                  </div>

                  {/* 数值 */}
                  <div className="text-right">
                    <p className="font-semibold text-primary">{getValueByType(user)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// =====================================================
// 迷你排行榜组件
// =====================================================

interface MiniLeaderboardProps {
  users: Array<{
    id: string;
    rank: number;
    name: string;
    avatar?: string;
    value: number;
  }>;
  title: string;
  unit: string;
  viewAllLink?: string;
}

export const MiniLeaderboard: React.FC<MiniLeaderboardProps> = ({
  users,
  title,
  unit,
  viewAllLink
}) => {
  return (
    <div className="bg-background rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {viewAllLink && (
          <a href={viewAllLink} className="text-sm text-primary hover:underline">
            查看全部
          </a>
        )}
      </div>
      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-3">
            <span className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${user.rank === 1 ? 'bg-yellow-500 text-white' : ''}
              ${user.rank === 2 ? 'bg-gray-400 text-white' : ''}
              ${user.rank === 3 ? 'bg-orange-500 text-white' : ''}
              ${user.rank > 3 ? 'bg-muted text-muted-foreground' : ''}
            `}>
              {user.rank}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
              {user.avatar ? (
                <img loading="lazy" src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <span className="flex-1 text-sm text-foreground truncate">{user.name}</span>
            <span className="text-sm font-medium text-primary">
              {user.value.toLocaleString()} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardEnhanced;
