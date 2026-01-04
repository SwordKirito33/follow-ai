import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Filter, Briefcase, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import FollowButton from '@/components/ui/follow-button';
import Badge from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';
import { getLevelInfo } from '@/lib/level-calculation';

// Simple task interface matching our actual DB schema
interface Task {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xp_reward: number;
  description: string;
  status: string;
  created_at: string;
}

const Tasks: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from Supabase
  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching tasks from Supabase...');

        // 1. 获取所有激活任务
        const { data: allTasks, error: fetchError } = await supabase
          .from('tasks')
          .select('*')
          .eq('status', 'active')
          .order('xp_reward', { ascending: true });

        if (fetchError) {
          console.error('Error fetching tasks:', fetchError);
          setError(fetchError.message);
          return;
        }

        // 2. 获取当前用户已完成的任务 ID
        let completedIds = new Set<string>();
        if (user) {
          const { data: subs } = await supabase
            .from('task_submissions')
            .select('task_id')
            .eq('user_id', user.id);
          
          if (subs) {
            subs.forEach((s: { task_id: string }) => completedIds.add(s.task_id));
          }
        }

        // 3. 过滤：只显示未完成的任务
        const availableTasks = (allTasks || []).filter(t => !completedIds.has(t.id));
        
        console.log('Tasks loaded:', availableTasks);
        setTasks(availableTasks);
      } catch (err) {
        console.error('Failed to load tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [user]);

  // Calculate user stats using unified algorithm
  const userXp = user?.profile?.total_xp ?? 0;
  const levelInfo = getLevelInfo(userXp);

  // Filter tasks by difficulty
  const filteredTasks = useMemo(() => {
    if (selectedDifficulty === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.difficulty === selectedDifficulty);
  }, [tasks, selectedDifficulty]);

  const handleStartTask = (task: Task) => {
    navigate(`/task/${task.id}/submit`);
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Show login prompt for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-3xl font-black gradient-text mb-4">{t('tasksPage.pleaseLogin')}</h2>
          <p className="text-gray-400 mb-6">
            {t('tasksPage.loginRequired')}
          </p>
          <FollowButton
            to="/"
            as="link"
            variant="primary"
            size="lg"
          >
            {t('tasksPage.goHome')}
          </FollowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4 tracking-tight">
            {t('tasksPage.title')}
          </h1>
          <p className="text-xl text-gray-300 font-medium mb-4">
            {t('tasksPage.subtitle')}
          </p>
          
          {/* User Progress Banner */}
          {user && (
            <div className="glass-card rounded-xl p-4 mb-4 inline-block">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">{t('xp.level')} {levelInfo.level}</div>
                  <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-blue to-primary-purple transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(levelInfo.progress * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{levelInfo.xpToNext} {t('tasksPage.xpToNextLevel')}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">XP</div>
                  <div className="text-lg font-bold text-primary-cyan">{userXp}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'all', labelKey: 'tasksPage.allTasks' },
            { id: 'beginner', labelKey: 'tasksPage.beginner' },
            { id: 'intermediate', labelKey: 'tasksPage.intermediate' },
            { id: 'advanced', labelKey: 'tasksPage.advanced' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDifficulty(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedDifficulty === tab.id
                  ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white shadow-lg shadow-primary-cyan/50'
                  : 'glass-card text-gray-300 hover:border-primary-cyan/50'
              }`}
            >
              <Filter size={18} />
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 glass-card border-red-400/50 rounded-lg">
            <p className="text-red-400">{t('common.error')}: {error}</p>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid gap-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">{t('tasksPage.loadingTasks')}</p>
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Briefcase size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-300 mb-2">{t('tasksPage.noTasks')}</p>
              <p className="text-sm text-gray-400">
                {selectedDifficulty === 'all' 
                  ? t('tasksPage.noTasksAvailable')
                  : t('tasksPage.tryDifferentDifficulty')}
              </p>
            </div>
          ) : (
            filteredTasks.map((task, idx) => {
              return (
                <div
                  key={task.id}
                  className="glass-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 card-3d transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        variant={
                          task.difficulty === 'beginner' ? 'success' :
                          task.difficulty === 'intermediate' ? 'warning' : 'error'
                        } 
                        size="sm"
                      >
                        {t(`tasksPage.${task.difficulty}`).toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
                    <p className="text-gray-400 mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-primary-cyan font-semibold">
                        <Zap size={16} />
                        +{task.xp_reward} XP
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{t('tasksPage.reward')}</p>
                      <p className="text-2xl font-bold text-primary-cyan">+{task.xp_reward} XP</p>
                    </div>
                    <FollowButton
                      onClick={() => handleStartTask(task)}
                      variant="primary"
                      size="md"
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      {t('tasksPage.start')}
                    </FollowButton>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
