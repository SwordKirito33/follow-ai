import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Trophy,
  Clock,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Activity,
  Users,
  Star,
  Gift,
  Bell,
  Settings,
} from 'lucide-react';

interface DashboardStats {
  totalXp: number;
  xpChange: number;
  level: number;
  rank: number;
  rankChange: number;
  tasksCompleted: number;
  tasksThisWeek: number;
  streak: number;
  earnings: number;
  earningsChange: number;
}

interface RecentTask {
  id: string;
  title: string;
  tool: string;
  xp: number;
  completedAt: Date;
  rating: number;
}

interface UpcomingTask {
  id: string;
  title: string;
  tool: string;
  xp: number;
  deadline: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Notification {
  id: string;
  type: 'achievement' | 'task' | 'system' | 'reward';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface EnhancedDashboardProps {
  stats: DashboardStats;
  recentTasks: RecentTask[];
  upcomingTasks: UpcomingTask[];
  notifications: Notification[];
  xpHistory: { date: string; xp: number }[];
  onTaskClick: (taskId: string) => void;
  onViewAllTasks: () => void;
  onViewLeaderboard: () => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  stats,
  recentTasks,
  upcomingTasks,
  notifications,
  xpHistory,
  onTaskClick,
  onViewAllTasks,
  onViewLeaderboard,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const statCards = [
    {
      title: 'Total XP',
      value: stats.totalXp.toLocaleString(),
      change: stats.xpChange,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-primary-cyan',
    },
    {
      title: 'Global Rank',
      value: `#${stats.rank}`,
      change: stats.rankChange,
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-accent-gold',
      invertChange: true,
    },
    {
      title: 'Tasks Done',
      value: stats.tasksCompleted.toString(),
      change: stats.tasksThisWeek,
      changeLabel: 'this week',
      icon: <Target className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-accent-green',
    },
    {
      title: 'Earnings',
      value: `$${stats.earnings.toLocaleString()}`,
      change: stats.earningsChange,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-primary-purple',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-accent-green/20 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-accent-gold/20 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-white/10 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary-cyan" />
            Dashboard
          </h1>
          <p className="text-gray-400 dark:text-gray-400 mt-1">
            Welcome back! Here's your testing overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          {stats.streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm font-bold text-orange-600">{stats.streak} Day Streak</p>
                <p className="text-xs text-orange-500">Keep it up!</p>
              </div>
            </div>
          )}
          {/* Level badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
            <Star className="w-5 h-5" />
            <span className="font-bold">Level {stats.level}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <div className={stat.textColor}>{stat.icon}</div>
              </div>
              {stat.change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${
                  (stat.invertChange ? stat.change < 0 : stat.change > 0)
                    ? 'text-accent-green'
                    : stat.change === 0
                    ? 'text-gray-400'
                    : 'text-red-600'
                }`}>
                  {(stat.invertChange ? stat.change < 0 : stat.change > 0) ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : stat.change === 0 ? null : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {stat.change > 0 ? '+' : ''}{stat.change}
                    {stat.changeLabel ? ` ${stat.changeLabel}` : '%'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-3xl font-bold text-white dark:text-white mt-4">
              {stat.value}
            </p>
            <p className="text-sm text-gray-400 mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* XP Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-cyan" />
              XP Progress
            </h3>
            <div className="flex gap-2 bg-white/10 dark:bg-gray-800 rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-white dark:bg-gray-700 text-primary-cyan shadow-sm'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Simple chart visualization */}
          <div className="h-64 flex items-end gap-2">
            {xpHistory.slice(-14).map((day, index) => {
              const maxXp = Math.max(...xpHistory.map((d) => d.xp));
              const height = (day.xp / maxXp) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[4px]"
                  />
                  <span className="text-xs text-gray-400 rotate-45 origin-left">
                    {day.date.slice(-5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-cyan" />
              Notifications
            </h3>
            <span className="px-2 py-1 bg-primary-blue/20 dark:bg-blue-900/30 text-primary-cyan text-xs font-medium rounded-full">
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-xl ${
                  notification.read
                    ? 'bg-white/5 dark:bg-gray-800'
                    : 'bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'achievement' ? 'bg-accent-gold/20 dark:bg-yellow-900/30' :
                    notification.type === 'reward' ? 'bg-accent-green/20 dark:bg-green-900/30' :
                    'bg-primary-blue/20 dark:bg-blue-900/30'
                  }`}>
                    {notification.type === 'achievement' && <Trophy className="w-4 h-4 text-accent-gold" />}
                    {notification.type === 'task' && <Target className="w-4 h-4 text-primary-cyan" />}
                    {notification.type === 'reward' && <Gift className="w-4 h-4 text-accent-green" />}
                    {notification.type === 'system' && <Settings className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white dark:text-white text-sm truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent tasks */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-green" />
              Recent Tasks
            </h3>
            <button
              onClick={onViewAllTasks}
              className="text-sm text-primary-cyan hover:text-primary-blue flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onTaskClick(task.id)}
                className="w-full p-4 bg-white/5 dark:bg-gray-800 rounded-xl flex items-center gap-4 hover:bg-white/10 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="p-2 bg-accent-green/20 dark:bg-green-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-accent-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white dark:text-white truncate">{task.title}</p>
                  <p className="text-sm text-gray-400">{task.tool}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent-green">+{task.xp} XP</p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < task.rating ? 'fill-current' : 'opacity-30'}`}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-purple" />
              Recommended Tasks
            </h3>
            <button
              onClick={onViewAllTasks}
              className="text-sm text-primary-cyan hover:text-primary-blue flex items-center gap-1"
            >
              Browse <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onTaskClick(task.id)}
                className="w-full p-4 bg-white/5 dark:bg-gray-800 rounded-xl flex items-center gap-4 hover:bg-white/10 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="p-2 bg-primary-purple/20 dark:bg-purple-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-primary-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white dark:text-white truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">{task.tool}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-purple">+{task.xp} XP</p>
                  <p className="text-xs text-gray-400">
                    Due {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Target className="w-6 h-6" />, label: 'Browse Tasks', color: 'bg-blue-500', action: onViewAllTasks },
          { icon: <Trophy className="w-6 h-6" />, label: 'Leaderboard', color: 'bg-yellow-500', action: onViewLeaderboard },
          { icon: <Gift className="w-6 h-6" />, label: 'Daily Rewards', color: 'bg-green-500', action: () => {} },
          { icon: <Users className="w-6 h-6" />, label: 'Invite Friends', color: 'bg-purple-500', action: () => {} },
        ].map((action, index) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className={`${action.color} text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow`}
          >
            {action.icon}
            <span className="font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default EnhancedDashboard;
