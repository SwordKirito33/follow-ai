import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Star, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchLeaderboard } from '@/lib/xp-service';
import Badge from '@/components/ui/Badge';
import LazyImage from '@/components/LazyImage';

const Leaderboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'contributors-all' | 'contributors-week' | 'tools-week'>('contributors-all');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'contributors-all') {
      loadLeaderboard();
    }
  }, [activeTab]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLeaderboard(100);
      setLeaderboard(data);
    } catch (err: any) {
      console.error('Failed to load leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for weekly contributors and tools (keep for now until real data available)
  const topContributorsWeek = [
    { rank: 1, name: 'Alex Chen', avatar: 'https://picsum.photos/seed/alex/40/40', outputs: 47, rewards: 2850, score: 9.8 },
    { rank: 2, name: 'Sarah Johnson', avatar: 'https://picsum.photos/seed/sarah/40/40', outputs: 42, rewards: 2400, score: 9.6 },
    { rank: 3, name: 'Mike Zhang', avatar: 'https://picsum.photos/seed/mike/40/40', outputs: 38, rewards: 2100, score: 9.5 },
    { rank: 4, name: 'Emma Wilson', avatar: 'https://picsum.photos/seed/emma/40/40', outputs: 35, rewards: 1950, score: 9.4 },
    { rank: 5, name: 'David Lee', avatar: 'https://picsum.photos/seed/david/40/40', outputs: 32, rewards: 1800, score: 9.3 },
  ];
  
  const topToolsWeek = [
    { rank: 1, name: 'Cursor', logo: 'https://picsum.photos/seed/cursor/60/60', score: 4.8, outputs: 120, growth: '+120%' },
    { rank: 2, name: 'Claude 3.5 Sonnet', logo: 'https://picsum.photos/seed/claude/60/60', score: 4.9, outputs: 85, growth: '+85%' },
    { rank: 3, name: 'Midjourney v7', logo: 'https://picsum.photos/seed/midjourney/60/60', score: 4.7, outputs: 72, growth: '+68%' },
  ];
  
  const tabs = [
    { id: 'contributors-all', label: t('leaderboardPage.allTimeContributors'), icon: Medal },
    { id: 'contributors-week', label: t('leaderboardPage.weeklyContributors'), icon: Trophy },
    { id: 'tools-week', label: t('leaderboardPage.weeklyTools'), icon: TrendingUp },
  ];
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-gray-400">{rank}</span>;
  };
  
  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">
            {t('leaderboardPage.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
            {t('leaderboardPage.subtitle')}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white shadow-lg'
                    : 'glass-card text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        {/* Content */}
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          {activeTab === 'contributors-all' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-300">{t('leaderboardPage.loading')}</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400">{t('leaderboardPage.error')}: {error}</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300">{t('leaderboardPage.noUsers')}</p>
                </div>
              ) : (
                leaderboard.map((contributor, index) => (
                  <div
                    key={contributor.id}
                    className="flex items-center gap-6 p-6 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getRankBadge(index + 1)}
                    </div>
                    <img
                      src={contributor.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.id}`}
                      alt={contributor.full_name || contributor.username}
                      className="w-12 h-12 rounded-full"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white mb-1">
                        {contributor.full_name || contributor.username || 'User'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary-cyan mb-1">
                        {(contributor.total_xp || 0).toLocaleString()} XP
                      </div>
                      <div className="text-sm text-gray-400">{t('leaderboardPage.totalXp')}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'contributors-week' && (
            <div className="space-y-4">
              {topContributorsWeek.map((contributor) => (
                <div
                  key={contributor.rank}
                  className="flex items-center gap-6 p-6 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getRankBadge(contributor.rank)}
                  </div>
                  <img
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="w-12 h-12 rounded-full"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white mb-1">
                      {contributor.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500" />
                        {contributor.score}/10 {t('leaderboardPage.avgScore')}
                      </span>
                      <span>{contributor.outputs} {t('leaderboardPage.verifiedOutputs')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-accent-green mb-1">
                      ${contributor.rewards.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">{t('leaderboardPage.totalRewards')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'tools-week' && (
            <div className="space-y-4">
              {topToolsWeek.map((tool) => (
                <div
                  key={tool.rank}
                  className="flex items-center gap-6 p-6 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getRankBadge(tool.rank)}
                  </div>
                  <LazyImage
                    src={tool.logo}
                    alt={tool.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white mb-1">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-current" />
                        {tool.score}
                      </span>
                      <span>{tool.outputs} {t('leaderboardPage.verifiedOutputsWeek')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" size="md">
                      {tool.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
