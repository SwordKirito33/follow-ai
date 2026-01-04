import React from 'react';
import LazyImage from './LazyImage';
import { Edit } from 'lucide-react';
import FollowButton from './ui/follow-button';

interface UserInfoProps {
  userId: string;
  username: string | null;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  level: number;
  totalXp: number;
  joinedDate: string;
  onEditClick?: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  username,
  fullName,
  email,
  avatarUrl,
  level,
  totalXp,
  joinedDate,
  onEditClick,
}) => {
  const displayName = fullName || username || 'User';
  const formattedDate = new Date(joinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="glass-card rounded-2xl shadow-xl overflow-hidden mb-8 animate-slideDown">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>

      {/* Profile Content */}
      <div className="px-8 pb-8">
        <div className="relative flex justify-between items-end -mt-12 mb-6">
          <div className="flex items-end gap-6">
            <LazyImage
              src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'user'}`}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
            />
            <div className="mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">{displayName}</h1>
              <p className="text-gray-400 font-medium">
                {email} • Joined {formattedDate}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-semibold text-primary-cyan">Level {level}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-400">{totalXp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
          {onEditClick && (
            <FollowButton
              onClick={onEditClick}
              variant="secondary"
              size="md"
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Profile
            </FollowButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

