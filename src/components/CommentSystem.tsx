import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Reply, MoreVertical, Flag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    levelName: string;
  };
  content: string;
  likes: number;
  replies?: Comment[];
  createdAt: string;
  isLiked?: boolean;
}

interface CommentSystemProps {
  reviewId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onLike: (commentId: string) => void;
}

const CommentSystem: React.FC<CommentSystemProps> = ({
  reviewId,
  comments,
  onAddComment,
  onLike,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showAllReplies, setShowAllReplies] = useState<Record<string, boolean>>({});

  const handleReply = (commentId: string) => {
    if (!isAuthenticated) {
      // Show login modal
      return;
    }
    setReplyingTo(commentId);
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const showReplies = showAllReplies[comment.id] ?? false;
    const maxDepth = 3; // Limit nesting depth

    return (
      <div className={`${depth > 0 ? 'ml-8 mt-4 border-l-2 border-white/10 dark:border-gray-700 pl-4' : ''}`}>
        <div className="flex gap-3">
          <img
            src={comment.user.avatar}
            alt={comment.user.name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white dark:text-white text-sm">
                {comment.user.name}
              </span>
              <Badge variant="info" size="sm">
                {comment.user.levelName}
              </Badge>
              <span className="text-xs text-gray-400 dark:text-gray-300">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-300 dark:text-gray-300 mb-2">
              {comment.content}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  comment.isLiked
                    ? 'text-primary-cyan dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-300 hover:text-white dark:hover:text-gray-200'
                }`}
              >
                <ThumbsUp size={14} fill={comment.isLiked ? 'currentColor' : 'none'} />
                {comment.likes}
              </button>
              {depth < maxDepth && (
                <button
                  onClick={() => handleReply(comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-300 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  <Reply size={14} />
                  Reply
                </button>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 text-sm border border-white/20 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-white dark:text-white"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSubmitReply(comment.id)}
                    variant="primary"
                    size="sm"
                    disabled={!replyContent.trim()}
                  >
                    Post Reply
                  </Button>
                  <Button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {hasReplies && (
              <div className="mt-3">
                {!showReplies && (
                  <button
                    onClick={() => setShowAllReplies({ ...showAllReplies, [comment.id]: true })}
                    className="text-xs text-primary-cyan dark:text-blue-400 hover:underline"
                  >
                    Show {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                  </button>
                )}
                {showReplies && comment.replies && (
                  <div className="space-y-3">
                    {comment.replies.map((reply) => (
                      <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                    ))}
                    <button
                      onClick={() => setShowAllReplies({ ...showAllReplies, [comment.id]: false })}
                      className="text-xs text-primary-cyan dark:text-blue-400 hover:underline"
                    >
                      Hide replies
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white dark:text-white tracking-tight">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <div className="glass-card rounded-xl p-4">
          <div className="flex gap-3">
            <img
              src={user?.avatar || 'https://picsum.photos/seed/user/40/40'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                placeholder="Add a comment..."
                className="w-full px-3 py-2 text-sm border border-white/20 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-white dark:text-white resize-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    // Submit on Cmd/Ctrl + Enter
                    const content = (e.target as HTMLTextAreaElement).value;
                    if (content.trim()) {
                      onAddComment(content);
                      (e.target as HTMLTextAreaElement).value = '';
                    }
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400 dark:text-gray-300">
                  Press Cmd/Ctrl + Enter to submit
                </span>
                <Button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    const content = textarea?.value || '';
                    if (content.trim()) {
                      onAddComment(content);
                      textarea.value = '';
                    }
                  }}
                  variant="primary"
                  size="sm"
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-3">
            Please log in to add a comment
          </p>
          <Button to="/login" as="link" variant="primary" size="sm">
            Log In
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-300">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSystem;

