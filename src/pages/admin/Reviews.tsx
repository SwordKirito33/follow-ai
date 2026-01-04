import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';
import FollowButton from '@/components/ui/follow-button';
import Badge from '@/components/ui/Badge';

interface RpcResponse {
  success: boolean;
  xp_added?: number;
  message?: string;
}

interface Submission {
  submission_id: string;
  submission_content: string | null;
  output_url: string | null;
  experience_text: string | null;
  ai_tools_used: string[] | null;
  submission_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  review_notes: string | null;
  reviewed_at: string | null;
  reward_xp_awarded: number | null;
  task_id: string;
  task_title: string;
  xp_reward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  acceptance_criteria: any;
  estimated_time?: number | null;
  tool_id: string;
  tool_name: string;
  tool_logo: string | null;
  tool_tagline: string | null;
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  user_current_xp: number | null;
  user_level: number | null;
}

const Reviews: React.FC = () => {
  const toast = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [processing, setProcessing] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [expandedCriteria, setExpandedCriteria] = useState<Record<string, boolean>>({});
  const [pendingTotal, setPendingTotal] = useState<number>(0);

  // Format relative time
  const formatRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Fetch pending count
  const fetchPendingCount = async () => {
    const { count, error } = await supabase
      .from('admin_submissions_view')
      .select('*', { count: 'exact', head: true })
      .eq('submission_status', 'pending');

    if (!error && count !== null) {
      setPendingTotal(count);
    }
  };

  // Fetch submissions
  const fetchSubmissions = async (statusFilter: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_submissions_view')
        .select('*')
        .eq('submission_status', statusFilter)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to load submissions', error.message);
        return;
      }

      setSubmissions(data || []);
      // Update count after fetching
      await fetchPendingCount();
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      toast.error('Failed to load submissions', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentTab);
  }, [currentTab]);

  // Handle approve
  const handleApprove = async (submissionId: string, notes: string) => {
    if (processing) return;

    setProcessing(submissionId);

    try {
      const { data, error } = await (supabase.rpc as unknown as (
        name: string,
        args: Record<string, any>
      ) => Promise<{ data: RpcResponse | null; error: any }>)('approve_submission', {
        submission_uuid: submissionId,
        notes: notes || null,
      });

      if (error) {
        throw error;
      }

      // Validate response structure
      const result = data as RpcResponse;

      if (!result || typeof result.success !== 'boolean') {
        throw new Error('Invalid RPC response');
      }

      if (result.success) {
        toast.success('Submission approved!', `Awarded ${result.xp_added || 0} XP`);
        // Clear notes for this submission
        setReviewNotes((prev) => {
          const updated = { ...prev };
          delete updated[submissionId];
          return updated;
        });
        await fetchSubmissions(currentTab);
      } else {
        toast.error('Approval failed', result.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Approval error:', err);
      toast.error('Approval failed', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setProcessing(null);
    }
  };

  // Handle reject
  const handleReject = async (submissionId: string, notes: string) => {
    if (processing) return;

    // Validate notes
    if (!notes || notes.trim() === '') {
      toast.error('Rejection reason required', 'Please provide review notes');
      return;
    }

    setProcessing(submissionId);

    try {
      const { data, error } = await (supabase.rpc as unknown as (
        name: string,
        args: Record<string, any>
      ) => Promise<{ data: RpcResponse | null; error: any }>)('reject_submission', {
        submission_uuid: submissionId,
        notes: notes,
      });

      if (error) {
        throw error;
      }

      // Validate response structure
      const result = data as RpcResponse;

      if (!result || typeof result.success !== 'boolean') {
        throw new Error('Invalid RPC response');
      }

      if (result.success) {
        toast.success('Submission rejected');
        // Clear notes for this submission
        setReviewNotes((prev) => {
          const updated = { ...prev };
          delete updated[submissionId];
          return updated;
        });
        await fetchSubmissions(currentTab);
      } else {
        toast.error('Rejection failed', result.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Rejection error:', err);
      toast.error('Rejection failed', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setProcessing(null);
    }
  };

  // Toggle criteria expansion
  const toggleCriteria = (submissionId: string) => {
    setExpandedCriteria((prev) => ({
      ...prev,
      [submissionId]: !prev[submissionId],
    }));
  };

  // Get difficulty badge variant
  const getDifficultyVariant = (difficulty: string): 'success' | 'warning' | 'danger' => {
    if (difficulty === 'beginner') return 'success';
    if (difficulty === 'intermediate') return 'warning';
    return 'danger';
  };

  // Parse acceptance criteria
  const parseAcceptanceCriteria = (criteria: any): string[] => {
    if (!criteria) return [];
    if (Array.isArray(criteria)) return criteria;
    if (typeof criteria === 'string') {
      try {
        const parsed = JSON.parse(criteria);
        return Array.isArray(parsed) ? parsed : [criteria];
      } catch {
        return [criteria];
      }
    }
    if (typeof criteria === 'object') {
      if (criteria.criteria && Array.isArray(criteria.criteria)) {
        return criteria.criteria;
      }
      return Object.values(criteria).filter((v): v is string => typeof v === 'string');
    }
    return [];
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/admin"
              className="text-primary-cyan hover:text-primary-blue font-medium flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4 tracking-tight">
            Submission Reviews
          </h1>
          <p className="text-xl text-gray-400 font-medium mb-4">
            Review and approve user task submissions
          </p>
          {pendingTotal > 0 && (
            <div className="inline-block glass-card rounded-xl px-4 py-2">
              <span className="text-lg font-bold text-primary-cyan">{pendingTotal}</span>
              <span className="text-gray-400 ml-2">pending reviews</span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'pending' as const, label: 'Pending', icon: Clock },
            { id: 'approved' as const, label: 'Approved', icon: CheckCircle },
            { id: 'rejected' as const, label: 'Rejected', icon: XCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white shadow-lg'
                    : 'glass-card text-gray-300 hover:glass-card'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Submissions Grid */}
        <div className="grid gap-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading submissions...</p>
              </div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Clock size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-400 mb-2">
                {currentTab === 'pending'
                  ? 'No pending reviews 🎉'
                  : `No submissions in this category`}
              </p>
            </div>
          ) : (
            submissions.map((submission, idx) => {
              const isProcessing = processing === submission.submission_id;
              const notes = reviewNotes[submission.submission_id] || '';
              const criteria = parseAcceptanceCriteria(submission.acceptance_criteria);
              const isExpanded = expandedCriteria[submission.submission_id] || false;

              return (
                <div
                  key={submission.submission_id}
                  className="glass-card rounded-xl p-6 card-3d hover:shadow-2xl transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Card Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={
                        submission.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.user_id}`
                      }
                      alt={submission.username || 'User'}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">
                          @{submission.username || 'unknown'}
                        </span>
                        <Badge variant="secondary" size="sm">
                          Level {submission.user_level ?? 1}
                        </Badge>
                        <span className="text-sm text-gray-400">submitted</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-200">{submission.task_title}</span>
                        <span className="text-gray-400">·</span>
                        <div className="flex items-center gap-2">
                          {submission.tool_logo && (
                            <img
                              src={submission.tool_logo}
                              alt={submission.tool_name}
                              className="w-6 h-6 rounded"
                            />
                          )}
                          <span className="text-sm text-gray-400">{submission.tool_name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={14} />
                        <span>{formatRelativeTime(submission.submitted_at)}</span>
                      </div>
                    </div>
                    {submission.submission_status !== 'pending' && (
                      <div>
                        {submission.submission_status === 'approved' ? (
                          <Badge variant="success" size="md">
                            <CheckCircle size={14} className="mr-1" />
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="danger" size="md">
                            <XCircle size={14} className="mr-1" />
                            Rejected
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="mb-6 space-y-4">
                    {/* Output Text */}
                    {submission.submission_content && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Output:</h4>
                        <div className="bg-gray-800/5 rounded-lg p-4 font-mono text-sm text-gray-200 whitespace-pre-wrap break-words">
                          {submission.submission_content}
                        </div>
                      </div>
                    )}

                    {/* Experience Text */}
                    {submission.experience_text && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Experience:</h4>
                        <p className="text-gray-300 italic border-l-4 border-blue-500 pl-4 py-2">
                          "{submission.experience_text}"
                        </p>
                      </div>
                    )}

                    {/* Project Link */}
                    {submission.output_url && (
                      <div>
                        <a
                          href={submission.output_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary-blue rounded-lg hover:bg-primary-blue/20 transition-colors"
                        >
                          <ExternalLink size={16} />
                          View Project
                        </a>
                      </div>
                    )}

                    {/* AI Tools Used */}
                    {submission.ai_tools_used && submission.ai_tools_used.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">AI Tools Used:</h4>
                        <div className="flex flex-wrap gap-2">
                          {submission.ai_tools_used.map((tool, i) => (
                            <Badge key={i} variant="secondary" size="sm">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Task Info */}
                  <div className="mb-6 p-4 bg-gray-800/5 rounded-lg">
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant={getDifficultyVariant(submission.difficulty)} size="sm">
                        {submission.difficulty.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 text-primary-cyan">
                        <Trophy size={16} />
                        <span className="font-semibold">{submission.xp_reward} XP</span>
                      </div>
                      {typeof submission.estimated_time === 'number' && (
                        <span className="text-sm text-gray-400">
                          {submission.estimated_time} minutes
                        </span>
                      )}
                    </div>

                    {/* Acceptance Criteria */}
                    {criteria.length > 0 && (
                      <div className="mt-4">
                        <button
                          onClick={() => toggleCriteria(submission.submission_id)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                          Acceptance Criteria
                        </button>
                        {isExpanded && (
                          <div className="mt-2 p-3 bg-slate-800/50 rounded border border-white/10">
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                              {criteria.map((criterion, i) => (
                                <li key={i}>{criterion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions (Pending Tab) */}
                  {submission.submission_status === 'pending' && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Review Notes{' '}
                          <span className="text-gray-400 font-normal">
                            (optional for approve, required for reject)
                          </span>
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) =>
                            setReviewNotes((prev) => ({
                              ...prev,
                              [submission.submission_id]: e.target.value,
                            }))
                          }
                          placeholder="Add your review notes here..."
                          className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          disabled={isProcessing}
                        />
                      </div>
                      <div className="flex gap-4">
                        <FollowButton
                          onClick={() => handleApprove(submission.submission_id, notes)}
                          variant="primary"
                          size="md"
                          icon={CheckCircle}
                          iconPosition="left"
                          disabled={isProcessing}
                          isLoading={isProcessing}
                          className="flex-1"
                        >
                          Approve
                        </FollowButton>
                        <FollowButton
                          onClick={() => handleReject(submission.submission_id, notes)}
                          variant="secondary"
                          size="md"
                          icon={XCircle}
                          iconPosition="left"
                          disabled={isProcessing}
                          isLoading={isProcessing}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white border-transparent"
                        >
                          Reject
                        </FollowButton>
                      </div>
                    </div>
                  )}

                  {/* Review History (Approved/Rejected) */}
                  {submission.submission_status !== 'pending' && (
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      {submission.review_notes && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-1">Review Notes:</h4>
                          <p className="text-sm text-gray-400 bg-gray-800/5 rounded p-3">
                            {submission.review_notes}
                          </p>
                        </div>
                      )}
                      {submission.reviewed_at && (
                        <p className="text-xs text-gray-400">
                          Reviewed {formatRelativeTime(submission.reviewed_at)}
                        </p>
                      )}
                      {submission.submission_status === 'approved' &&
                        submission.reward_xp_awarded !== null && (
                          <div className="flex items-center gap-2 text-accent-green font-semibold">
                            <Trophy size={16} />
                            <span>XP Awarded: {submission.reward_xp_awarded}</span>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

