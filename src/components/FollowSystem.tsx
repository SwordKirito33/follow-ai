import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, Users, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface User {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  xp: number;
  isFollowing?: boolean;
}

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollow: (userId: string) => Promise<void>;
  onUnfollow: (userId: string) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
  showCount?: boolean;
  followerCount?: number;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing,
  onFollow,
  onUnfollow,
  size = 'md',
  variant = 'default',
  showCount = false,
  followerCount = 0,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow(userId);
      } else {
        await onFollow(userId);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const getVariantClasses = () => {
    if (isFollowing) {
      if (isHovered) {
        return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      }
      return 'bg-slate-800/50/10 dark:bg-gray-800 text-gray-300 dark:text-gray-300 border-white/10 dark:border-gray-700';
    }

    switch (variant) {
      case 'outline':
        return 'bg-transparent border-blue-600 text-primary-cyan hover:bg-blue-50 dark:hover:bg-blue-900/20';
      case 'minimal':
        return 'bg-transparent text-primary-cyan hover:bg-blue-50 dark:hover:bg-blue-900/20';
      default:
        return 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white hover:bg-blue-700 border-blue-600';
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center gap-2 rounded-xl font-medium border-2 transition-all
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : isFollowing ? (
        isHovered ? (
          <>
            <UserMinus className="w-4 h-4" />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Following</span>
          </>
        )
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Follow</span>
        </>
      )}

      {showCount && (
        <span className="ml-1 px-2 py-0.5 bg-black/10 dark:bg-slate-800/50/10 rounded-full text-xs">
          {followerCount.toLocaleString()}
        </span>
      )}
    </motion.button>
  );
};

// Followers/Following List Modal
interface FollowListProps {
  type: 'followers' | 'following';
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onFollow: (userId: string) => Promise<void>;
  onUnfollow: (userId: string) => Promise<void>;
  currentUserId?: string;
}

export const FollowList: React.FC<FollowListProps> = ({
  type,
  users,
  isOpen,
  onClose,
  onFollow,
  onUnfollow,
  currentUserId,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-gray-700">
              <h2 className="text-lg font-bold text-white dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                {type === 'followers' ? 'Followers' : 'Following'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800/50/10 dark:hover:bg-gray-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* User list */}
            <div className="max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No {type} yet</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-800/50/5 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          user.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white dark:text-white">
                          {user.username}
                        </p>
                        <p className="text-sm text-gray-400">
                          Level {user.level} • {user.xp.toLocaleString()} XP
                        </p>
                      </div>
                    </div>

                    {user.id !== currentUserId && (
                      <FollowButton
                        userId={user.id}
                        isFollowing={user.isFollowing || false}
                        onFollow={onFollow}
                        onUnfollow={onUnfollow}
                        size="sm"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Follow Stats Component
interface FollowStatsProps {
  followersCount: number;
  followingCount: number;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

export const FollowStats: React.FC<FollowStatsProps> = ({
  followersCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
}) => {
  return (
    <div className="flex items-center gap-6">
      <button
        onClick={onFollowersClick}
        className="text-center hover:opacity-80 transition-opacity"
      >
        <p className="text-2xl font-bold text-white dark:text-white">
          {followersCount.toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">Followers</p>
      </button>
      <div className="w-px h-10 bg-slate-800/50/10 dark:bg-gray-700" />
      <button
        onClick={onFollowingClick}
        className="text-center hover:opacity-80 transition-opacity"
      >
        <p className="text-2xl font-bold text-white dark:text-white">
          {followingCount.toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">Following</p>
      </button>
    </div>
  );
};

export default FollowButton;
