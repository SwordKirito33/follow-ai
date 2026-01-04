// Tool Detail Component for Follow.ai
// Comprehensive tool detail page with reviews, screenshots, and related tools

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  logo?: string;
  website?: string;
  pricing: 'free' | 'freemium' | 'paid';
  pricingDetails?: string;
  rating: number;
  reviewCount: number;
  tags?: string[];
  features?: string[];
  screenshots?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: string[];
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  pros?: string[];
  cons?: string[];
  helpful: number;
  createdAt: string;
}

interface ToolDetailProps {
  tool: Tool;
  reviews?: Review[];
  relatedTools?: Tool[];
  onWriteReview?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onVisitWebsite?: () => void;
  isFavorited?: boolean;
  className?: string;
}

// ============================================
// Helper Components
// ============================================

function StarRating({ rating, interactive = false, onChange }: { 
  rating: number; 
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={cn(
            'transition-transform',
            interactive && 'hover:scale-110 cursor-pointer'
          )}
        >
          <svg
            className={cn(
              'w-6 h-6',
              (hoverRating || rating) >= star
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-400'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function RatingBreakdown({ reviews }: { reviews: Review[] }) {
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.round(r.rating) === rating).length,
  }));

  return (
    <div className="space-y-2">
      {ratingCounts.map(({ rating, count }) => {
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return (
          <div key={rating} className="flex items-center gap-2">
            <span className="text-sm text-gray-400 dark:text-gray-400 w-8">
              {rating}星
            </span>
            <div className="flex-1 h-2 bg-white/10 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [isHelpful, setIsHelpful] = useState(false);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-white/10 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {review.userName.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-medium text-white dark:text-white">
              {review.userName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.createdAt).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-white dark:text-white mb-2">
          {review.title}
        </h4>
      )}

      {/* Content */}
      <p className="text-gray-400 dark:text-gray-400 mb-4">
        {review.content}
      </p>

      {/* Pros & Cons */}
      {(review.pros?.length || review.cons?.length) && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {review.pros && review.pros.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-accent-green dark:text-green-400 mb-2">
                优点
              </h5>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-400">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons && review.cons.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                缺点
              </h5>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-400">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/10 dark:border-gray-700">
        <button
          onClick={() => setIsHelpful(!isHelpful)}
          className={cn(
            'flex items-center gap-2 text-sm transition-colors',
            isHelpful
              ? 'text-primary-purple dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300'
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          有帮助 ({review.helpful + (isHelpful ? 1 : 0)})
        </button>
        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300">
          举报
        </button>
      </div>
    </div>
  );
}

// ============================================
// Tool Detail Component
// ============================================

export function ToolDetail({
  tool,
  reviews = [],
  relatedTools = [],
  onWriteReview,
  onFavorite,
  onShare,
  onVisitWebsite,
  isFavorited = false,
  className,
}: ToolDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'alternatives'>('overview');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : tool.rating;

  return (
    <div className={cn('max-w-6xl mx-auto', className)}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Logo */}
          {tool.logo ? (
            <img
              src={tool.logo}
              alt={tool.name}
              className="w-24 h-24 rounded-2xl bg-white p-3 object-contain"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-bold">
              {tool.name.charAt(0)}
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              {tool.isVerified && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            <p className="text-white/90 mb-4">{tool.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-white/70">({tool.reviewCount.toLocaleString()} 评价)</span>
              </div>

              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tool.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-white/20 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onVisitWebsite}
              className="px-6 py-3 bg-white text-primary-purple font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              访问网站
            </button>
            <div className="flex gap-2">
              <button
                onClick={onFavorite}
                className={cn(
                  'flex-1 p-3 rounded-xl transition-colors',
                  isFavorited
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 hover:bg-white/30'
                )}
              >
                <svg className="w-5 h-5 mx-auto" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={onShare}
                className="flex-1 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 dark:border-gray-700 mb-8">
        {[
          { id: 'overview', label: '概览' },
          { id: 'reviews', label: `评价 (${reviews.length})` },
          { id: 'alternatives', label: '替代品' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'px-4 py-3 font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'text-primary-purple dark:text-purple-400 border-purple-600 dark:border-purple-400'
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-300 dark:hover:text-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {tool.longDescription && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/10 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-white dark:text-white mb-4">
                  关于 {tool.name}
                </h2>
                <p className="text-gray-400 dark:text-gray-400 whitespace-pre-line">
                  {tool.longDescription}
                </p>
              </div>
            )}

            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/10 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-white dark:text-white mb-4">
                  主要功能
                </h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-400 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Screenshots */}
            {tool.screenshots && tool.screenshots.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/10 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-white dark:text-white mb-4">
                  截图
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tool.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedScreenshot(screenshot)}
                      className="aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                    >
                      <img
                        src={screenshot}
                        alt={`${tool.name} screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pros & Cons */}
            {(tool.pros?.length || tool.cons?.length) && (
              <div className="grid md:grid-cols-2 gap-6">
                {tool.pros && tool.pros.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      优点
                    </h3>
                    <ul className="space-y-2">
                      {tool.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-green-700 dark:text-green-400">
                          <svg className="w-4 h-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.cons && tool.cons.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                      </svg>
                      缺点
                    </h3>
                    <ul className="space-y-2">
                      {tool.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-400">
                          <svg className="w-4 h-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/10 dark:border-gray-700">
              <h3 className="font-semibold text-white dark:text-white mb-4">
                基本信息
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">分类</dt>
                  <dd className="font-medium text-white dark:text-white">{tool.category}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">定价</dt>
                  <dd className="font-medium text-white dark:text-white">
                    {tool.pricing === 'free' ? '免费' : tool.pricing === 'freemium' ? '免费增值' : '付费'}
                    {tool.pricingDetails && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        ({tool.pricingDetails})
                      </span>
                    )}
                  </dd>
                </div>
                {tool.website && (
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">网站</dt>
                    <dd>
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-purple dark:text-purple-400 hover:underline break-all"
                      >
                        {tool.website.replace(/^https?:\/\//, '')}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Rating Breakdown */}
            {reviews.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/10 dark:border-gray-700">
                <h3 className="font-semibold text-white dark:text-white mb-4">
                  评分分布
                </h3>
                <RatingBreakdown reviews={reviews} />
              </div>
            )}

            {/* Write Review CTA */}
            <button
              onClick={onWriteReview}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              写评价
            </button>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Write Review Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white dark:text-white">
              用户评价 ({reviews.length})
            </h2>
            <button
              onClick={onWriteReview}
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              写评价
            </button>
          </div>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 dark:bg-gray-800 rounded-xl">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                还没有评价，成为第一个评价者！
              </p>
              <button
                onClick={onWriteReview}
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                写评价
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'alternatives' && (
        <div className="text-center py-12 bg-white/5 dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">
            替代品功能即将上线
          </p>
        </div>
      )}

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <img
            src={selectedScreenshot}
            alt="Screenshot"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setSelectedScreenshot(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// Export
// ============================================

export default ToolDetail;
