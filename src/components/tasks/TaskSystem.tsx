// Task System Component for Follow.ai
// Comprehensive task management with categories, progress, and rewards

import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

type TaskCategory = 'daily' | 'weekly' | 'special' | 'achievement';
type TaskDifficulty = 'beginner' | 'intermediate' | 'advanced';
type TaskStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'claimed';

interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  xpReward: number;
  bonusReward?: {
    type: 'badge' | 'title' | 'item';
    value: string;
  };
  requirements?: {
    level?: number;
    completedTasks?: string[];
  };
  progress?: {
    current: number;
    target: number;
  };
  status: TaskStatus;
  expiresAt?: string;
  completedAt?: string;
}

interface TaskSystemProps {
  tasks: Task[];
  userLevel: number;
  userXp: number;
  onClaimReward: (taskId: string) => void;
  onStartTask: (taskId: string) => void;
  className?: string;
}

// ============================================
// Constants
// ============================================

const categoryConfig: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  daily: { label: '每日任务', icon: '📅', color: 'blue' },
  weekly: { label: '每周任务', icon: '📆', color: 'purple' },
  special: { label: '特殊任务', icon: '⭐', color: 'yellow' },
  achievement: { label: '成就', icon: '🏆', color: 'amber' },
};

const difficultyConfig: Record<TaskDifficulty, { label: string; color: string; multiplier: number }> = {
  beginner: { label: '入门', color: 'green', multiplier: 1 },
  intermediate: { label: '进阶', color: 'blue', multiplier: 1.5 },
  advanced: { label: '高级', color: 'purple', multiplier: 2 },
};

// ============================================
// Helper Components
// ============================================

function TaskCategoryBadge({ category }: { category: TaskCategory }) {
  const config = categoryConfig[category];
  const colorClasses: Record<string, string> = {
    blue: 'bg-primary-blue/20 text-primary-blue dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-primary-purple/20 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    yellow: 'bg-accent-gold/20 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colorClasses[config.color])}>
      {config.icon} {config.label}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: TaskDifficulty }) {
  const config = difficultyConfig[difficulty];
  const colorClasses: Record<string, string> = {
    green: 'bg-accent-green/20 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    blue: 'bg-primary-blue/20 text-primary-blue dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-primary-purple/20 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colorClasses[config.color])}>
      {config.label}
    </span>
  );
}

function ProgressBar({ current, target }: { current: number; target: number }) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-300 mb-1">
        <span>进度</span>
        <span>{current}/{target}</span>
      </div>
      <div className="h-2 bg-white/10 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('已过期');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}天 ${hours % 24}小时`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}小时 ${minutes}分钟`);
      } else {
        setTimeLeft(`${minutes}分 ${seconds}秒`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <span className="text-xs text-orange-500 dark:text-orange-400 flex items-center gap-1">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {timeLeft}
    </span>
  );
}

// ============================================
// Task Card Component
// ============================================

interface TaskCardProps {
  task: Task;
  onClaim: () => void;
  onStart: () => void;
  isLocked: boolean;
  lockReason?: string;
}

function TaskCard({ task, onClaim, onStart, isLocked, lockReason }: TaskCardProps) {
  const isCompleted = task.status === 'completed' || task.status === 'claimed';
  const canClaim = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <div
      className={cn(
        'relative p-5 rounded-xl border transition-all duration-300',
        isLocked
          ? 'bg-white/10 dark:bg-gray-800/50 border-white/10 dark:border-gray-700 opacity-60'
          : isCompleted
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-white dark:bg-gray-800 border-white/10 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg'
      )}
    >
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 dark:bg-gray-900/30 rounded-xl">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-gray-400 dark:text-gray-300">{lockReason}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          <TaskCategoryBadge category={task.category} />
          <DifficultyBadge difficulty={task.difficulty} />
        </div>
        {task.expiresAt && <CountdownTimer expiresAt={task.expiresAt} />}
      </div>

      {/* Title & Description */}
      <h3 className={cn(
        'font-semibold mb-2',
        isCompleted ? 'text-green-700 dark:text-green-400' : 'text-white dark:text-white'
      )}>
        {isCompleted && (
          <svg className="w-5 h-5 inline-block mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {task.title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">
        {task.description}
      </p>

      {/* Progress */}
      {task.progress && !isCompleted && (
        <div className="mb-4">
          <ProgressBar current={task.progress.current} target={task.progress.target} />
        </div>
      )}

      {/* Rewards */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary-purple/20 dark:bg-purple-900/30">
          <svg className="w-4 h-4 text-primary-purple dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            +{task.xpReward} XP
          </span>
        </div>
        {task.bonusReward && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              🎁 {task.bonusReward.value}
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      {!isLocked && (
        <button
          onClick={canClaim ? onClaim : onStart}
          disabled={task.status === 'claimed'}
          className={cn(
            'w-full py-2 px-4 rounded-lg font-medium transition-all',
            task.status === 'claimed'
              ? 'bg-white/10 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : canClaim
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
              : isInProgress
              ? 'bg-primary-purple/20 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
          )}
        >
          {task.status === 'claimed'
            ? '已领取'
            : canClaim
            ? '领取奖励'
            : isInProgress
            ? '继续任务'
            : '开始任务'}
        </button>
      )}
    </div>
  );
}

// ============================================
// Task System Component
// ============================================

export function TaskSystem({
  tasks,
  userLevel,
  userXp,
  onClaimReward,
  onStartTask,
  className,
}: TaskSystemProps) {
  const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeCategory !== 'all' && task.category !== activeCategory) return false;
      if (!showCompleted && (task.status === 'completed' || task.status === 'claimed')) return false;
      return true;
    });
  }, [tasks, activeCategory, showCompleted]);

  // Calculate stats
  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed' || t.status === 'claimed').length;
    const available = tasks.filter((t) => t.status === 'available' || t.status === 'in_progress').length;
    const totalXp = tasks
      .filter((t) => t.status === 'claimed')
      .reduce((sum, t) => sum + t.xpReward, 0);
    return { completed, available, totalXp, total: tasks.length };
  }, [tasks]);

  // Check if task is locked
  const isTaskLocked = (task: Task): { locked: boolean; reason?: string } => {
    if (task.status === 'locked') {
      if (task.requirements?.level && userLevel < task.requirements.level) {
        return { locked: true, reason: `需要等级 ${task.requirements.level}` };
      }
      if (task.requirements?.completedTasks?.length) {
        return { locked: true, reason: '需要完成前置任务' };
      }
      return { locked: true, reason: '任务已锁定' };
    }
    return { locked: false };
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-white/10 dark:border-gray-700">
          <div className="text-2xl font-bold text-white dark:text-white">{stats.available}</div>
          <div className="text-sm text-gray-400 dark:text-gray-300">可用任务</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-white/10 dark:border-gray-700">
          <div className="text-2xl font-bold text-accent-green dark:text-green-400">{stats.completed}</div>
          <div className="text-sm text-gray-400 dark:text-gray-300">已完成</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-white/10 dark:border-gray-700">
          <div className="text-2xl font-bold text-primary-purple dark:text-purple-400">{stats.totalXp}</div>
          <div className="text-sm text-gray-400 dark:text-gray-300">获得 XP</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-white/10 dark:border-gray-700">
          <div className="text-2xl font-bold text-white dark:text-white">
            {Math.round((stats.completed / stats.total) * 100)}%
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-300">完成率</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeCategory === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-white/10 dark:bg-gray-800 text-gray-300 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700'
          )}
        >
          全部
        </button>
        {(Object.keys(categoryConfig) as TaskCategory[]).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 dark:bg-gray-800 text-gray-300 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700'
            )}
          >
            {categoryConfig[category].icon} {categoryConfig[category].label}
          </button>
        ))}

        <div className="ml-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 dark:border-gray-600 text-primary-purple focus:ring-purple-500"
            />
            <span className="text-sm text-gray-400 dark:text-gray-400">显示已完成</span>
          </label>
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const { locked, reason } = isTaskLocked(task);
            return (
              <TaskCard
                key={task.id}
                task={task}
                onClaim={() => onClaimReward(task.id)}
                onStart={() => onStartTask(task.id)}
                isLocked={locked}
                lockReason={reason}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/5 dark:bg-gray-800/50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-gray-400 dark:text-gray-300">
            {showCompleted ? '没有任务' : '没有可用任务，试试显示已完成的任务'}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Demo Tasks Data
// ============================================

export const demoTasks: Task[] = [
  {
    id: '1',
    title: '完成首次登录',
    description: '登录Follow.ai平台，开始你的AI工具探索之旅',
    category: 'daily',
    difficulty: 'beginner',
    xpReward: 50,
    status: 'claimed',
    completedAt: '2024-01-01',
  },
  {
    id: '2',
    title: '浏览5个AI工具',
    description: '探索平台上的AI工具，了解它们的功能和特点',
    category: 'daily',
    difficulty: 'beginner',
    xpReward: 100,
    progress: { current: 3, target: 5 },
    status: 'in_progress',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: '写一篇工具评价',
    description: '分享你对某个AI工具的使用体验和看法',
    category: 'daily',
    difficulty: 'intermediate',
    xpReward: 200,
    bonusReward: { type: 'badge', value: '评论家徽章' },
    status: 'available',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: '连续登录7天',
    description: '保持活跃，连续7天登录平台',
    category: 'weekly',
    difficulty: 'beginner',
    xpReward: 500,
    progress: { current: 4, target: 7 },
    status: 'in_progress',
  },
  {
    id: '5',
    title: '邀请3位好友',
    description: '邀请好友加入Follow.ai，一起探索AI工具',
    category: 'weekly',
    difficulty: 'intermediate',
    xpReward: 1000,
    bonusReward: { type: 'title', value: '社交达人' },
    progress: { current: 1, target: 3 },
    status: 'in_progress',
  },
  {
    id: '6',
    title: '达到10级',
    description: '通过完成任务和活动，提升你的等级到10级',
    category: 'achievement',
    difficulty: 'advanced',
    xpReward: 2000,
    bonusReward: { type: 'badge', value: '进阶用户徽章' },
    requirements: { level: 10 },
    status: 'locked',
  },
];

// ============================================
// Export
// ============================================

export default TaskSystem;
