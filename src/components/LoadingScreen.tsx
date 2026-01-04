import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[9999] bg-gray-900/90 backdrop-blur-sm'
    : 'w-full h-full min-h-[200px]';

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center`}>
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400"
          />
          
          {/* Inner logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-purple rounded-xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">F</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Loading dots */}
      <div className="flex items-center gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 bg-gradient-to-r from-primary-cyan to-primary-blue dark:bg-blue-400 rounded-full"
          />
        ))}
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 dark:text-gray-400 font-medium"
      >
        {message}
      </motion.p>
    </div>
  );
};

// Inline loading spinner for buttons and small areas
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-current border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
};

// Skeleton loading for content
export const ContentSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-slate-800/50/10 dark:bg-gray-700 rounded"
        style={{ width: `${Math.random() * 40 + 60}%` }}
      />
    ))}
  </div>
);

// Card skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 dark:border-gray-700 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-slate-800/50/10 dark:bg-gray-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-800/50/10 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-slate-800/50/10 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-800/50/10 dark:bg-gray-700 rounded" />
      <div className="h-3 bg-slate-800/50/10 dark:bg-gray-700 rounded w-5/6" />
    </div>
  </div>
);

export default LoadingScreen;
