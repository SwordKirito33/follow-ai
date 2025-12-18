import { supabase } from '@/lib/supabase';
import { validateExperienceText, detectLanguage } from '@/lib/validation';
import { xpService } from './xpService';
import { XP_SOURCES } from '@/lib/constants';
import type { Database } from '@/types/database';

type TaskSubmission = Database['public']['Tables']['task_submissions']['Row'];
type TaskSubmissionInsert = Database['public']['Tables']['task_submissions']['Insert'];

export const submissionService = {
  async submitWork(params: {
    taskId: string;
    userId: string;
    outputUrl?: string;
    outputText?: string;
    experienceText: string;
    aiToolsUsed: string[];
  }): Promise<TaskSubmission> {
    const { taskId, userId, outputUrl, outputText, experienceText, aiToolsUsed } = params;

    const validation = validateExperienceText(experienceText);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const language = detectLanguage(experienceText);
    const wordCount = experienceText.split(/\s+/).length;

    const submissionData: TaskSubmissionInsert = {
      task_id: taskId,
      user_id: userId,
      output_url: outputUrl || null,
      output_text: outputText || null,
      word_count: wordCount,
      ai_tools_used: aiToolsUsed,
      experience_text: experienceText,
      review_language: language,
      status: 'pending',
    };

    const { data: submission, error: submissionError } = await supabase
      .from('task_submissions')
      .insert(submissionData)
      .select()
      .single();

    if (submissionError) {
      if (submissionError.code === '23505') {
        throw new Error('You have already submitted this task');
      }
      throw submissionError;
    }

    const { data: task } = await supabase
      .from('tasks')
      .select('reward_xp, title')
      .eq('id', taskId)
      .single();

    if (task && task.reward_xp > 0) {
      await xpService.awardXp({
        userId,
        amount: task.reward_xp,
        reason: `Completed task: ${task.title}`,
        source: XP_SOURCES.TASK_SUBMISSION,
        sourceId: submission.id,
      });
    }

    return submission;
  },

  async getUserSubmissions(userId: string) {
    const { data, error } = await supabase
      .from('task_submissions')
      .select(`
        *,
        tasks (
          id,
          title,
          task_type,
          reward_xp
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getSubmission(submissionId: string) {
    const { data, error } = await supabase
      .from('task_submissions')
      .select(`
        *,
        tasks (*),
        profiles (
          id,
          username,
          avatar_url
        )
      `)
      .eq('id', submissionId)
      .single();

    if (error) throw error;
    return data;
  },

  async getTaskSubmissions(taskId: string) {
    const { data, error } = await supabase
      .from('task_submissions')
      .select(`
        *,
        profiles (
          id,
          username,
          avatar_url,
          level
        )
      `)
      .eq('task_id', taskId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  },
};

