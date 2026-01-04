// AI Tool Card Component for Follow-ai
// Displays AI tool information in a card format

import React from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logo?: string;
  website?: string;
  pricing: 'free' | 'freemium' | 'paid';
  rating: number;
  reviewCount: number;
  tags?: string[];
  isFeatured?: boolean;
  isVerified?: boolean;
}

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  onFavorite?: (toolId: string) => void;
  onShare?: (tool: Tool) => void;
  onClick?: (tool: Tool) => void;
  isFavorited?: boolean;
  className?: string;
}

// ============================================
// Helper Components
// ============================================

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            sizeClass,
            star <= Math.round(rating)
              ? 'text-yellow-400'
              : 'text-gray-300 dark:text-gray-400'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-400 dark:text-gray-400 ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function PricingBadge({ pricing }: { pricing: Tool['pricing'] }) {
  const config = {
    free: { label: '免费', className: 'bg-accent-green/20 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    freemium: { label: '免费增值', className: 'bg-primary-blue/20 text-primary-blue dark:bg-blue-900/30 dark:text-blue-400' },
    paid: { label: '付费', className: 'bg-primary-purple/20 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  };

  const { label, className } = config[pricing];

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', className)}>
      {label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const categoryLabels: Record<string, string> = {
    chatbot: '聊天机器人',
    'image-generation': '图像生成',
    writing: '写作助手',
    coding: '编程工具',
    video: '视频制作',
    audio: '音频处理',
    search: '智能搜索',
    productivity: '生产力',
    design: '设计工具',
    marketing: '营销工具',
  };

  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-400 dark:bg-gray-800 dark:text-gray-400">
      {categoryLabels[category] || category}
    </span>
  );
}

// ============================================
// Tool Card Component
// ============================================

export function ToolCard({
  tool,
  variant = 'default',
  showActions = true,
  onFavorite,
  onShare,
  onClick,
  isFavorited = false,
  className,
}: ToolCardProps) {
  const handleClick = () => {
    onClick?.(tool);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(tool.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(tool);
  };

  // Featured variant
  if (variant === 'featured') {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'group relative overflow-hidden rounded-2xl cursor-pointer',
          'bg-gradient-to-br from-purple-600 to-pink-600',
          'p-6 md:p-8',
          'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
          className
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {tool.logo ? (
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="w-16 h-16 rounded-xl bg-white p-2 object-contain"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                  {tool.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                  {tool.isVerified && (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={tool.rating} />
                  <span className="text-white/70 text-sm">
                    ({tool.reviewCount.toLocaleString()} 评价)
                  </span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              精选
            </span>
          </div>

          {/* Description */}
          <p className="text-white/90 mb-4 line-clamp-2">
            {tool.description}
          </p>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-white/10 text-white/80 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <PricingBadge pricing={tool.pricing} />
            <div className="flex gap-2">
              {showActions && (
                <>
                  <button
                    onClick={handleFavorite}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <svg
                      className={cn('w-5 h-5', isFavorited ? 'text-red-400 fill-current' : 'text-white')}
                      fill={isFavorited ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'group flex items-center gap-4 p-4 rounded-xl cursor-pointer',
          'bg-white dark:bg-gray-800',
          'border border-white/10 dark:border-gray-700',
          'hover:border-purple-300 dark:hover:border-purple-700',
          'transition-all duration-200',
          className
        )}
      >
        {tool.logo ? (
          <img
            src={tool.logo}
            alt={tool.name}
            className="w-12 h-12 rounded-lg object-contain bg-white/5 dark:bg-gray-700 p-1"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {tool.name.charAt(0)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white dark:text-white truncate">
              {tool.name}
            </h3>
            {tool.isVerified && (
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={tool.rating} size="sm" />
            <span className="text-xs text-gray-400 dark:text-gray-300">
              {tool.reviewCount.toLocaleString()}
            </span>
          </div>
        </div>

        <PricingBadge pricing={tool.pricing} />
      </div>
    );
  }

  // Default variant
  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative overflow-hidden rounded-xl cursor-pointer',
        'bg-white dark:bg-gray-800',
        'border border-white/10 dark:border-gray-700',
        'hover:border-purple-300 dark:hover:border-purple-700',
        'hover:shadow-lg',
        'transition-all duration-300',
        className
      )}
    >
      {/* Featured Badge */}
      {tool.isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="w-20 h-20 overflow-hidden">
            <div className="absolute top-2 right-[-35px] w-[120px] transform rotate-45 bg-gradient-to-r from-purple-600 to-pink-600 text-center text-white text-xs py-1">
              精选
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {tool.logo ? (
            <img
              src={tool.logo}
              alt={tool.name}
              className="w-14 h-14 rounded-xl object-contain bg-white/5 dark:bg-gray-700 p-2"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
              {tool.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white dark:text-white truncate">
                {tool.name}
              </h3>
              {tool.isVerified && (
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <CategoryBadge category={tool.category} />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-white/10 dark:bg-gray-700 text-gray-400 dark:text-gray-400 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <StarRating rating={tool.rating} />
            <span className="text-xs text-gray-400 dark:text-gray-300">
              ({tool.reviewCount.toLocaleString()})
            </span>
          </div>
          <PricingBadge pricing={tool.pricing} />
        </div>
      </div>

      {/* Hover Actions */}
      {showActions && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFavorite}
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-white/5 dark:hover:bg-gray-600 transition-colors"
          >
            <svg
              className={cn('w-4 h-4', isFavorited ? 'text-red-500 fill-current' : 'text-gray-400')}
              fill={isFavorited ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-white/5 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// Tool Grid Component
// ============================================

interface ToolGridProps {
  tools: Tool[];
  variant?: 'default' | 'compact' | 'featured';
  columns?: 1 | 2 | 3 | 4;
  onToolClick?: (tool: Tool) => void;
  onFavorite?: (toolId: string) => void;
  onShare?: (tool: Tool) => void;
  favoritedIds?: string[];
  className?: string;
}

export function ToolGrid({
  tools,
  variant = 'default',
  columns = 3,
  onToolClick,
  onFavorite,
  onShare,
  favoritedIds = [],
  className,
}: ToolGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          variant={variant}
          onClick={onToolClick}
          onFavorite={onFavorite}
          onShare={onShare}
          isFavorited={favoritedIds.includes(tool.id)}
        />
      ))}
    </div>
  );
}

// ============================================
// Export
// ============================================

export default ToolCard;
