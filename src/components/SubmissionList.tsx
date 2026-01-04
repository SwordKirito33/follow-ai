import React from 'react';
import { Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import Badge from './ui/Badge';
import type { Database } from '@/types/database';

type Submission = Database['public']['Tables']['task_submissions']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

interface SubmissionListProps {
  submissions: (Submission & { tasks?: Task; profiles?: { username: string | null; full_name: string | null } })[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const SubmissionList: React.FC<SubmissionListProps> = ({ submissions, selectedId, onSelect }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-accent-green" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-accent-gold" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-accent-green/20 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-accent-gold/20 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="glass-card rounded-xl shadow-xl p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-black text-white mb-4 tracking-tight">Submissions</h2>
      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <button
              key={submission.id}
              onClick={() => onSelect(submission.id)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedId === submission.id
                  ? 'bg-blue-50 border-blue-500 shadow-md'
                  : 'bg-white border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1 line-clamp-1">
                    {submission.tasks?.title || 'Unknown Task'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <User size={14} />
                    <span>
                      {submission.profiles?.username || submission.profiles?.full_name || 'Unknown User'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded border ${getStatusColor(submission.status)}`}
                  >
                    {submission.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                <span>{new Date(submission.created_at).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionList;

