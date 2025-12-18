import { supabase } from '@/lib/supabase';
import { profileService } from './profileService';
import type { Database } from '@/types/database';

type Task = Database['public']['Tables']['tasks']['Row'];

export const taskService = {
  async listTasks(filters?: {
    type?: 'xp_challenge' | 'bounty' | 'hire';
    category?: string;
    minLevel?: number;
    status?: 'draft' | 'active' | 'closed' | 'archived';
  }) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('priority', { ascending: false })
      .order('submission_count', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('task_type', filters.type);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.minLevel) {
      query = query.lte('min_level', filters.minLevel);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    } else {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getTask(taskId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        profiles!tasks_creator_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('id', taskId)
      .single();

    if (error) throw error;
    return data;
  },

  async canUserDoTask(userId: string, taskId: string): Promise<{
    can: boolean;
    reason?: string;
  }> {
    try {
      const task = await this.getTask(taskId);
      const profile = await profileService.getProfile(userId);

      if (profile.level < task.min_level) {
        return {
          can: false,
          reason: `Requires level ${task.min_level} (you are level ${profile.level})`,
        };
      }

      if (profile.profile_completion < task.min_profile_completion) {
        return {
          can: false,
          reason: `Requires ${task.min_profile_completion}% profile completion (you are at ${profile.profile_completion}%)`,
        };
      }

      const { data: existing } = await supabase
        .from('task_submissions')
        .select('id')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        return {
          can: false,
          reason: 'You have already submitted this task',
        };
      }

      return { can: true };
    } catch (error) {
      console.error('Failed to check eligibility:', error);
      return {
        can: false,
        reason: 'Failed to check eligibility',
      };
    }
  },
};

