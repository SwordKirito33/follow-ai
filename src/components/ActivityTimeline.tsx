import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Trophy, 
  CreditCard, 
  Star, 
  CheckCircle, 
  Gift, 
  TrendingUp,
  Award,
  Target,
  Clock
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'xp_earned' | 'level_up' | 'purchase' | 'achievement' | 'task_completed' | 'reward' | 'milestone';
  title: string;
  description?: string;
  timestamp: string;
  metadata?: {
    xp?: number;
    level?: number;
    amount?: number;
    currency?: string;
    badge?: string;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
  maxItems?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  maxItems = 10,
  showLoadMore = false,
  onLoadMore,
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'xp_earned':
        return <Zap className="w-4 h-4" />;
      case 'level_up':
        return <TrendingUp className="w-4 h-4" />;
      case 'purchase':
        return <CreditCard className="w-4 h-4" />;
      case 'achievement':
        return <Award className="w-4 h-4" />;
      case 'task_completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'reward':
        return <Gift className="w-4 h-4" />;
      case 'milestone':
        return <Target className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'xp_earned':
        return 'bg-blue-500 text-white';
      case 'level_up':
        return 'bg-purple-500 text-white';
      case 'purchase':
        return 'bg-green-500 text-white';
      case 'achievement':
        return 'bg-yellow-500 text-white';
      case 'task_completed':
        return 'bg-emerald-500 text-white';
      case 'reward':
        return 'bg-pink-500 text-white';
      case 'milestone':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-white/50 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const displayedActivities = activities.slice(0, maxItems);

  if (!activities.length) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-300 dark:text-gray-400 mx-auto mb-3" />
        <p className="text-gray-400 dark:text-gray-300">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {displayedActivities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          {/* Timeline line */}
          {index < displayedActivities.length - 1 && (
            <div className="absolute left-[17px] top-10 bottom-0 w-0.5 bg-white/10 dark:bg-gray-700" />
          )}

          {/* Icon */}
          <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white dark:text-white">
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="text-sm text-gray-400 dark:text-gray-300 mt-0.5">
                    {activity.description}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-400 whitespace-nowrap">
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>

            {/* Metadata */}
            {activity.metadata && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activity.metadata.xp && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-blue/20 dark:bg-blue-900/30 text-primary-blue dark:text-blue-400 text-xs font-medium rounded-full">
                    <Zap className="w-3 h-3" />
                    +{activity.metadata.xp} XP
                  </span>
                )}
                {activity.metadata.level && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-purple/20 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full">
                    <Trophy className="w-3 h-3" />
                    Level {activity.metadata.level}
                  </span>
                )}
                {activity.metadata.amount && activity.metadata.currency && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-green/20 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    <CreditCard className="w-3 h-3" />
                    {activity.metadata.currency}{activity.metadata.amount}
                  </span>
                )}
                {activity.metadata.badge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-gold/20 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                    <Award className="w-3 h-3" />
                    {activity.metadata.badge}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {showLoadMore && activities.length > maxItems && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onLoadMore}
          className="w-full py-3 text-sm font-medium text-primary-cyan dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          Load more activity
        </motion.button>
      )}
    </div>
  );
};

export default ActivityTimeline;
