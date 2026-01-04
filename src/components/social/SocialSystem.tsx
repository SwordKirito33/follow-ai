import React, { useState } from 'react';

// =====================================================
// 社交系统组件
// 任务: 161-180 社交相关任务
// =====================================================

// =====================================================
// 用户卡片组件
// =====================================================

interface UserCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    level: number;
    xp: number;
    bio?: string;
    isFollowing?: boolean;
    isVerified?: boolean;
    badges?: Array<{ id: string; name: string; icon: string }>;
  };
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  onMessage?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onFollow,
  onUnfollow,
  onMessage,
  onViewProfile
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow?.(user.id);
        setIsFollowing(false);
      } else {
        await onFollow?.(user.id);
        setIsFollowing(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* 头像 */}
        <div 
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xl font-bold cursor-pointer"
          onClick={() => onViewProfile?.(user.id)}
        >
          {user.avatar ? (
            <img loading="lazy" src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* 用户信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 
              className="font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
              onClick={() => onViewProfile?.(user.id)}
            >
              {user.name}
            </h4>
            {user.isVerified && (
              <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          
          {/* 等级和 XP */}
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
              Lv.{user.level}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.xp.toLocaleString()} XP
            </span>
          </div>

          {/* 徽章 */}
          {user.badges && user.badges.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {user.badges.slice(0, 3).map(badge => (
                <span key={badge.id} className="text-lg" title={badge.name}>
                  {badge.icon}
                </span>
              ))}
              {user.badges.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{user.badges.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 简介 */}
          {user.bio && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleFollowToggle}
          disabled={isLoading}
          className={`
            flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors
            ${isFollowing
              ? 'border border-border text-foreground hover:bg-muted'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
          `}
        >
          {isLoading ? '...' : isFollowing ? '已关注' : '关注'}
        </button>
        {onMessage && (
          <button
            onClick={() => onMessage(user.id)}
            className="py-2 px-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// =====================================================
// 关注列表组件
// =====================================================

interface FollowListProps {
  type: 'followers' | 'following';
  users: Array<{
    id: string;
    name: string;
    username: string;
    avatar?: string;
    level: number;
    isFollowing?: boolean;
  }>;
  onFollow: (userId: string) => Promise<void>;
  onUnfollow: (userId: string) => Promise<void>;
  onViewProfile: (userId: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const FollowList: React.FC<FollowListProps> = ({
  type,
  users,
  onFollow,
  onUnfollow,
  onViewProfile,
  isLoading,
  hasMore,
  onLoadMore
}) => {
  if (users.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-muted-foreground">
          {type === 'followers' ? '暂无粉丝' : '暂未关注任何人'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map(user => (
        <FollowListItem
          key={user.id}
          user={user}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
          onViewProfile={onViewProfile}
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {hasMore && !isLoading && (
        <button
          onClick={onLoadMore}
          className="w-full py-3 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          加载更多
        </button>
      )}
    </div>
  );
};

const FollowListItem: React.FC<{
  user: FollowListProps['users'][0];
  onFollow: (userId: string) => Promise<void>;
  onUnfollow: (userId: string) => Promise<void>;
  onViewProfile: (userId: string) => void;
}> = ({ user, onFollow, onUnfollow, onViewProfile }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow(user.id);
        setIsFollowing(false);
      } else {
        await onFollow(user.id);
        setIsFollowing(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onViewProfile(user.id)}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
          {user.avatar ? (
            <img loading="lazy" src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-medium text-foreground hover:text-primary transition-colors">
            {user.name}
          </p>
          <p className="text-sm text-muted-foreground">
            @{user.username} · Lv.{user.level}
          </p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          py-1.5 px-4 rounded-full text-sm font-medium transition-colors
          ${isFollowing
            ? 'border border-border text-foreground hover:bg-muted'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }
        `}
      >
        {isLoading ? '...' : isFollowing ? '已关注' : '关注'}
      </button>
    </div>
  );
};

// =====================================================
// 评论系统组件
// =====================================================

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSystemProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  currentUserId?: string;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({
  comments,
  onAddComment,
  onLike,
  onDelete,
  currentUserId
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim(), replyTo || undefined);
      setNewComment('');
      setReplyTo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 评论输入 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder={replyTo ? '写下你的回复...' : '写下你的评论...'}
          rows={3}
          className="w-full p-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex items-center justify-between">
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              取消回复
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className={`
              ml-auto py-2 px-4 rounded-lg font-medium transition-colors
              ${isSubmitting || !newComment.trim()
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }
            `}
          >
            {isSubmitting ? '发送中...' : '发送'}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无评论，来发表第一条评论吧
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={onLike}
              onDelete={onDelete}
              onReply={() => setReplyTo(comment.id)}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
};

const CommentItem: React.FC<{
  comment: Comment;
  onLike: (commentId: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onReply: () => void;
  currentUserId?: string;
  isReply?: boolean;
}> = ({ comment, onLike, onDelete, onReply, currentUserId, isReply }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = async () => {
    await onLike(comment.id);
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
          {comment.user.avatar ? (
            <img loading="lazy" src={comment.user.avatar} alt={comment.user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            comment.user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{comment.user.name}</span>
            <span className="text-sm text-muted-foreground">{formatTime(comment.createdAt)}</span>
          </div>
          <p className="text-foreground mt-1">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
            >
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likes > 0 && <span>{likes}</span>}
            </button>
            <button
              onClick={onReply}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              回复
            </button>
            {currentUserId === comment.user.id && onDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                删除
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 回复列表 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onDelete={onDelete}
              onReply={onReply}
              currentUserId={currentUserId}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// 消息系统组件
// =====================================================

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}

interface MessageSystemProps {
  conversations: Conversation[];
  selectedConversation?: string;
  messages: Message[];
  currentUserId: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (content: string) => Promise<void>;
}

export const MessageSystem: React.FC<MessageSystemProps> = ({
  conversations,
  selectedConversation,
  messages,
  currentUserId,
  onSelectConversation,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[600px] rounded-lg border border-border overflow-hidden">
      {/* 会话列表 */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">消息</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`
                flex items-center gap-3 p-4 cursor-pointer transition-colors
                ${selectedConversation === conv.id ? 'bg-primary/10' : 'hover:bg-muted/50'}
              `}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                  {conv.user.avatar ? (
                    <img loading="lazy" src={conv.user.avatar} alt={conv.user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    conv.user.name.charAt(0).toUpperCase()
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{conv.user.name}</p>
                {conv.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[70%] px-4 py-2 rounded-2xl
                      ${msg.senderId === currentUserId
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* 输入框 */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="输入消息..."
                  className="flex-1 p-3 rounded-full border border-border bg-background"
                />
                <button
                  onClick={handleSend}
                  disabled={isSending || !newMessage.trim()}
                  className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            选择一个会话开始聊天
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
