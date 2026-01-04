import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-slate-800/50/10 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        variant="text" 
        width={i === lines - 1 ? '75%' : '100%'} 
        height="1rem"
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-800/50 dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-white/10 dark:border-gray-700 ${className}`}>
    <div className="flex items-center gap-4 mb-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" height="1rem" />
        <Skeleton variant="text" width="40%" height="0.75rem" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number; className?: string }> = ({ 
  rows = 5, 
  cols = 4,
  className = '' 
}) => (
  <div className={`space-y-3 ${className}`}>
    {/* Header */}
    <div className="flex gap-4 pb-3 border-b border-white/10 dark:border-gray-700">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" className="flex-1" height="1rem" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 py-2">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" className="flex-1" height="1rem" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonProfile: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Header */}
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={80} height={80} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" height="1.5rem" />
        <Skeleton variant="text" width="60%" height="1rem" />
      </div>
    </div>
    {/* Stats */}
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="text-center space-y-2">
          <Skeleton variant="text" width="60%" height="2rem" className="mx-auto" />
          <Skeleton variant="text" width="80%" height="0.75rem" className="mx-auto" />
        </div>
      ))}
    </div>
    {/* Content */}
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

export const SkeletonDashboard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-800/50 dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-white/10 dark:border-gray-700">
          <Skeleton variant="text" width="40%" height="0.75rem" className="mb-2" />
          <Skeleton variant="text" width="60%" height="2rem" />
        </div>
      ))}
    </div>
    {/* Chart */}
    <div className="bg-slate-800/50 dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-white/10 dark:border-gray-700">
      <Skeleton variant="text" width="30%" height="1.25rem" className="mb-4" />
      <Skeleton variant="rounded" width="100%" height="200px" />
    </div>
    {/* Table */}
    <div className="bg-slate-800/50 dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-white/10 dark:border-gray-700">
      <Skeleton variant="text" width="30%" height="1.25rem" className="mb-4" />
      <SkeletonTable rows={5} cols={4} />
    </div>
  </div>
);

export default Skeleton;
