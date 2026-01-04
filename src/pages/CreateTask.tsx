import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import TaskTypeSelector, { TaskType } from '@/components/TaskTypeSelector';
import TaskForm, { TaskFormData } from '@/components/TaskForm';
import TaskPreview from '@/components/TaskPreview';
import FollowButton from '@/components/ui/follow-button';
import { Wallet, Loader } from 'lucide-react';
import { validateTaskForm } from '@/lib/task-validation';
import { getLevelInfo } from '@/lib/level-calculation';
import type { Database } from '@/types/database';

type WalletRow = Database['public']['Tables']['wallets']['Row'];

const CreateTask: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [taskType, setTaskType] = useState<TaskType>('xp');
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    requirements: '',
    taskType: 'xp',
    xpReward: 100,
  });
  const [wallet, setWallet] = useState<WalletRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (user && !authLoading) {
      loadWallet();
    }
  }, [user, authLoading]);

  const loadWallet = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setWallet(data);
    } catch (err: any) {
      console.error('Failed to load wallet:', err);
      toast.error('Failed to load wallet', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: TaskType) => {
    setTaskType(type);
    setFormData({ ...formData, taskType: type });
    setErrors([]);
  };

  const handleFormChange = (data: TaskFormData) => {
    setFormData(data);
    setErrors([]);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Authentication required', 'Please log in to create tasks');
      return;
    }

    const totalXp = user.profile?.total_xp ?? 0;
    const userLevel = getLevelInfo(totalXp).level;
    const walletBalance = wallet?.balance ?? 0;

    const validation = validateTaskForm(formData, userLevel, walletBalance);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Validation failed', validation.errors.join(', '));
      return;
    }

    try {
      setSubmitting(true);
      setErrors([]);

      // Prepare task data
      const taskData: any = {
        creator_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        task_type: formData.taskType === 'xp' ? 'xp_challenge' : 'bounty',
        status: 'active',
        min_level: formData.taskType === 'paid' 
          ? (formData.paymentAmount && formData.paymentAmount < 50 ? 5 :
             formData.paymentAmount && formData.paymentAmount < 200 ? 10 : 15)
          : 1,
        min_profile_completion: 0,
        required_ai_tools: [],
        required_word_count: 0,
        required_language: 'auto',
        max_submissions_per_user: 1,
        max_approved_submissions: null,
        category: null,
        difficulty: 1,
        priority: 1,
        submission_count: 0,
        approved_count: 0,
      };

      if (formData.taskType === 'xp') {
        taskData.reward_xp = formData.xpReward;
        taskData.reward_amount_cents = 0;
        taskData.currency = 'USD';
      } else {
        taskData.reward_xp = 0;
        taskData.reward_amount_cents = Math.round((formData.paymentAmount || 0) * 100);
        taskData.currency = 'USD';
      }

      // Insert task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      if (taskError) throw taskError;

      toast.success('Task created!', 'Your task has been published successfully');
      navigate(`/tasks`);
    } catch (err: any) {
      console.error('Failed to create task:', err);
      setErrors([err.message || 'Failed to create task']);
      toast.error('Failed to create task', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to create tasks.
          </p>
        </div>
      </div>
    );
  }

  const totalXp = user.profile?.total_xp ?? 0;
  const userLevel = getLevelInfo(totalXp).level;
  const walletBalance = wallet?.balance ?? 0;

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight">
            Create Task
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Publish XP tasks or paid tasks for testers
          </p>
        </div>

        {/* Wallet Balance Info */}
        {taskType === 'xp' && (
          <div className="glass-card rounded-xl shadow-xl p-4 mb-8 bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3">
              <Wallet size={20} className="text-primary-cyan" />
              <div>
                <div className="text-sm font-semibold text-white">Wallet Balance</div>
                <div className="text-lg font-bold text-primary-cyan">
                  {walletBalance.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column: Form */}
          <div>
            <TaskTypeSelector
              selectedType={taskType}
              onTypeChange={handleTypeChange}
              userLevel={userLevel}
            />

            <TaskForm
              formData={formData}
              onChange={handleFormChange}
              errors={errors}
            />

            {/* Submit Button */}
            <div className="flex items-center gap-4">
              <FollowButton
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Publishing...
                  </>
                ) : (
                  'Publish Task'
                )}
              </FollowButton>
              <FollowButton
                onClick={() => navigate('/tasks')}
                variant="secondary"
                size="lg"
                disabled={submitting}
              >
                Cancel
              </FollowButton>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div>
            <TaskPreview formData={formData} userLevel={userLevel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

