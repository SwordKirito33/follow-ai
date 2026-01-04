import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, TrendingUp, CheckCircle, ArrowLeft, DollarSign, Clock, Users, GitCompare, Filter, ArrowUpDown, Trophy, Info, Zap, ExternalLink, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TOOLS, REVIEWS } from '@/data';
import ToolComparison from '@/components/ToolComparison';
import BountyCard from '@/components/BountyCard';
import CommentSystem from '@/components/CommentSystem';
import LazyImage from '@/components/LazyImage';
import Badge from '@/components/ui/Badge';
import FollowButton from '@/components/ui/follow-button';

const ToolDetail: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highestRated' | 'mostLiked'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  
  const tool = TOOLS.find(t => t.id === id);
  const toolReviews = REVIEWS.filter(r => r.toolId === id);
  const [activeTab, setActiveTab] = useState<'reviews' | 'about' | 'bounties' | 'leaderboard'>('reviews');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Mock data - replace with real data from Supabase
  const activeBounties = [
    {
      id: 'b1',
      title: 'Build a React Todo App',
      description: 'Create a fully functional todo application using Cursor. Must include add, delete, and toggle functionality.',
      reward: 75,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      slots: { total: 5, filled: 2 },
      requirements: ['React components', 'State management', 'Responsive design'],
      priority: 'high' as const,
    },
    {
      id: 'b2',
      title: 'Code Review & Refactoring',
      description: 'Review and refactor a 500-line codebase. Improve readability and performance.',
      reward: 50,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      slots: { total: 3, filled: 1 },
      requirements: ['Code quality', 'Performance optimization'],
      priority: 'medium' as const,
    },
  ];
  
  const toolLeaderboard = [
    { rank: 1, user: { name: 'Alex Chen', avatar: 'https://picsum.photos/seed/alex/40/40' }, outputs: 12, rewards: 850, avgScore: 9.5 },
    { rank: 2, user: { name: 'Sarah Johnson', avatar: 'https://picsum.photos/seed/sarah/40/40' }, outputs: 10, rewards: 720, avgScore: 9.3 },
    { rank: 3, user: { name: 'Mike Zhang', avatar: 'https://picsum.photos/seed/mike/40/40' }, outputs: 8, rewards: 580, avgScore: 9.1 },
  ];
  
  const toolAbout = {
    description: tool?.description || '',
    strengths: [
      'Excellent context awareness and code understanding',
      'Fast response times with minimal latency',
      'Strong support for multiple programming languages',
      'Intuitive user interface and workflow',
    ],
    limitations: [
      'Occasionally generates overly verbose code',
      'May struggle with very niche frameworks',
      'Requires good internet connection for best performance',
    ],
    pricing: 'Freemium - Free tier available, Pro plans from $20/month',
    website: 'https://cursor.sh',
    launchDate: '2023',
    company: 'Anthropic',
  };
  
  // Mock comments - replace with real data
  const [comments, setComments] = useState([
    {
      id: 'c1',
      user: { id: 'u1', name: 'Alex', avatar: 'https://picsum.photos/seed/alex/40/40', levelName: 'Expert' },
      content: 'Great review! I had a similar experience with the Composer feature.',
      likes: 5,
      replies: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isLiked: false,
    },
  ]);
  
  const handleAddComment = (content: string, parentId?: string) => {
    const newComment = {
      id: `c${Date.now()}`,
      user: { id: 'current', name: 'You', avatar: 'https://picsum.photos/seed/user/40/40', levelName: 'Novice' },
      content,
      likes: 0,
      replies: [],
      createdAt: new Date().toISOString(),
      isLiked: false,
    };
    
    if (parentId) {
      setComments(comments.map(c => 
        c.id === parentId 
          ? { ...c, replies: [...(c.replies || []), newComment] }
          : c
      ));
    } else {
      setComments([...comments, newComment]);
    }
  };
  
  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 };
      }
      // Also check replies
      if (c.replies) {
        return {
          ...c,
          replies: c.replies.map(r => 
            r.id === commentId
              ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
              : r
          ),
        };
      }
      return c;
    }));
  };
  
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
      <div className="min-h-screen bg-white/5 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{t('toolDetail.toolNotFound')}</h1>
          <p className="text-gray-400 mb-6">{t('toolDetail.toolNotFoundDesc')}</p>
          <Link to="/" className="inline-block bg-gradient-to-r from-primary-cyan to-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            {t('toolDetail.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t('toolDetail.back')}</span>
        </button>

        {/* Tool Header Card */}
        <div className="glass-card rounded-xl shadow-xl p-8 mb-8 animate-slideDown">
          <div className="flex flex-col md:flex-row gap-6">
            <LazyImage src={tool.logo} alt={tool.name} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{tool.name}</h1>
                  <p className="text-gray-400 mb-3">{tool.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="bg-white/10 px-3 py-1 rounded-full font-medium">{tool.category}</span>
                    <span className="flex items-center gap-1">
                      <Star size={16} className="text-amber-500 fill-amber-500" /> {tool.rating}
                    </span>
                    <span className="flex items-center gap-1 text-accent-green font-semibold">
                      <TrendingUp size={16} /> {tool.growth}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-2xl font-black text-white mb-1">{tool.reviewCount}</div>
                  <div className="text-sm text-gray-500">{t('toolDetail.verifiedReviews')}</div>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-lg transition-all ${
                      isFavorite
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-white/10 text-gray-400 dark:bg-gray-800 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={isFavorite ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Use Cases */}
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-300 mb-2">{t('rankings.useCases')}</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.useCases.map((useCase, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-primary-blue rounded-lg text-sm font-medium border border-blue-100">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <FollowButton
                  to="/submit"
                  as="link"
                  variant="primary"
                  size="lg"
                  icon={DollarSign}
                  className="flex-1"
                >
                  Submit output
                </FollowButton>
                <FollowButton
                  to="/tasks"
                  as="link"
                  variant="secondary"
                  size="lg"
                  icon={Clock}
                  className="flex-1"
                >
                  View tasks
                </FollowButton>
                <FollowButton
                  onClick={() => setShowComparison(true)}
                  variant="ghost"
                  size="lg"
                  icon={GitCompare}
                  className="flex-1"
                >
                  Compare tools
                </FollowButton>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl shadow-xl p-6 hover:bg-white/90 transition-all transform hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CheckCircle size={20} className="text-primary-cyan" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{tool.reviewCount}</div>
                <div className="text-sm text-gray-500">{t('toolDetail.totalReviews')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Star size={20} className="text-accent-green fill-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{tool.rating}</div>
                <div className="text-sm text-gray-500">{t('toolDetail.averageRating')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp size={20} className="text-primary-purple" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{tool.growth}</div>
                <div className="text-sm text-gray-500">{t('toolDetail.growth24h')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 dark:border-gray-700">
          {[
            { id: 'reviews', label: 'Verified Outputs', icon: CheckCircle },
            { id: 'about', label: 'About', icon: Info },
            { id: 'bounties', label: 'Active Bounties', icon: DollarSign },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-primary-cyan dark:text-blue-400'
                    : 'border-transparent text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-gray-200'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'reviews' && (
        <div className="glass-card rounded-xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-black gradient-text tracking-tight">{t('toolDetail.verifiedReviews')}</h2>
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none glass-card border border-white/30 px-4 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none glass-card backdrop-blur-sm"
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
                  className="appearance-none glass-card border border-white/30 px-4 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none glass-card backdrop-blur-sm"
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
                className="text-primary-cyan hover:text-primary-blue font-semibold text-sm flex items-center gap-1 transition-all transform hover:scale-105"
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
                className="inline-block bg-gradient-to-r from-primary-cyan to-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
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
                <div key={review.id} className="border-b border-white/10 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4 mb-3">
                    <LazyImage src={review.user.avatar} alt={review.user.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{review.user.name}</span>
                        <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
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
                        <span className="text-sm font-semibold text-gray-300">{review.rating}</span>
                        <span className="text-xs text-gray-500">Quality: {review.qualityScore}/10</span>
                      </div>
                      <p className="text-gray-300 mb-3">{review.text}</p>
                      {review.outputImage && (
                        <LazyImage
                          src={review.outputImage}
                          alt="Review output"
                          className="rounded-lg border border-white/10 max-w-full h-auto mb-3"
                        />
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="hover:text-primary-cyan transition-colors">👍 {review.likes} {t('toolDetail.likes')}</button>
                        <button className="hover:text-primary-cyan transition-colors">💬 {t('toolDetail.helpful')} ({review.helpful})</button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comments Section for each review - Collapsed by default */}
                  <div className="mt-4 ml-16">
                    <button
                      onClick={() => {
                        // Toggle comments visibility
                        const commentSection = document.getElementById(`comments-${review.id}`);
                        if (commentSection) {
                          commentSection.classList.toggle('hidden');
                        }
                      }}
                      className="text-sm text-primary-cyan dark:text-blue-400 hover:underline mb-2"
                    >
                      View Comments ({comments.filter(c => c.id.startsWith(`c${review.id}`)).length})
                    </button>
                    <div id={`comments-${review.id}`} className="hidden">
                      <CommentSystem
                        reviewId={review.id.toString()}
                        comments={comments.filter(c => c.id.startsWith(`c${review.id}`))}
                        onAddComment={(content, parentId) => handleAddComment(content, parentId)}
                        onLike={handleLikeComment}
                      />
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          )}
        </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="glass-card rounded-xl shadow-xl p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white dark:text-white mb-4 tracking-tight">About {tool.name}</h2>
              <p className="text-gray-300 dark:text-gray-300 leading-relaxed mb-6">
                {toolAbout.description}
              </p>
              {toolAbout.website && (
                <a
                  href={toolAbout.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-cyan dark:text-blue-400 hover:text-primary-blue dark:hover:text-blue-300 font-semibold"
                >
                  Visit official website
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-black text-white dark:text-white mb-3 tracking-tight flex items-center gap-2">
                  <CheckCircle size={20} className="text-accent-green dark:text-green-400" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {toolAbout.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 dark:text-gray-300">
                      <span className="text-accent-green dark:text-green-400 mt-1">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-black text-white dark:text-white mb-3 tracking-tight flex items-center gap-2">
                  <AlertCircle size={20} className="text-amber-600 dark:text-amber-400" />
                  Limitations
                </h3>
                <ul className="space-y-2">
                  {toolAbout.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 dark:text-gray-300">
                      <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-white/10 dark:border-gray-700">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Pricing</p>
                <p className="text-white dark:text-white font-medium">{toolAbout.pricing}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Launch Date</p>
                <p className="text-white dark:text-white font-medium">{toolAbout.launchDate}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Company</p>
                <p className="text-white dark:text-white font-medium">{toolAbout.company}</p>
              </div>
            </div>
          </div>
        )}

        {/* Active Bounties Tab */}
        {activeTab === 'bounties' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white dark:text-white tracking-tight">
                Active Bounties for {tool.name}
              </h2>
                     <FollowButton to="/tasks" as="link" variant="secondary" size="sm">
                       View all bounties
                     </FollowButton>
            </div>
            
            {activeBounties.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <DollarSign size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-lg text-gray-400 dark:text-gray-400 mb-2">No active bounties</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {activeBounties.map((bounty) => (
                  <BountyCard
                    key={bounty.id}
                    bounty={bounty}
                    toolId={tool.id}
                    toolName={tool.name}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="glass-card rounded-xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white dark:text-white tracking-tight">
                Top Contributors for {tool.name}
              </h2>
              <Badge variant="info" size="md">
                This Week
              </Badge>
            </div>
            
            <div className="space-y-4">
              {toolLeaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {entry.rank === 1 ? (
                      <Trophy className="w-8 h-8 text-yellow-500" />
                    ) : entry.rank === 2 ? (
                      <Trophy className="w-8 h-8 text-gray-400" />
                    ) : entry.rank === 3 ? (
                      <Trophy className="w-8 h-8 text-orange-500" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-gray-800 flex items-center justify-center text-sm font-black text-gray-400 dark:text-gray-400">
                        {entry.rank}
                      </div>
                    )}
                  </div>
                  <LazyImage
                    src={entry.user.avatar}
                    alt={entry.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-black text-white dark:text-white mb-1">
                      {entry.user.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-400">
                      <span>{entry.outputs} verified outputs</span>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-current" />
                        {entry.avgScore}/10 avg
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-accent-green dark:text-green-400">
                      ${entry.rewards}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Total rewards</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Comparison Modal - Lazy Loaded */}
      {showComparison && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="text-white">Loading...</div></div>}>
          <ToolComparison
            isOpen={showComparison}
            onClose={() => setShowComparison(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ToolDetail;

