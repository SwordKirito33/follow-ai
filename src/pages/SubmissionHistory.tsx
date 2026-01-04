import { useEffect, useState } from 'react';
import { submissionService } from '@/services/submissionService';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FollowButton from '@/components/ui/follow-button';
import { CheckCircle, XCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import type { Database } from '@/types/database';

type SubmissionWithTask = Database['public']['Tables']['task_submissions']['Row'] & {
  tasks: Database['public']['Tables']['tasks']['Row'];
};

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-accent-gold/20 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    approved: 'bg-accent-green/20 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    flagged: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  };

  const icons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    flagged: AlertCircle,
  };

  const Icon = icons[status as keyof typeof icons] || Clock;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${styles[status as keyof typeof styles] || styles.pending}`}>
      <Icon size={14} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState<SubmissionWithTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

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
      navigate('/#/');
      return;
    }

    loadSubmissions();
  }, [user, isAuthenticated, isLoading]);

  async function loadSubmissions() {
    if (!user) return;

    try {
      const data = await submissionService.getUserSubmissions(user.id);
      setSubmissions(data as any);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 dark:text-gray-400 font-medium">Loading submission history...</p>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 relative">
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center py-20">
            <h1 className="text-4xl font-black gradient-text mb-4 tracking-tight">Submission History</h1>
            <p className="text-xl text-gray-400 dark:text-gray-400 font-medium mb-8">
              You haven't submitted any tasks yet.
            </p>
            <FollowButton
              to="/tasks"
              as="link"
              variant="primary"
              size="lg"
            >
              Browse Tasks
            </FollowButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black gradient-text mb-2 tracking-tight">Submission History</h1>
          <p className="text-lg text-gray-400 dark:text-gray-400 font-medium">
            View all your task submissions and their status
          </p>
        </div>
        
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div 
              key={submission.id} 
              className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white dark:text-white mb-2">
                    {(submission.tasks as any)?.title || 'Unknown Task'}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400">
                    Submitted {new Date(submission.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                
                <div className="text-right ml-4">
                  <StatusBadge status={submission.status} />
                  {submission.reward_xp_awarded > 0 && (
                    <div className="text-sm text-primary-cyan dark:text-blue-400 font-medium mt-2 flex items-center gap-1">
                      <span>+{submission.reward_xp_awarded} XP</span>
                    </div>
                  )}
                </div>
              </div>
              
              {submission.output_url && (
                <a 
                  href={submission.output_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-cyan dark:text-blue-400 hover:underline text-sm mt-2 inline-flex items-center gap-1"
                >
                  <ExternalLink size={14} />
                  View Output
                </a>
              )}
              
              {submission.experience_text && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-400 dark:text-gray-400 cursor-pointer hover:text-white dark:hover:text-gray-200 font-medium">
                    View your experience
                  </summary>
                  <p className="text-sm text-gray-300 dark:text-gray-300 mt-2 p-3 bg-slate-800/50/5 dark:bg-gray-800 rounded-lg">
                    {submission.experience_text}
                  </p>
                </details>
              )}

              {submission.ai_tools_used && submission.ai_tools_used.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 dark:text-gray-300 mb-1">AI Tools Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {submission.ai_tools_used.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary-blue/20 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

