// Unified Loading Components for Follow.ai
// Use these components for all loading states

import React from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Spinner Component
// ============================================

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

// ============================================
// Loading Overlay Component
// ============================================

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
  blur?: boolean;
  children?: React.ReactNode;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  fullScreen = false,
  blur = true,
  children,
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>;

  const overlayClasses = cn(
    'flex flex-col items-center justify-center',
    fullScreen
      ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80'
      : 'absolute inset-0 z-10 bg-white/60 dark:bg-gray-900/60',
    blur && 'backdrop-blur-sm'
  );

  return (
    <div className="relative">
      {children}
      <div className={overlayClasses}>
        <Spinner size="lg" />
        {message && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Full Page Loading Component
// ============================================

interface PageLoadingProps {
  message?: string;
  showLogo?: boolean;
}

export function PageLoading({ message = 'Loading...', showLogo = true }: PageLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {showLogo && (
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Follow.ai
            </span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-gray-700 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-6 text-gray-600 dark:text-gray-400 animate-pulse">{message}</p>
      </div>
    </div>
  );
}

// ============================================
// Skeleton Components
// ============================================

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700 rounded',
        animate && 'animate-pulse',
        className
      )}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b last:border-b-0">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ============================================
// Button Loading State
// ============================================

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={cn(
        'relative inline-flex items-center justify-center',
        isLoading && 'cursor-not-allowed',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" color="white" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

// ============================================
// Inline Loading Component
// ============================================

interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md';
}

export function InlineLoading({ message, size = 'sm' }: InlineLoadingProps) {
  return (
    <div className="inline-flex items-center gap-2 text-gray-500">
      <Spinner size={size} color="gray" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}

// ============================================
// Progress Loading Component
// ============================================

interface ProgressLoadingProps {
  progress: number; // 0-100
  message?: string;
  showPercentage?: boolean;
}

export function ProgressLoading({
  progress,
  message,
  showPercentage = true,
}: ProgressLoadingProps) {
  return (
    <div className="w-full">
      {(message || showPercentage) && (
        <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{message}</span>
          {showPercentage && <span>{Math.round(progress)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// ============================================
// Dots Loading Animation
// ============================================

export function DotsLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// ============================================
// Pulse Loading Animation
// ============================================

export function PulseLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative">
        <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping absolute opacity-75" />
        <div className="w-8 h-8 bg-blue-600 rounded-full" />
      </div>
    </div>
  );
}

// ============================================
// Export all
// ============================================

export default {
  Spinner,
  LoadingOverlay,
  PageLoading,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  LoadingButton,
  InlineLoading,
  ProgressLoading,
  DotsLoading,
  PulseLoading,
};
