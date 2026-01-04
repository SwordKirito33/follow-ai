import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface LeaderboardEntry {
  rank: number;
  previousRank?: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  totalXp: number;
  tasksCompleted: number;
  isCurrentUser?: boolean;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  title?: string;
  showTrend?: boolean;
  className?: string;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  entries,
  title = 'Leaderboard',
  showTrend = true,
  className = '',
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-white/10 dark:border-gray-600';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700';
      default:
        return 'bg-gray-900/90 backdrop-blur-sm border-white/10 dark:border-gray-700';
    }
  };

  const getTrend = (current: number, previous?: number) => {
    if (!previous) return 'neutral';
    if (current < previous) return 'up';
    if (current > previous) return 'down';
    return 'neutral';
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-white/10 dark:border-gray-700">
        <h2 className="text-xl font-bold text-white dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {title}
        </h2>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {entries.map((entry, index) => {
          const trend = getTrend(entry.rank, entry.previousRank);
          
          return (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 ${getRankBg(entry.rank)} ${
                entry.isCurrentUser ? 'ring-2 ring-blue-500 ring-inset' : ''
              }`}
            >
              {/* Rank */}
              <div className="w-12 flex items-center justify-center">
                {getRankIcon(entry.rank) || (
                  <span className="text-lg font-bold text-gray-400 dark:text-gray-300">
                    #{entry.rank}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <UserAvatar
                  src={entry.avatarUrl}
                  name={entry.displayName}
                  size="md"
                  showLevel
                  level={entry.level}
                />
                <div className="min-w-0">
                  <p className={`font-semibold truncate ${
                    entry.isCurrentUser ? 'text-primary-cyan dark:text-blue-400' : 'text-white dark:text-white'
                  }`}>
                    {entry.displayName}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs bg-primary-blue/20 dark:bg-blue-900/30 text-primary-cyan dark:text-blue-400 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-300">
                    {entry.tasksCompleted} tasks completed
                  </p>
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="font-bold text-white dark:text-white">
                  {entry.totalXp.toLocaleString()} XP
                </p>
                {showTrend && (
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <TrendIcon trend={trend} />
                    {entry.previousRank && trend !== 'neutral' && (
                      <span className={`text-xs ${
                        trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {Math.abs(entry.rank - entry.previousRank)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Podium component for top 3
export const LeaderboardPodium: React.FC<{
  entries: LeaderboardEntry[];
  className?: string;
}> = ({ entries, className = '' }) => {
  const topThree = entries.slice(0, 3);
  const [first, second, third] = topThree;

  const podiumOrder = [second, first, third].filter(Boolean);
  const heights = ['h-24', 'h-32', 'h-20'];
  const positions = ['2nd', '1st', '3rd'];
  const colors = [
    'from-gray-300 to-gray-400',
    'from-yellow-400 to-yellow-500',
    'from-amber-500 to-amber-600',
  ];

  return (
    <div className={`flex items-end justify-center gap-4 py-8 ${className}`}>
      {podiumOrder.map((entry, index) => {
        if (!entry) return null;
        const actualIndex = index === 1 ? 0 : index === 0 ? 1 : 2;
        
        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center"
          >
            <UserAvatar
              src={entry.avatarUrl}
              name={entry.displayName}
              size="xl"
              showLevel
              level={entry.level}
              className="mb-3"
            />
            <p className="font-bold text-white dark:text-white text-center">
              {entry.displayName}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-300 mb-2">
              {entry.totalXp.toLocaleString()} XP
            </p>
            <div
              className={`w-24 ${heights[actualIndex]} bg-gradient-to-t ${colors[actualIndex]} rounded-t-lg flex items-center justify-center`}
            >
              <span className="text-2xl font-bold text-white">
                {positions[actualIndex]}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LeaderboardCard;
