import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  variant = 'default',
  animated = true,
  className = '',
}) => {
  const { t } = useLanguage();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-primary-cyan to-primary-blue',
    gradient: 'bg-gradient-to-r from-primary-blue to-primary-purple',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-300 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-white dark:text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-slate-800/50/10 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${variantClasses[variant]}`}
        />
      </div>
    </div>
  );
};

// Circular progress component
export const CircularProgress: React.FC<{
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger';
  className?: string;
}> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showValue = true,
  label,
  variant = 'default',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: '#3B82F6',
    gradient: 'url(#gradient)',
    success: '#22C55E',
    warning: '#EAB308',
    danger: '#EF4444',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-300"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white dark:text-white">
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-gray-400 dark:text-gray-300">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Multi-segment progress bar
export const SegmentedProgress: React.FC<{
  segments: Array<{
    value: number;
    color: string;
    label?: string;
  }>;
  total?: number;
  size?: 'sm' | 'md' | 'lg';
  showLegend?: boolean;
  className?: string;
}> = ({ segments, total, size = 'md', showLegend = true, className = '' }) => {
  const calculatedTotal = total || segments.reduce((sum, s) => sum + s.value, 0);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={className}>
      <div
        className={`w-full bg-slate-800/50/10 dark:bg-gray-700 rounded-full overflow-hidden flex ${sizeClasses[size]}`}
      >
        {segments.map((segment, index) => {
          const width = (segment.value / calculatedTotal) * 100;
          return (
            <motion.div
              key={index}
              initial={{ width: 0 }}
              animate={{ width: `${width}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
              style={{ backgroundColor: segment.color }}
            />
          );
        })}
      </div>
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-400 dark:text-gray-400">
                {segment.label || `Segment ${index + 1}`}: {segment.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
