import React from 'react';
import { Calendar, Zap, DollarSign, Lock } from 'lucide-react';
import Badge from './ui/Badge';
import FollowButton from './ui/follow-button';
import { Task } from '@/lib/task-filters';
import { formatCurrency } from '@/lib/currency';

interface TaskCardProps {
  task: Task;
  userLevel: number;
  onApply: (taskId: string) => void;
  onView: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, userLevel, onApply, onView }) => {
  const isXpTask = task.task_type === 'xp_challenge';
  const canApply = userLevel >= task.min_level && task.status === 'active';
  const reward = isXpTask 
    ? `${task.reward_xp.toLocaleString()} XP`
    : formatCurrency(task.reward_amount_cents / 100, task.currency);

  return (
    <div className="glass-card rounded-xl shadow-lg hover:shadow-xl transition-all p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isXpTask ? (
              <Badge variant="success" size="sm">
                <Zap size={12} className="mr-1" />
                XP Task
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                <DollarSign size={12} className="mr-1" />
                Paid Task
              </Badge>
            )}
            {task.status === 'active' && (
              <Badge variant="secondary" size="sm">Open</Badge>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {task.description}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Reward */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Reward</span>
          <span className="text-lg font-bold text-primary-cyan">{reward}</span>
        </div>

        {/* Level Requirement */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Min Level</span>
          <div className="flex items-center gap-2">
            {userLevel >= task.min_level ? (
              <span className="text-sm font-semibold text-accent-green">Level {task.min_level}</span>
            ) : (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <Lock size={14} />
                <span>Level {task.min_level}</span>
              </div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar size={12} />
          <span>{new Date(task.created_at).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
          <FollowButton
            onClick={() => onView(task.id)}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            View Details
          </FollowButton>
          {canApply ? (
            <FollowButton
              onClick={() => onApply(task.id)}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              Apply
            </FollowButton>
          ) : (
            <FollowButton
              variant="secondary"
              size="sm"
              className="flex-1"
              disabled
            >
              {userLevel < task.min_level ? 'Level Required' : 'Closed'}
            </FollowButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

