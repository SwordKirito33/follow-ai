// Enhanced Level Components Library for Follow.ai
// Provides multiple level display options

import React from 'react';
import { cn } from '../../lib/utils';
import { getLevelInfo, getLevelBadge, formatXp, formatProgress } from '../../lib/level-system';

// ============================================
// Level Badge Component
// ============================================

interface LevelBadgeProps {
  level: number;
  showTitle?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function LevelBadge({ level, showTitle = false, size = 'md', className }: LevelBadgeProps) {
  const badge = getLevelBadge(level);
  const levelInfo = getLevelInfo(level * 100);

  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-2.5 py-1',
    lg: 'text-lg px-3 py-1.5',
  };

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium',
          sizeClasses[size]
        )}
      >
        <span>{badge}</span>
        <span>Lv.{level}</span>
      </span>
      {showTitle && levelInfo.title && (
        <span className="text-gray-500 dark:text-gray-400 text-sm">{levelInfo.title}</span>
      )}
    </div>
  );
}

// ============================================
// Mini Level Progress Component
// ============================================

interface MiniLevelProgressProps {
  totalXp: number;
  className?: string;
}

export function MiniLevelProgress({ totalXp, className }: MiniLevelProgressProps) {
  const levelInfo = getLevelInfo(totalXp);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LevelBadge level={levelInfo.level} size="xs" />
      <div className="flex-1 max-w-[80px] h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: `${levelInfo.progress}%` }}
        />
      </div>
    </div>
  );
}

// ============================================
// Level Card Component
// ============================================

interface LevelCardProps {
  totalXp: number;
  showDetails?: boolean;
  className?: string;
}

export function LevelCard({ totalXp, showDetails = true, className }: LevelCardProps) {
  const levelInfo = getLevelInfo(totalXp);
  const badge = getLevelBadge(levelInfo.level);

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6',
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl">
          {badge}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            Level {levelInfo.level}
          </div>
          {levelInfo.title && (
            <div className="text-gray-500 dark:text-gray-400">{levelInfo.title}</div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Level {levelInfo.level}</span>
          <span className="text-gray-600 dark:text-gray-400">Level {levelInfo.level + 1}</span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatXp(levelInfo.xpInCurrentLevel)} XP</span>
          <span>{formatProgress(levelInfo.progress)}</span>
          <span>{formatXp(levelInfo.xpToNextLevel)} XP to next</span>
        </div>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{formatXp(totalXp)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total XP</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">
              {formatXp(levelInfo.xpToNextLevel - levelInfo.xpInCurrentLevel)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">XP to Next Level</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Level Up Celebration Component
// ============================================

interface LevelUpCelebrationProps {
  oldLevel: number;
  newLevel: number;
  onClose?: () => void;
}

export function LevelUpCelebration({ oldLevel, newLevel, onClose }: LevelUpCelebrationProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const newBadge = getLevelBadge(newLevel);
  const levelInfo = getLevelInfo(newLevel * 100);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl transform animate-scaleIn">
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][i % 4],
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="text-6xl mb-4 animate-bounce">{newBadge}</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Level Up!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {oldLevel} → {newLevel}
        </p>
        {levelInfo.title && (
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {levelInfo.title}
            </span>
          </div>
        )}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

// ============================================
// Level Stats Grid Component
// ============================================

interface LevelStatsGridProps {
  totalXp: number;
  tasksCompleted?: number;
  rank?: number;
  streakDays?: number;
  className?: string;
}

export function LevelStatsGrid({
  totalXp,
  tasksCompleted,
  rank,
  streakDays,
  className,
}: LevelStatsGridProps) {
  const levelInfo = getLevelInfo(totalXp);

  const stats = [
    { label: 'Level', value: levelInfo.level, icon: '🎯', color: 'text-blue-600' },
    { label: 'Total XP', value: formatXp(totalXp), icon: '⚡', color: 'text-purple-600' },
    { label: 'Progress', value: formatProgress(levelInfo.progress), icon: '📈', color: 'text-green-600' },
    ...(tasksCompleted !== undefined
      ? [{ label: 'Tasks', value: tasksCompleted, icon: '✅', color: 'text-emerald-600' }]
      : []),
    ...(rank !== undefined
      ? [{ label: 'Rank', value: `#${rank}`, icon: '🏆', color: 'text-amber-600' }]
      : []),
    ...(streakDays !== undefined
      ? [{ label: 'Streak', value: `${streakDays}d`, icon: '🔥', color: 'text-orange-600' }]
      : []),
  ];

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3', className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center hover:shadow-md transition-shadow"
        >
          <div className="text-xl mb-1">{stat.icon}</div>
          <div className={cn('text-lg font-bold', stat.color)}>{stat.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Export all
// ============================================

export { getLevelInfo, getLevelBadge, formatXp, formatProgress } from '../../lib/level-system';
