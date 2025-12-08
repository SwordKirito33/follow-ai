import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, TrendingUp, CheckCircle, ArrowLeft, DollarSign, Clock, Users, GitCompare, Filter, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TOOLS, REVIEWS } from '../data';
import ToolComparison from '../components/ToolComparison';

const ToolDetail: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highestRated' | 'mostLiked'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  
  const tool = TOOLS.find(t => t.id === id);
  const toolReviews = REVIEWS.filter(r => r.toolId === id);
  
  // Sort and filter reviews
  const sortedReviews = useMemo(() => {
    let filtered = [...toolReviews];
    
    if (filterRating !== null) {
      filtered = filtered.filter(r => Math.floor(r.rating) >= filterRating);
    }
    
    switch (sortBy) {
      case 'newest':
        return filtered;
      case 'oldest':
        return filtered.reverse();
      case 'highestRated':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'mostLiked':
        return filtered.sort((a, b) => b.likes - a.likes);
      default:
        return filtered;
    }
  }, [toolReviews, sortBy, filterRating]);

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('toolDetail.toolNotFound')}</h1>
          <p className="text-gray-600 mb-6">{t('toolDetail.toolNotFoundDesc')}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            {t('toolDetail.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t('toolDetail.back')}</span>
        </button>

        {/* Tool Header Card */}
        <div className="glass-card rounded-xl shadow-xl p-8 mb-8 animate-slideDown">
          <div className="flex flex-col md:flex-row gap-6">
            <img src={tool.logo} alt={tool.name} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                  <p className="text-gray-600 mb-3">{tool.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">{tool.category}</span>
                    <span className="flex items-center gap-1">
                      <Star size={16} className="text-amber-500 fill-amber-500" /> {tool.rating}
                    </span>
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <TrendingUp size={16} /> {tool.growth}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{tool.reviewCount}</div>
                  <div className="text-sm text-gray-500">{t('toolDetail.verifiedReviews')}</div>
                </div>
              </div>

              {/* Use Cases */}
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{t('rankings.useCases')}</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.useCases.map((useCase, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  to="/submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-bold text-center transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <DollarSign size={20} />
                  {t('toolDetail.submitReviewAndEarn')}
                </Link>
                <Link
                  to="/tasks"
                  className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-bold text-center transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Clock size={20} />
                  {t('toolDetail.viewPaidTasks')}
                </Link>
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex-1 glass-card border-2 border-white/30 hover:bg-white/90 text-gray-900 px-6 py-3 rounded-lg font-bold text-center transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <GitCompare size={20} />
                  {t('common.compare')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl shadow-xl p-6 hover:bg-white/90 transition-all transform hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tool.reviewCount}</div>
                <div className="text-sm text-gray-500">{t('toolDetail.totalReviews')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Star size={20} className="text-green-600 fill-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tool.rating}</div>
                <div className="text-sm text-gray-500">{t('toolDetail.averageRating')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tool.growth}</div>
                <div className="text-sm text-gray-500">{t('toolDetail.growth24h')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="glass-card rounded-xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold gradient-text">{t('toolDetail.verifiedReviews')}</h2>
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none glass-card border border-white/30 px-4 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white/50 backdrop-blur-sm"
                >
                  <option value="newest">{t('reviewsFilter.newest')}</option>
                  <option value="oldest">{t('reviewsFilter.oldest')}</option>
                  <option value="highestRated">{t('reviewsFilter.highestRated')}</option>
                  <option value="mostLiked">{t('reviewsFilter.mostLiked')}</option>
                </select>
                <ArrowUpDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Rating Filter */}
              <div className="relative">
                <select
                  value={filterRating || ''}
                  onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                  className="appearance-none glass-card border border-white/30 px-4 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white/50 backdrop-blur-sm"
                >
                  <option value="">{t('reviewsFilter.allRatings')}</option>
                  <option value="5">5 ⭐</option>
                  <option value="4">4+ ⭐</option>
                  <option value="3">3+ ⭐</option>
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <Link
                to="/submit"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-all transform hover:scale-105"
              >
                {t('toolDetail.writeReview')} <ArrowLeft size={16} className="rotate-180" />
              </Link>
            </div>
          </div>

          {toolReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{t('toolDetail.noReviewsYet')}</p>
              <Link
                to="/submit"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                {t('toolDetail.submitFirstReview')}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedReviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('search.noResults')}</p>
                </div>
              ) : (
                sortedReviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4 mb-3">
                    <img src={review.user.avatar} alt={review.user.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{review.user.name}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {review.user.levelName}
                        </span>
                        <span className="text-xs text-gray-400">{review.timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(review.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{review.rating}</span>
                        <span className="text-xs text-gray-500">Quality: {review.qualityScore}/10</span>
                      </div>
                      <p className="text-gray-700 mb-3">{review.text}</p>
                      {review.outputImage && (
                        <img
                          src={review.outputImage}
                          alt="Review output"
                          className="rounded-lg border border-gray-200 max-w-full h-auto mb-3"
                        />
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="hover:text-blue-600 transition-colors">👍 {review.likes} {t('toolDetail.likes')}</button>
                        <button className="hover:text-blue-600 transition-colors">💬 {t('toolDetail.helpful')} ({review.helpful})</button>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Comparison Modal */}
      <ToolComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
};

export default ToolDetail;

