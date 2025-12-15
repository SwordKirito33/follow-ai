import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Star, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Badge from '../components/ui/Badge';
import LazyImage from '../components/LazyImage';

const Leaderboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'contributors-week' | 'contributors-all' | 'tools-week'>('contributors-week');
  
  // Mock data - replace with real data from API
  const topContributorsWeek = [
    { rank: 1, name: 'Alex Chen', avatar: 'https://picsum.photos/seed/alex/40/40', outputs: 47, rewards: 2850, score: 9.8 },
    { rank: 2, name: 'Sarah Johnson', avatar: 'https://picsum.photos/seed/sarah/40/40', outputs: 42, rewards: 2400, score: 9.6 },
    { rank: 3, name: 'Mike Zhang', avatar: 'https://picsum.photos/seed/mike/40/40', outputs: 38, rewards: 2100, score: 9.5 },
    { rank: 4, name: 'Emma Wilson', avatar: 'https://picsum.photos/seed/emma/40/40', outputs: 35, rewards: 1950, score: 9.4 },
    { rank: 5, name: 'David Lee', avatar: 'https://picsum.photos/seed/david/40/40', outputs: 32, rewards: 1800, score: 9.3 },
  ];
  
  const topContributorsAll = [
    { rank: 1, name: 'Alex Chen', avatar: 'https://picsum.photos/seed/alex/40/40', outputs: 247, rewards: 12850, score: 9.8 },
    { rank: 2, name: 'Sarah Johnson', avatar: 'https://picsum.photos/seed/sarah/40/40', outputs: 198, rewards: 10200, score: 9.6 },
    { rank: 3, name: 'Mike Zhang', avatar: 'https://picsum.photos/seed/mike/40/40', outputs: 175, rewards: 9100, score: 9.5 },
  ];
  
  const topToolsWeek = [
    { rank: 1, name: 'Cursor', logo: 'https://picsum.photos/seed/cursor/60/60', score: 4.8, outputs: 120, growth: '+120%' },
    { rank: 2, name: 'Claude 3.5 Sonnet', logo: 'https://picsum.photos/seed/claude/60/60', score: 4.9, outputs: 85, growth: '+85%' },
    { rank: 3, name: 'Midjourney v7', logo: 'https://picsum.photos/seed/midjourney/60/60', score: 4.7, outputs: 72, growth: '+68%' },
  ];
  
  const tabs = [
    { id: 'contributors-week', label: 'Top Contributors (Week)', icon: Trophy },
    { id: 'contributors-all', label: 'All-Time Top Contributors', icon: Medal },
    { id: 'tools-week', label: 'Top Tools (Week)', icon: TrendingUp },
  ];
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400">{rank}</span>;
  };
  
  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            See who's leading the AI tool benchmark and earning the most rewards
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
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
          {activeTab === 'contributors-week' && (
            <div className="space-y-4">
              {topContributorsWeek.map((contributor) => (
                <div
                  key={contributor.rank}
                  className="flex items-center gap-6 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getRankBadge(contributor.rank)}
                  </div>
                  <img
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
                      {contributor.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500" />
                        {contributor.score}/10 avg score
                      </span>
                      <span>{contributor.outputs} verified outputs</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-green-600 dark:text-green-400 mb-1">
                      ${contributor.rewards.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total rewards</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'contributors-all' && (
            <div className="space-y-4">
              {topContributorsAll.map((contributor) => (
                <div
                  key={contributor.rank}
                  className="flex items-center gap-6 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getRankBadge(contributor.rank)}
                  </div>
                  <img
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
                      {contributor.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500" />
                        {contributor.score}/10 avg score
                      </span>
                      <span>{contributor.outputs} verified outputs</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-green-600 dark:text-green-400 mb-1">
                      ${contributor.rewards.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">All-time rewards</div>
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
                  className="flex items-center gap-6 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-current" />
                        {tool.score}
                      </span>
                      <span>{tool.outputs} verified outputs this week</span>
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

