import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Trophy, 
  Zap, 
  Shield, 
  Award, 
  Crown, 
  Flame,
  Target,
  Heart,
  Sparkles
} from 'lucide-react';

type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'gradient';

type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  dot?: boolean;
  pulse?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  pulse = false,
  removable = false,
  onRemove,
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-white/10 text-gray-200 dark:bg-gray-800 dark:text-gray-200',
    primary: 'bg-primary-blue/20 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    secondary: 'bg-primary-purple/20 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    success: 'bg-accent-green/20 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-accent-gold/20 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotColors = {
    default: 'bg-white/50',
    primary: 'bg-blue-500',
    secondary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-cyan-500',
    gradient: 'bg-white',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
          />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 -mr-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Achievement badge component
export const AchievementBadge: React.FC<{
  name: string;
  description?: string;
  icon?: ReactNode;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
  progress?: number;
  className?: string;
}> = ({
  name,
  description,
  icon,
  rarity = 'common',
  unlocked = false,
  progress,
  className = '',
}) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
  };

  const rarityGlow = {
    common: '',
    rare: 'shadow-blue-500/30',
    epic: 'shadow-purple-500/30',
    legendary: 'shadow-yellow-500/30',
  };

  const defaultIcons = {
    common: <Star className="w-6 h-6" />,
    rare: <Award className="w-6 h-6" />,
    epic: <Trophy className="w-6 h-6" />,
    legendary: <Crown className="w-6 h-6" />,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-xl border ${
        unlocked
          ? `bg-gradient-to-br ${rarityColors[rarity]} text-white shadow-lg ${rarityGlow[rarity]}`
          : 'bg-white/10 dark:bg-gray-800 text-gray-400 dark:text-gray-400'
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            unlocked ? 'bg-white/20' : 'bg-white/10 dark:bg-gray-700'
          }`}
        >
          {icon || defaultIcons[rarity]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold truncate">{name}</h4>
          {description && (
            <p className={`text-sm ${unlocked ? 'text-white/80' : 'text-gray-400'} truncate`}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar for locked badges */}
      {!unlocked && progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${rarityColors[rarity]} rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Locked overlay */}
      {!unlocked && (
        <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/30 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </motion.div>
  );
};

// Level badge component
export const LevelBadge: React.FC<{
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}> = ({ level, size = 'md', showLabel = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  // Determine tier based on level
  const getTier = (level: number) => {
    if (level >= 50) return { name: 'Master', color: 'from-yellow-400 to-orange-500' };
    if (level >= 30) return { name: 'Expert', color: 'from-purple-400 to-purple-600' };
    if (level >= 15) return { name: 'Advanced', color: 'from-blue-400 to-blue-600' };
    if (level >= 5) return { name: 'Intermediate', color: 'from-green-400 to-green-600' };
    return { name: 'Beginner', color: 'from-gray-400 to-gray-500' };
  };

  const tier = getTier(level);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {level}
      </motion.div>
      {showLabel && (
        <div>
          <p className="font-semibold text-white dark:text-white">Level {level}</p>
          <p className="text-xs text-gray-400 dark:text-gray-300">{tier.name}</p>
        </div>
      )}
    </div>
  );
};

export default Badge;
