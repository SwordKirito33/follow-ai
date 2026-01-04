import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    label?: string;
  };
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
  variant?: 'default' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  description,
  className = '',
  variant = 'default',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const valueSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const variantClasses = {
    default: 'bg-gray-900/90 backdrop-blur-sm border border-white/10 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
    outline: 'bg-transparent border-2 border-white/10 dark:border-gray-700',
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-400',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`rounded-2xl shadow-lg ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <p
          className={`text-sm font-medium ${
            variant === 'gradient' ? 'text-white/80' : 'text-gray-400 dark:text-gray-300'
          }`}
        >
          {title}
        </p>
        {icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              variant === 'gradient'
                ? 'bg-white/20'
                : 'bg-blue-50 dark:bg-blue-900/30 text-primary-cyan dark:text-blue-400'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p
            className={`font-bold ${valueSizes[size]} ${
              variant === 'gradient' ? 'text-white' : 'text-white dark:text-white'
            }`}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>

          {description && (
            <p
              className={`text-sm mt-1 ${
                variant === 'gradient' ? 'text-white/70' : 'text-gray-400 dark:text-gray-300'
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {change && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend ? trendColors[trend] : 'text-gray-400'
            }`}
          >
            <TrendIcon size={16} />
            <span>
              {change.value > 0 ? '+' : ''}
              {change.value}%
            </span>
            {change.label && (
              <span
                className={`${
                  variant === 'gradient' ? 'text-white/60' : 'text-gray-400 dark:text-gray-400'
                }`}
              >
                {change.label}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Grid container for stat cards
export const StatGrid: React.FC<{
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ children, columns = 4, className = '' }) => {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${gridClasses[columns]} ${className}`}>
      {children}
    </div>
  );
};

export default StatCard;
