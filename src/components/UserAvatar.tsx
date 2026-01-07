import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  showLevel?: boolean;
  level?: number;
  className?: string;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User avatar',
  name,
  size = 'md',
  showOnlineStatus = false,
  isOnline = false,
  showLevel = false,
  level,
  className = '',
  onClick,
}) => {
  const { t } = useLanguage();
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const levelSizes = {
    xs: 'w-3 h-3 text-[8px]',
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-xs',
    xl: 'w-7 h-7 text-sm',
    '2xl': 'w-8 h-8 text-sm',
  };

  // Generate initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color from name
  const getColorFromName = (name: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-indigo-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
      data-testid="user-avatar"
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          data-testid="user-avatar-image"
          onError={(e) => {
            // Hide broken image and show fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : name ? (
        <div
          className={`w-full h-full flex items-center justify-center text-white font-semibold ${getColorFromName(name)}`}
        >
          {getInitials(name)}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800/10 dark:bg-gray-700 text-gray-400 dark:text-gray-300">
          <User className="w-1/2 h-1/2" />
        </div>
      )}

      {/* Online status indicator */}
      {showOnlineStatus && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-white dark:border-gray-900 ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      )}

      {/* Level badge */}
      {showLevel && level !== undefined && (
        <span
          className={`absolute -bottom-1 -right-1 ${levelSizes[size]} rounded-full bg-gradient-to-r from-primary-blue to-primary-purple text-white font-bold flex items-center justify-center border-2 border-white dark:border-gray-900`}
        >
          {level}
        </span>
      )}
    </Component>
  );
};

// Avatar group component
export const AvatarGroup: React.FC<{
  avatars: Array<{ src?: string; name?: string; alt?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ avatars, max = 4, size = 'md', className = '' }) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const overlapClasses = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-2.5',
    lg: '-ml-3',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={`relative ${index > 0 ? overlapClasses[size] : ''}`}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <UserAvatar
            src={avatar.src}
            name={avatar.name}
            alt={avatar.alt}
            size={size}
            className="ring-2 ring-white dark:ring-gray-900"
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`relative ${overlapClasses[size]} flex items-center justify-center rounded-full bg-gray-800/10 dark:bg-gray-700 text-gray-400 dark:text-gray-300 font-semibold ring-2 ring-white dark:ring-gray-900 ${
            size === 'xs'
              ? 'w-6 h-6 text-xs'
              : size === 'sm'
              ? 'w-8 h-8 text-sm'
              : size === 'md'
              ? 'w-10 h-10 text-sm'
              : 'w-12 h-12 text-base'
          }`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
