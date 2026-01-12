/**
 * Empty state component
 * Displays when no data is available
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import FollowButton from './follow-button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {Icon && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Icon size={48} className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <FollowButton
          onClick={action.onClick}
          variant="primary"
          size="md"
          icon={action.icon}
        >
          {action.label}
        </FollowButton>
      )}
    </div>
  );
}

export default EmptyState;
