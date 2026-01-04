import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Search,
  Calendar,
  Users,
  Zap,
  Star,
} from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  previousRank: number;
  id: string;
  username: string;
  avatar: string;
  level: number;
  totalXp: number;
  tasksCompleted: number;
  streak: number;
  badges: string[];
  isCurrentUser?: boolean;
}

interface EnhancedLeaderboardProps {
  users: LeaderboardUser[];
  currentUserRank?: number;
  totalUsers: number;
  timeRange: 'daily' | 'weekly' | 'monthly' | 'all-time';
  onTimeRangeChange: (range: 'daily' | 'weekly' | 'monthly' | 'all-time') => void;
  onUserClick: (userId: string) => void;
}

const EnhancedLeaderboard: React.FC<EnhancedLeaderboardProps> = ({
  users,
  currentUserRank,
  totalUsers,
  timeRange,
  onTimeRangeChange,
  onUserClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const timeRanges = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all-time', label: 'All Time' },
  ];

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) return { type: 'up', value: diff };
    if (diff < 0) return { type: 'down', value: Math.abs(diff) };
    return { type: 'same', value: 0 };
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-yellow-400/50';
      case 2:
        return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-400/20 to-amber-500/20 border-amber-400/50';
      default:
        return 'bg-white dark:bg-gray-900 border-white/10 dark:border-gray-700';
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = filteredUsers.slice(0, 3);
  const rest = filteredUsers.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white dark:text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500" />
            Leaderboard
          </h2>
          <p className="text-gray-400 dark:text-gray-400 mt-1">
            {totalUsers.toLocaleString()} testers competing
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex gap-2 bg-white/10 dark:bg-gray-800 rounded-xl p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => onTimeRangeChange(range.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range.value
                  ? 'bg-white dark:bg-gray-700 text-primary-cyan shadow-sm'
                  : 'text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-white/10 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Current user rank */}
      {currentUserRank && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-blue/20 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-primary-cyan" />
            </div>
            <div>
              <p className="text-sm text-primary-cyan dark:text-blue-400">Your Rank</p>
              <p className="text-2xl font-bold text-primary-blue dark:text-blue-300">
                #{currentUserRank}
              </p>
            </div>
          </div>
          <p className="text-sm text-primary-cyan dark:text-blue-400">
            Top {((currentUserRank / totalUsers) * 100).toFixed(1)}%
          </p>
        </div>
      )}

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 py-8">
        {/* 2nd place */}
        {top3[1] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <img
                src={top3[1].avatar}
                alt={top3[1].username}
                className="w-20 h-20 rounded-full border-4 border-white/20"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
            </div>
            <p className="mt-4 font-semibold text-white dark:text-white truncate max-w-full">
              {top3[1].username}
            </p>
            <p className="text-sm text-gray-400">{top3[1].totalXp.toLocaleString()} XP</p>
            <div className="h-24 w-full bg-white/10 dark:bg-gray-700 rounded-t-lg mt-4" />
          </motion.div>
        )}

        {/* 1st place */}
        {top3[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center -mt-8"
          >
            <Crown className="w-10 h-10 text-yellow-500 mb-2" />
            <div className="relative">
              <img
                src={top3[0].avatar}
                alt={top3[0].username}
                className="w-24 h-24 rounded-full border-4 border-yellow-400"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
            </div>
            <p className="mt-4 font-bold text-white dark:text-white truncate max-w-full">
              {top3[0].username}
            </p>
            <p className="text-sm text-accent-gold">{top3[0].totalXp.toLocaleString()} XP</p>
            <div className="h-32 w-full bg-yellow-400 rounded-t-lg mt-4" />
          </motion.div>
        )}

        {/* 3rd place */}
        {top3[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <img
                src={top3[2].avatar}
                alt={top3[2].username}
                className="w-20 h-20 rounded-full border-4 border-amber-500"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
            </div>
            <p className="mt-4 font-semibold text-white dark:text-white truncate max-w-full">
              {top3[2].username}
            </p>
            <p className="text-sm text-gray-400">{top3[2].totalXp.toLocaleString()} XP</p>
            <div className="h-16 w-full bg-amber-500 rounded-t-lg mt-4" />
          </motion.div>
        )}
      </div>

      {/* Rest of the list */}
      <div className="space-y-3">
        {rest.map((user, index) => {
          const rankChange = getRankChange(user.rank, user.previousRank);

          return (
            <motion.button
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onUserClick(user.id)}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:shadow-md ${
                user.isCurrentUser
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                  : getRankBg(user.rank)
              }`}
            >
              {/* Rank */}
              <div className="w-12 text-center">
                {getRankIcon(user.rank) || (
                  <span className="text-xl font-bold text-gray-400">
                    {user.rank}
                  </span>
                )}
              </div>

              {/* Rank change */}
              <div className="w-8">
                {rankChange.type === 'up' && (
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">{rankChange.value}</span>
                  </div>
                )}
                {rankChange.type === 'down' && (
                  <div className="flex items-center text-red-500">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs">{rankChange.value}</span>
                  </div>
                )}
                {rankChange.type === 'same' && (
                  <Minus className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {/* Avatar */}
              <img
                src={user.avatar}
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white dark:text-white">
                    {user.username}
                  </p>
                  {user.isCurrentUser && (
                    <span className="px-2 py-0.5 bg-primary-blue/20 dark:bg-blue-800 text-primary-cyan dark:text-blue-300 text-xs rounded-full">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>Level {user.level}</span>
                  <span>•</span>
                  <span>{user.tasksCompleted} tasks</span>
                  {user.streak > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-orange-500">🔥 {user.streak} day streak</span>
                    </>
                  )}
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="font-bold text-primary-cyan">
                  {user.totalXp.toLocaleString()} XP
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Load more */}
      {filteredUsers.length < totalUsers && (
        <button className="w-full py-4 text-primary-cyan font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
          Load More
        </button>
      )}
    </div>
  );
};

export default EnhancedLeaderboard;
