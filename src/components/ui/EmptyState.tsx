// Unified Empty State Components for Follow-ai
// Use these components when there's no data to display

import React from 'react';
import { Link } from 'wouter';
import { cn } from '../../lib/utils';

// ============================================
// Icons
// ============================================

const EmptyIcons = {
  tasks: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  search: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  notifications: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  transactions: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  achievements: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  users: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  inbox: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  folder: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
};

type EmptyIconType = keyof typeof EmptyIcons;

// ============================================
// Main Empty State Component
// ============================================

interface EmptyStateProps {
  icon?: EmptyIconType | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-6',
    md: 'py-12',
    lg: 'py-20',
  };

  const iconSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const titleSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const renderIcon = () => {
    if (typeof icon === 'string' && icon in EmptyIcons) {
      return React.cloneElement(EmptyIcons[icon as EmptyIconType] as React.ReactElement, {
        className: cn(iconSizeClasses[size], 'text-gray-400'),
      });
    }
    return icon;
  };

  const renderAction = (
    actionConfig: { label: string; href?: string; onClick?: () => void },
    isPrimary: boolean
  ) => {
    const buttonClasses = isPrimary
      ? 'px-4 py-2 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors'
      : 'px-4 py-2 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-gray-200';

    if (actionConfig.href) {
      return (
        <Link href={actionConfig.href}>
          <button className={buttonClasses}>{actionConfig.label}</button>
        </Link>
      );
    }

    return (
      <button onClick={actionConfig.onClick} className={buttonClasses}>
        {actionConfig.label}
      </button>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size],
        className
      )}
    >
      <div className="mb-4 text-gray-400">{renderIcon()}</div>
      <h3 className={cn('font-semibold text-white dark:text-gray-100', titleSizeClasses[size])}>
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-300 max-w-sm">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex items-center gap-4">
          {action && renderAction(action, true)}
          {secondaryAction && renderAction(secondaryAction, false)}
        </div>
      )}
    </div>
  );
}

// ============================================
// Preset Empty States
// ============================================

export function NoTasksEmpty({ onCreateTask }: { onCreateTask?: () => void }) {
  return (
    <EmptyState
      icon="tasks"
      title="No tasks available"
      description="There are no tasks to complete right now. Check back later for new opportunities to earn XP!"
      action={
        onCreateTask
          ? { label: 'Browse Tools', onClick: onCreateTask }
          : { label: 'Browse Tools', href: '/tools' }
      }
    />
  );
}

export function NoSearchResultsEmpty({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try different keywords.`
          : 'Try adjusting your search or filters to find what you\'re looking for.'
      }
      action={onClear ? { label: 'Clear Search', onClick: onClear } : undefined}
    />
  );
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon="notifications"
      title="No notifications"
      description="You're all caught up! We'll notify you when something important happens."
      size="sm"
    />
  );
}

export function NoTransactionsEmpty() {
  return (
    <EmptyState
      icon="transactions"
      title="No transactions yet"
      description="Your transaction history will appear here once you start earning or spending XP."
      action={{ label: 'Earn XP', href: '/tasks' }}
    />
  );
}

export function NoAchievementsEmpty() {
  return (
    <EmptyState
      icon="achievements"
      title="No achievements yet"
      description="Complete tasks and reach milestones to unlock achievements and earn bonus XP!"
      action={{ label: 'Start Earning', href: '/tasks' }}
    />
  );
}

export function NoFollowersEmpty({ isOwnProfile }: { isOwnProfile?: boolean }) {
  return (
    <EmptyState
      icon="users"
      title="No followers yet"
      description={
        isOwnProfile
          ? 'Share your profile and engage with the community to gain followers.'
          : 'This user doesn\'t have any followers yet.'
      }
      size="sm"
    />
  );
}

export function NoFollowingEmpty({ isOwnProfile }: { isOwnProfile?: boolean }) {
  return (
    <EmptyState
      icon="users"
      title="Not following anyone"
      description={
        isOwnProfile
          ? 'Discover and follow other users to see their activity in your feed.'
          : 'This user isn\'t following anyone yet.'
      }
      action={isOwnProfile ? { label: 'Explore Users', href: '/leaderboard' } : undefined}
      size="sm"
    />
  );
}

export function ErrorEmpty({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="error"
      title="Something went wrong"
      description="We encountered an error while loading this content. Please try again."
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  );
}

export function NoDataEmpty({ dataType }: { dataType?: string }) {
  return (
    <EmptyState
      icon="folder"
      title={`No ${dataType || 'data'} available`}
      description={`There's no ${dataType || 'data'} to display at the moment.`}
    />
  );
}

// ============================================
// Compact Empty State (for inline use)
// ============================================

interface CompactEmptyProps {
  message: string;
  className?: string;
}

export function CompactEmpty({ message, className }: CompactEmptyProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-8 text-sm text-gray-400 dark:text-gray-300',
        className
      )}
    >
      <span>{message}</span>
    </div>
  );
}

// ============================================
// Export all
// ============================================

export default {
  EmptyState,
  NoTasksEmpty,
  NoSearchResultsEmpty,
  NoNotificationsEmpty,
  NoTransactionsEmpty,
  NoAchievementsEmpty,
  NoFollowersEmpty,
  NoFollowingEmpty,
  ErrorEmpty,
  NoDataEmpty,
  CompactEmpty,
};
