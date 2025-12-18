import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { submissionService } from '@/services/submissionService';
import { taskService } from '@/services/taskService';
import { storageService } from '@/services/storageService';
import { validateExperienceText, countCharacters } from '@/lib/validation';
import { MIN_EXPERIENCE_CHARS } from '@/lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/toast';
import FollowButton from '../components/ui/follow-button';
import { UploadCloud, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

export default function TaskSubmit() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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

  useEffect(() => {
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
  }, [taskId, user, isAuthenticated]);

  async function loadTask() {
    try {
      const taskData = await taskService.getTask(taskId!);
      setTask(taskData);
    } catch (error: any) {
      console.error('Failed to load task:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load task details.',
        variant: 'destructive',
      });
      navigate('/#/tasks');
    }
  }

  async function checkEligibility() {
    if (!user || !taskId) return;

    try {
      const eligibility = await taskService.canUserDoTask(user.id, taskId);
      setCanSubmit(eligibility.can);
      setEligibilityReason(eligibility.reason || null);
      
      if (!eligibility.can && eligibility.reason) {
        toast({
          title: 'Cannot Submit',
          description: eligibility.reason,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to check eligibility:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isAuthenticated || !user || !taskId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit.',
        variant: 'destructive',
      });
      return;
    }

    if (!validation.valid) {
      setExperienceError(validation.message);
      toast({
        title: 'Validation Error',
        description: validation.message,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setExperienceError(null);

    try {
      let outputUrl: string | undefined;
      if (outputFile) {
        outputUrl = await storageService.uploadTaskOutput(user.id, outputFile);
      }

      const tools = aiToolsUsed
        .filter(t => t.trim())
        .map(t => t.trim());

      await submissionService.submitWork({
        taskId: taskId,
        userId: user.id,
        outputUrl,
        outputText: outputText || undefined,
        experienceText,
        aiToolsUsed: tools,
      });

      toast({
        title: 'Success!',
        description: 'Your submission has been received. XP has been awarded.',
        variant: 'default',
      });

      navigate('/#/history');
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Submit Your Work
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
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
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
              Output File (optional)
            </label>
            <input
              type="file"
              onChange={(e) => setOutputFile(e.target.files?.[0] || null)}
              className="border rounded p-2 w-full dark:bg-gray-800 dark:border-gray-700"
              accept="image/*,.pdf,.txt,.md"
              disabled={!canSubmit}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Max 10MB. Images, PDFs, or text files only.
            </p>
          </div>

          {/* Text Output */}
          <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
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
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
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
              <span className={charCount < MIN_EXPERIENCE_CHARS ? 'text-red-600 font-medium' : 'text-green-600'}>
                {charCount} / {MIN_EXPERIENCE_CHARS} characters
              </span>
              {experienceError && (
                <span className="text-red-600">{experienceError}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ✅ Chinese, English, emoji, and mixed text are all supported.
              <br />
              ❌ Repetitive or meaningless text will be rejected.
            </p>
          </div>

          {/* AI Tools Used */}
          <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
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

