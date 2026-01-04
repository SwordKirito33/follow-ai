import React, { useState } from 'react';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import FollowButton from './ui/follow-button';
import { useToast } from './ui/toast';

interface ReviewFormProps {
  submissionId: string;
  currentStatus: string;
  currentRating?: number | null;
  currentFeedback?: string | null;
  onSubmit: (action: 'approve' | 'reject', rating: number, feedback: string) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  submissionId,
  currentStatus,
  currentRating,
  currentFeedback,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rating, setRating] = useState<number>(currentRating || 5);
  const [feedback, setFeedback] = useState<string>(currentFeedback || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!action) {
      toast.error('Please select an action', 'Choose to approve or reject the submission');
      return;
    }

    if (action === 'approve' && rating < 1) {
      toast.error('Please provide a rating', 'Rating is required for approved submissions');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(action, rating, feedback);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setSubmitting(false);
    }
  };

  const isReviewed = currentStatus === 'approved' || currentStatus === 'rejected';

  return (
    <div className="glass-card rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-black text-white mb-6 tracking-tight">Review Submission</h2>

      {isReviewed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <CheckCircle size={24} className="text-accent-green mx-auto mb-2" />
          <p className="text-sm font-semibold text-green-700">
            This submission has been {currentStatus}
          </p>
          {currentRating && (
            <div className="mt-2">
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
          )}
          {currentFeedback && (
            <div className="mt-2 text-sm text-gray-400 bg-slate-800/50 rounded p-2">
              {currentFeedback}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Action</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAction('approve')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  action === 'approve'
                    ? 'bg-green-50 border-green-500 shadow-md'
                    : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} className={action === 'approve' ? 'text-accent-green' : 'text-gray-400'} />
                  <span className="font-semibold text-white">Approve</span>
                </div>
                <p className="text-xs text-gray-400">Accept this submission</p>
              </button>

              <button
                onClick={() => setAction('reject')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  action === 'reject'
                    ? 'bg-red-50 border-red-500 shadow-md'
                    : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={20} className={action === 'reject' ? 'text-red-600' : 'text-gray-400'} />
                  <span className="font-semibold text-white">Reject</span>
                </div>
                <p className="text-xs text-gray-400">Reject this submission</p>
              </button>
            </div>
          </div>

          {/* Rating (only for approval) */}
          {action === 'approve' && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-400">{rating}/5</span>
              </div>
            </div>
          )}

          {/* Feedback */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-semibold text-gray-300 mb-2">
              Feedback {action === 'approve' ? '(optional)' : ''}
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder={action === 'approve' ? 'Add feedback for the tester...' : 'Explain why this submission was rejected...'}
              className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <FollowButton
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            disabled={!action || submitting}
            className="w-full"
          >
            {submitting ? 'Submitting...' : action === 'approve' ? 'Approve Submission' : 'Reject Submission'}
          </FollowButton>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;

