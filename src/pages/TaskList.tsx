import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import TaskCard from '@/components/TaskCard';
import TaskDetailDialog from '@/components/TaskDetailDialog';
import TaskFiltersComponent from '@/components/TaskFilters';
import FollowButton from '@/components/ui/follow-button';
import { Plus, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TaskFilters, filterTasks, Task } from '@/lib/task-filters';
import { getLevelInfo } from '@/lib/level-calculation';
import type { Database } from '@/types/database';

type TaskRow = Database['public']['Tables']['tasks']['Row'];

const TaskList: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    type: 'all',
    level: 'all',
    status: 'all',
    sort: 'newest',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && user) {
      const totalXp = user.profile?.total_xp ?? 0;
      const userLevel = getLevelInfo(totalXp).level;
      const filtered = filterTasks(tasks as Task[], filters, userLevel);
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, filters, user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleView = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleApplySuccess = () => {
    loadTasks();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const totalXp = user?.profile?.total_xp ?? 0;
  const userLevel = getLevelInfo(totalXp).level;

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight">
                Available Tasks
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                Browse and apply to XP tasks and paid tasks
              </p>
            </div>
            {user && (
              <FollowButton
                onClick={() => navigate('/tasks/create')}
                variant="primary"
                size="lg"
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Create Task
              </FollowButton>
            )}
          </div>
        </div>

        {/* Filters */}
        {user && (
          <TaskFiltersComponent filters={filters} onFiltersChange={setFilters} />
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="glass-card rounded-xl shadow-xl p-12 text-center">
            <p className="text-lg text-gray-400 mb-2">No tasks found</p>
            <p className="text-sm text-gray-500">
              {tasks.length === 0
                ? 'No tasks available at the moment. Check back later!'
                : 'Try adjusting your filters to see more tasks.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task as Task}
                userLevel={userLevel}
                onApply={handleApply}
                onView={handleView}
              />
            ))}
          </div>
        )}

        {/* Task Detail Dialog */}
        {user && (
          <TaskDetailDialog
            taskId={selectedTaskId}
            isOpen={!!selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            userLevel={userLevel}
            userId={user.id}
            onApplySuccess={handleApplySuccess}
          />
        )}
      </div>
    </div>
  );
};

export default TaskList;

