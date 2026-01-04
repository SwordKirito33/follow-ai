import React, { useState, useEffect } from 'react';
import { X, Calendar, Zap, DollarSign, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from './ui/toast';
import FollowButton from './ui/follow-button';
import Badge from './ui/Badge';
import { formatCurrency } from '@/lib/currency';
import type { Database } from '@/types/database';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskDetailDialogProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  userLevel: number;
  userId: string;
  onApplySuccess?: () => void;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  taskId,
  isOpen,
  onClose,
  userLevel,
  userId,
  onApplySuccess,
}) => {
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      loadTask();
      checkApplication();
    }
  }, [isOpen, taskId, userId]);

  const loadTask = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      setTask(data);
    } catch (err: any) {
      console.error('Failed to load task:', err);
      toast.error('Failed to load task', err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkApplication = async () => {
    if (!taskId || !userId) return;

    try {
      const { data, error } = await supabase
        .from('task_applications')
        .select('id')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setHasApplied(!!data);
    } catch (err: any) {
      console.error('Failed to check application:', err);
    }
  };

  const handleApply = async () => {
    if (!taskId || !task) return;

    if (userLevel < task.min_level) {
      toast.error('Level requirement not met', `You need Level ${task.min_level} to apply`);
      return;
    }

    if (hasApplied) {
      toast.error('Already applied', 'You have already applied to this task');
      return;
    }

    try {
      setApplying(true);
      const { error } = await supabase
        .from('task_applications')
        .insert({
          task_id: taskId,
          user_id: userId,
          status: 'pending',
        });

      if (error) throw error;

      setHasApplied(true);
      toast.success('Application submitted!', 'Your application has been sent to the task creator');
      if (onApplySuccess) {
        onApplySuccess();
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to apply:', err);
      toast.error('Failed to apply', err.message);
    } finally {
      setApplying(false);
    }
  };

  if (!isOpen) return null;

  const isXpTask = task?.task_type === 'xp_challenge';
  const canApply = task && userLevel >= task.min_level && task.status === 'active' && !hasApplied;
  const reward = task && isXpTask
    ? `${task.reward_xp.toLocaleString()} XP`
    : task ? formatCurrency(task.reward_amount_cents / 100, task.currency) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight">Task Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading task...</p>
              </div>
            </div>
          ) : !task ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Task not found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {isXpTask ? (
                    <Badge variant="success" size="md">
                      <Zap size={14} className="mr-1" />
                      XP Task
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="md">
                      <DollarSign size={14} className="mr-1" />
                      Paid Task
                    </Badge>
                  )}
                  {task.status === 'active' && (
                    <Badge variant="secondary" size="md">Open</Badge>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{task.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={14} />
                  <span>Posted {new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
                <div className="text-gray-400 whitespace-pre-wrap bg-white/5 p-4 rounded-lg">
                  {task.description}
                </div>
              </div>

              {/* Requirements - Using description if no requirements field */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Task Details</h4>
                <div className="text-gray-400 whitespace-pre-wrap bg-white/5 p-4 rounded-lg">
                  {task.description}
                </div>
              </div>

              {/* Reward & Level */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-gray-400 mb-1">Reward</div>
                  <div className="text-2xl font-bold text-primary-cyan">{reward}</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-sm text-gray-400 mb-1">Min Level</div>
                  <div className="flex items-center gap-2">
                    {userLevel >= task.min_level ? (
                      <>
                        <CheckCircle size={20} className="text-accent-green" />
                        <span className="text-xl font-bold text-accent-green">Level {task.min_level}</span>
                      </>
                    ) : (
                      <>
                        <Lock size={20} className="text-red-600" />
                        <span className="text-xl font-bold text-red-600">Level {task.min_level}</span>
                      </>
                    )}
                  </div>
                  {userLevel < task.min_level && (
                    <div className="text-xs text-red-600 mt-1">
                      You need Level {task.min_level} to apply
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-4 border-t border-white/10">
                {hasApplied ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle size={20} className="text-accent-green mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-700">Application Submitted</p>
                    <p className="text-xs text-accent-green mt-1">Waiting for creator's response</p>
                  </div>
                ) : (
                  <FollowButton
                    onClick={handleApply}
                    variant="primary"
                    size="lg"
                    disabled={!canApply || applying}
                    className="w-full"
                  >
                    {applying ? 'Applying...' : canApply ? 'Apply to Task' : 'Cannot Apply'}
                  </FollowButton>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailDialog;

