import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Target,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

interface StatData {
  label: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

interface AnalyticsDashboardProps {
  stats: StatData[];
  xpChartData: ChartData;
  taskChartData: ChartData;
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  stats,
  xpChartData,
  taskChartData,
  className = '',
}) => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Time range selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Analytics Dashboard
        </h2>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as typeof timeRange)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white'
                  : 'bg-gray-800/10 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-gray-800/10 dark:hover:bg-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 dark:text-gray-300 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white dark:text-white">
                  {typeof stat.value === 'number'
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              {stat.changeType === 'increase' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : stat.changeType === 'decrease' ? (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              ) : null}
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'increase'
                    ? 'text-accent-green'
                    : stat.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-400'
                }`}
              >
                {stat.change > 0 ? '+' : ''}
                {stat.change}%
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-300">
                vs last period
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Chart */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 dark:border-gray-700">
          <h3 className="text-lg font-bold text-white dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            XP Earned Over Time
          </h3>
          <SimpleLineChart data={xpChartData} height={250} />
        </div>

        {/* Tasks Chart */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 dark:border-gray-700">
          <h3 className="text-lg font-bold text-white dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Tasks Completed
          </h3>
          <SimpleBarChart data={taskChartData} height={250} />
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 dark:border-gray-700">
        <h3 className="text-lg font-bold text-white dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          Recent Activity
        </h3>
        <ActivityFeed />
      </div>
    </div>
  );
};

// Simple line chart component (CSS-based)
const SimpleLineChart: React.FC<{ data: ChartData; height: number }> = ({
  data,
  height,
}) => {
  const maxValue = Math.max(...data.datasets[0].data);
  const points = data.datasets[0].data.map((value, index) => ({
    x: (index / (data.labels.length - 1)) * 100,
    y: 100 - (value / maxValue) * 100,
  }));

  const pathD = points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )
    .join(' ');

  return (
    <div style={{ height }} className="relative">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        ))}

        {/* Area fill */}
        <path
          d={`${pathD} L 100 100 L 0 100 Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="1.5"
            fill="#3b82f6"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 dark:text-gray-300">
        {data.labels.filter((_, i) => i % Math.ceil(data.labels.length / 5) === 0).map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  );
};

// Simple bar chart component
const SimpleBarChart: React.FC<{ data: ChartData; height: number }> = ({
  data,
  height,
}) => {
  const maxValue = Math.max(...data.datasets[0].data);

  return (
    <div style={{ height }} className="flex items-end gap-2">
      {data.datasets[0].data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-h-[4px]"
          />
          <span className="text-xs text-gray-400 dark:text-gray-300 mt-2 truncate w-full text-center">
            {data.labels[index]}
          </span>
        </div>
      ))}
    </div>
  );
};

// Activity feed component
const ActivityFeed: React.FC = () => {
  const activities = [
    {
      type: 'task',
      message: 'Completed "ChatGPT Review" task',
      xp: 150,
      time: '2 hours ago',
    },
    {
      type: 'level',
      message: 'Reached Level 5!',
      xp: 0,
      time: '5 hours ago',
    },
    {
      type: 'achievement',
      message: 'Unlocked "First Steps" achievement',
      xp: 50,
      time: '1 day ago',
    },
    {
      type: 'purchase',
      message: 'Purchased 1,000 XP package',
      xp: 1000,
      time: '2 days ago',
    },
    {
      type: 'streak',
      message: '7-day check-in streak!',
      xp: 100,
      time: '3 days ago',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Target className="w-4 h-4" />;
      case 'level':
        return <TrendingUp className="w-4 h-4" />;
      case 'achievement':
        return <Zap className="w-4 h-4" />;
      case 'purchase':
        return <DollarSign className="w-4 h-4" />;
      case 'streak':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-primary-blue/20 dark:bg-blue-900/30 text-primary-cyan';
      case 'level':
        return 'bg-primary-purple/20 dark:bg-purple-900/30 text-primary-purple';
      case 'achievement':
        return 'bg-accent-gold/20 dark:bg-yellow-900/30 text-accent-gold';
      case 'purchase':
        return 'bg-accent-green/20 dark:bg-green-900/30 text-accent-green';
      case 'streak':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600';
      default:
        return 'bg-gray-800/10 dark:bg-gray-800 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4"
        >
          <div className={`p-2 rounded-xl ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="text-white dark:text-white font-medium">
              {activity.message}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-300">
              {activity.time}
            </p>
          </div>
          {activity.xp > 0 && (
            <span className="text-accent-green font-semibold">
              +{activity.xp} XP
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsDashboard;
