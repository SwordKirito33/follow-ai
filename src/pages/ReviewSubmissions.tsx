import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import SubmissionList from '@/components/SubmissionList';
import SubmissionDetail from '@/components/SubmissionDetail';
import ReviewForm from '@/components/ReviewForm';
import { Loader } from 'lucide-react';
import type { Database } from '@/types/database';

type Submission = Database['public']['Tables']['task_submissions']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface SubmissionWithRelations extends Submission {
  tasks?: Task;
  profiles?: Profile;
}

const ReviewSubmissions: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<SubmissionWithRelations[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      loadSubmissions();
    }
  }, [user, authLoading]);

  const loadSubmissions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get all tasks created by this user
      const { data: myTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id')
        .eq('creator_id', user.id);

      if (tasksError) throw tasksError;
      if (!myTasks || myTasks.length === 0) {
        setSubmissions([]);
        return;
      }

      const taskIds = myTasks.map(t => t.id);

      // Get submissions for these tasks
      const { data: subs, error: subsError } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks (*),
          profiles:user_id (username, full_name, avatar_url)
        `)
        .in('task_id', taskIds)
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;

      // Transform the data to match our interface
      const transformed = (subs || []).map((sub: any) => ({
        ...sub,
        tasks: sub.tasks,
        profiles: sub.profiles,
      }));

      setSubmissions(transformed);

      // Auto-select first submission if available
      if (transformed.length > 0 && !selectedId) {
        setSelectedId(transformed[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load submissions:', err);
      setError(err.message || 'Failed to load submissions');
      toast.error('Failed to load submissions', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action: 'approve' | 'reject', rating: number, feedback: string) => {
    if (!selectedId) return;

    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      
      const updateData: any = {
        status,
        quality_score_manual: action === 'approve' ? rating : null,
      };

      // Note: We don't have a feedback field in task_submissions, so we'll skip it
      // In a real implementation, you might want to add a feedback field or use a separate table

      const { error: updateError } = await supabase
        .from('task_submissions')
        .update(updateData)
        .eq('id', selectedId);

      if (updateError) throw updateError;

      toast.success(
        `Submission ${action === 'approve' ? 'approved' : 'rejected'}`,
        action === 'approve' 
          ? 'XP will be automatically awarded to the tester'
          : 'Submission has been rejected'
      );

      // Reload submissions
      await loadSubmissions();
    } catch (err: any) {
      console.error('Failed to review submission:', err);
      toast.error('Failed to review submission', err.message);
      throw err;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading submissions...</p>
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
            You need to be logged in to review submissions.
          </p>
        </div>
      </div>
    );
  }

  const selectedSubmission = submissions.find(s => s.id === selectedId);

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight">
            Review Submissions
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Review and approve task submissions from testers
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Left: Submission List */}
          <div>
            <SubmissionList
              submissions={submissions}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Right: Submission Detail & Review */}
          <div className="space-y-6">
            {selectedSubmission ? (
              <>
                <SubmissionDetail submission={selectedSubmission} />
                <ReviewForm
                  submissionId={selectedSubmission.id}
                  currentStatus={selectedSubmission.status}
                  currentRating={selectedSubmission.quality_score_manual}
                  currentFeedback={null}
                  onSubmit={handleReview}
                />
              </>
            ) : (
              <div className="glass-card rounded-xl shadow-xl p-12 text-center">
                <p className="text-gray-500">Select a submission to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmissions;

