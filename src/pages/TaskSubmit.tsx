import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
// Note: Using direct Supabase queries instead of submissionService for event-sourced XP
import { validateExperienceText, countCharacters } from '@/lib/validation';
import { MIN_EXPERIENCE_CHARS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { grantXp } from '@/lib/xp-service';
import FollowButton from '@/components/ui/follow-button';
import { UploadCloud, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

export default function TaskSubmit() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, refreshProfile, notifyXpAction } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<any>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [eligibilityReason, setEligibilityReason] = useState<string | null>(null);
  
  const [outputFile, setOutputFile] = useState<File | null>(null);
  const [outputText, setOutputText] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [experienceError, setExperienceError] = useState<string | null>(null);
  const [aiToolsUsed, setAiToolsUsed] = useState<string[]>([]);

  const charCount = countCharacters(experienceText);
  const validation = validateExperienceText(experienceText);

  // 🔥 CRITICAL: Wait for loading first
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // 🔥 CRITICAL: Wait for loading to complete
    if (isLoading) return;
    
    // ✅ Only check user after loading is done
    if (!isAuthenticated || !user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to submit a task.',
        variant: 'destructive',
      });
      navigate('/#/');
      return;
    }

    if (!taskId) {
      toast({
        title: 'Invalid Task',
        description: 'Task ID is missing.',
        variant: 'destructive',
      });
      navigate('/#/tasks');
      return;
    }

    loadTask();
    checkEligibility();
  }, [taskId, user, isAuthenticated, isLoading]);

  async function loadTask() {
    try {
      // Simple direct query - no joins needed
      const { data: taskData, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId!)
        .single();

      if (error) throw error;
      
      setTask(taskData);
    } catch (error: any) {
      console.error('Failed to load task:', error);
      navigate('/#/tasks');
    }
  }

  async function checkEligibility() {
    if (!user || !taskId) return;

    try {
      // Simplified eligibility check
      // For MVP: allow all users to submit
      setCanSubmit(true);
      setEligibilityReason(null);
    } catch (error) {
      console.error('Failed to check eligibility:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isAuthenticated || !user || !taskId || !task) {
      alert('Error: Missing required data');
      return;
    }

    if (!validation.valid) {
      setExperienceError(validation.message);
      alert(validation.message);
      return;
    }

    setLoading(true);

    try {
      console.log('Step 1: Inserting submission...');
      
      // Step 1: Insert submission (simplified)
      const { data: submission, error: subError } = await supabase
        .from('task_submissions')
        .insert({
          task_id: taskId,
          user_id: user.id,
          experience_text: experienceText,
          ai_tools_used: aiToolsUsed,
          output_text: outputText || null,
          status: 'pending',
          reward_xp_awarded: task.xp_reward
        } as any)
        .select()
        .single();
      
      if (subError || !submission) {
        console.error('Submission insert error:', subError);
        throw new Error(`Database error: ${subError?.message || 'Submission creation failed'}`);
      }
      
      console.log('Step 2: Submission created:', (submission as any).id);
      
      // Step 2: Get current profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level, total_xp')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch profile');
      }
      
      const profileData = profile as any;
      console.log('Step 3: Current XP:', profileData.total_xp);
      
      // Step 3: Award XP using event-sourced system
      const submissionId = (submission as any)?.id || taskId;
      
      try {
        // Get XP multiplier (A/B test temporarily disabled)
        const multiplier = 1.0;  // 暂时禁用A/B测试
        const finalXpReward = Math.round(task.xp_reward * multiplier);
        
        // Grant XP in database
        // ✅ 修改这里：把 refId 从 taskId 改成 submissionId
        await grantXp({
          userId: user.id,
          deltaXp: finalXpReward,
          source: 'task',
          refType: 'task_submission', // 建议把 refType 也改得更具体一点
          refId: submissionId,        // 🔥 关键修改：使用 submissionId
          note: `Completed task: ${task.title}`,
          metadata: { 
            task_id: taskId, 
            task_title: task.title, 
            submission_id: submissionId,
            base_reward: task.xp_reward,
            multiplier,
            final_reward: finalXpReward,
          },
        });

        // Optimistic UI update (instant feedback)
        notifyXpAction('task', finalXpReward, 'task_submission', submissionId, `Completed task: ${task.title}`);
        
        // Success!
        alert(`🎉 Success! You earned +${finalXpReward} XP!\n\nYour submission is pending review.`);
      } catch (xpError: any) {
        console.error('XP award failed:', xpError);
        // Don't throw - submission succeeded, XP is optional
        console.warn('Submission succeeded but XP award failed');
        alert(`✅ Submission successful! XP award failed: ${xpError.message}`);
      }

      // Navigate without page reload
      navigate('/#/tasks');
      
    } catch (error: any) {
      console.error('Submission failed:', error);
      alert(`Submission failed:\n${error.message}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-cyan" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/5 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-white dark:text-white tracking-tight mb-2">
            Submit Your Work
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-400 font-medium">
            Task: {task.title}
          </p>
        </div>

        {!canSubmit && eligibilityReason && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Cannot Submit</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{eligibilityReason}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block font-medium mb-2 text-gray-300 dark:text-gray-300">
              Output File (optional)
            </label>
            <input
              type="file"
              onChange={(e) => setOutputFile(e.target.files?.[0] || null)}
              className="border rounded p-2 w-full dark:bg-gray-800 dark:border-gray-700"
              accept="image/*,.pdf,.txt,.md"
              disabled={!canSubmit}
            />
            <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">
              Max 10MB. Images, PDFs, or text files only.
            </p>
          </div>

          {/* Text Output */}
          <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block font-medium mb-2 text-gray-300 dark:text-gray-300">
              Or Paste Text Output
            </label>
            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              className="border rounded p-2 w-full h-32 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Paste your generated content here..."
              disabled={!canSubmit}
            />
          </div>

          {/* Experience Text (CRITICAL) */}
          <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block font-medium mb-2 text-gray-300 dark:text-gray-300">
              Your Experience (Required - {MIN_EXPERIENCE_CHARS} characters minimum) *
            </label>
            <textarea
              value={experienceText}
              onChange={(e) => {
                setExperienceText(e.target.value);
                if (experienceError) {
                  setExperienceError(null);
                }
              }}
              onBlur={() => {
                const validation = validateExperienceText(experienceText);
                if (!validation.valid) {
                  setExperienceError(validation.message);
                }
              }}
              className={`border rounded p-2 w-full h-40 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                experienceError ? 'border-red-500' : ''
              }`}
              placeholder="Describe your experience completing this task. What tools did you use? What challenges did you face? What did you learn? This helps build trust and improves your reputation."
              required
              disabled={!canSubmit}
            />
            <div className="flex justify-between text-sm mt-1">
              <span className={charCount < MIN_EXPERIENCE_CHARS ? 'text-red-600 font-medium' : 'text-accent-green'}>
                {charCount} / {MIN_EXPERIENCE_CHARS} characters
              </span>
              {experienceError && (
                <span className="text-red-600">{experienceError}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
              ✅ Chinese, English, emoji, and mixed text are all supported.
              <br />
              ❌ Repetitive or meaningless text will be rejected.
            </p>
          </div>

          {/* AI Tools Used */}
          <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block font-medium mb-2 text-gray-300 dark:text-gray-300">
              AI Tools Used (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., ChatGPT, Claude, Midjourney"
              onChange={(e) => {
                const tools = e.target.value
                  .split(',')
                  .map(t => t.trim())
                  .filter(Boolean);
                setAiToolsUsed(tools);
              }}
              className="border rounded p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={!canSubmit}
            />
          </div>

          <FollowButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !validation.valid || !canSubmit}
            isLoading={loading}
            className="w-full"
          >
            {loading ? 'Submitting...' : 'Submit Work & Earn XP'}
          </FollowButton>
        </form>
      </div>
    </div>
  );
}

