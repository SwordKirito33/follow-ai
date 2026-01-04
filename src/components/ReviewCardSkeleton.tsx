import React from 'react';

const ReviewCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-3 bg-white/10 rounded w-1/4"></div>
        </div>
      </div>

      {/* Tool Info */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-white/10"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>

      {/* Rating & Quality */}
      <div className="px-4 flex items-center justify-between mb-3">
        <div className="h-4 bg-white/10 rounded w-1/3"></div>
        <div className="h-6 bg-white/10 rounded-full w-24"></div>
      </div>

      {/* Review Text */}
      <div className="px-4 mb-3 space-y-2">
        <div className="h-3 bg-white/10 rounded w-full"></div>
        <div className="h-3 bg-white/10 rounded w-full"></div>
        <div className="h-3 bg-white/10 rounded w-2/3"></div>
      </div>

      {/* Output Preview */}
      <div className="bg-white/10 h-48 w-full"></div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between border-t border-white/10">
        <div className="h-4 bg-white/10 rounded w-16"></div>
        <div className="h-4 bg-white/10 rounded w-16"></div>
      </div>
    </div>
  );
};

export default ReviewCardSkeleton;