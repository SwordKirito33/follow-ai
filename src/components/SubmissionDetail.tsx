import React from 'react';
import { ExternalLink, FileText, Calendar, User } from 'lucide-react';
import type { Database } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';

type Submission = Database['public']['Tables']['task_submissions']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

interface SubmissionDetailProps {
  submission: Submission & { tasks?: Task; profiles?: { username: string | null; full_name: string | null; avatar_url: string | null } };
}

const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ submission }) => {
  const { t } = useLanguage();
  return (
    <div className="glass-card rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-black text-white mb-6 tracking-tight">Submission Details</h2>

      <div className="space-y-6">
        {/* Task Info */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Task Information</h3>
          <div className="bg-gray-800/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">{submission.tasks?.title || 'Unknown Task'}</h4>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">
              {submission.tasks?.description || 'No description'}
            </p>
          </div>
        </div>

        {/* Submitter Info */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Submitted By</h3>
          <div className="flex items-center gap-3 bg-gray-800/5 rounded-lg p-4">
            {submission.profiles?.avatar_url && (
              <img
                src={submission.profiles.avatar_url}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <div className="font-semibold text-white">
                {submission.profiles?.username || submission.profiles?.full_name || 'Unknown User'}
              </div>
              <div className="text-sm text-gray-400">
                Submitted {new Date(submission.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Submission Content */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Submission Content</h3>
          {submission.output_url ? (
            <div className="bg-gray-800/5 rounded-lg p-4">
              <a
                href={submission.output_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-cyan hover:text-primary-blue font-semibold"
              >
                <ExternalLink size={16} />
                <span>View Submission</span>
              </a>
            </div>
          ) : submission.output_text ? (
            <div className="bg-gray-800/5 rounded-lg p-4">
              <div className="text-gray-300 whitespace-pre-wrap">{submission.output_text}</div>
            </div>
          ) : (
            <div className="bg-gray-800/5 rounded-lg p-4 text-gray-400">
              No submission content
            </div>
          )}
        </div>

        {/* Experience Text */}
        {submission.experience_text && (
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Experience Notes</h3>
            <div className="bg-gray-800/5 rounded-lg p-4">
              <div className="text-gray-300 whitespace-pre-wrap">{submission.experience_text}</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-400 mb-1">Word Count</div>
            <div className="text-xl font-bold text-primary-cyan">{submission.word_count}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-gray-400 mb-1">AI Tools Used</div>
            <div className="text-xl font-bold text-primary-purple">
              {submission.ai_tools_used?.length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;

