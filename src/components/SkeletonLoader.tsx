/**
 * Skeleton Loading Components
 * Display placeholder UI while content is loading
 */

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function SkeletonLine({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-700 rounded animate-pulse ${className}`}
        />
      ))}
    </>
  );
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 space-y-3 ${className}`}>
      <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse" />
      </div>
      <div className="h-10 bg-gray-700 rounded animate-pulse" />
    </div>
  );
}

export function SkeletonAvatar({ className = '' }: SkeletonProps) {
  return (
    <div className={`w-12 h-12 bg-gray-700 rounded-full animate-pulse ${className}`} />
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className="flex-1 h-10 bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-700 rounded animate-pulse ${
            i === lines - 1 ? 'w-5/6' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}
