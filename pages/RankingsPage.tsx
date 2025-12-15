import React, { useState, lazy, Suspense } from 'react';
import { TOOLS } from '../data';
import { Star, TrendingUp, Trophy, GitCompare, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SearchBar from '../components/SearchBar';
import ToolComparison from '../components/ToolComparison';
import ToolCard from '../components/ToolCard';
import Button from '../components/ui/Button';
import LazyImage from '../components/LazyImage';

// Lazy load heavy components
const LazyToolComparison = lazy(() => import('../components/ToolComparison'));

const RankingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState<any>({});
  
  const extendedTools = [
    ...TOOLS,
    {
      id: 'runway',
      name: 'Runway Gen-3',
      category: 'Video Gen',
      logo: 'https://picsum.photos/seed/runway/60/60',
      rating: 4.6,
      reviewCount: 29,
      growth: '+68%',
      description: 'AI video generation with control.',
      useCases: ['Video Editing', 'Motion Graphics', 'Commercials', 'Social Media']
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT 4o',
      category: 'AI Assistant',
      logo: 'https://picsum.photos/seed/chatgpt/60/60',
      rating: 4.9,
      reviewCount: 55,
      growth: '+32%',
      description: 'Multimodal general assistant.',
      useCases: ['Writing', 'Coding', 'Analysis', 'Translation', 'Tutoring']
    }
  ];

  const badgeClasses = ['bg-yellow-100 text-yellow-800', 'bg-gray-100 text-gray-700', 'bg-orange-100 text-orange-800'];

  // Filter tools based on search and filters
  const filteredTools = extendedTools.filter(tool => {
    if (searchQuery && !tool.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tool.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.category && tool.category !== filters.category) return false;
    if (filters.minRating && tool.rating < filters.minRating) return false;
    if (filters.useCase && tool.useCases && !tool.useCases.includes(filters.useCase)) return false;
    return true;
  });

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-6xl space-y-10 relative z-10">
        {/* Search and Compare */}
        <div className="space-y-4 animate-slideDown">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <SearchBar 
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                showAdvanced={true}
              />
            </div>
            <button
              onClick={() => setShowComparison(true)}
              className="flex items-center gap-2 glass-card px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <GitCompare size={20} />
              {t('common.compare')}
            </button>
          </div>
        </div>

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slideDown">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
              <span className="text-4xl animate-float">🏆</span> <span className="gradient-text">{t('rankingsPage.title')}</span>
            </h1>
            <p className="text-gray-600 mt-2 font-medium">{t('rankingsPage.subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[t('rankingsPage.today'), t('rankingsPage.thisWeek'), t('rankingsPage.thisMonth'), t('rankingsPage.allTime')].map((label, idx) => (
              <button key={label} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all transform hover:scale-105 ${idx === 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg' : 'glass-card text-gray-700 border-white/30 hover:bg-white/90'}`}>
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* Tools Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              tool={{
                ...tool,
                hasBounty: index < 3,
                bountyAmount: index < 3 ? 50 + (index * 10) : undefined
              }}
              rank={index < 3 ? index + 1 : undefined}
            />
          ))}
        </section>
        
        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              No tools found matching your filters.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilters({});
              }}
              variant="secondary"
            >
              Clear Filters
            </Button>
          </div>
        )}

        <section className="glass-card rounded-2xl shadow-xl p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold gradient-text">{t('rankingsPage.dailyTop10')}</h2>
              <p className="text-sm text-gray-500">{t('rankingsPage.updatedHourly')}</p>
            </div>
            <span className="text-xs text-gray-600 glass-card px-3 py-1 rounded-full animate-pulse">{t('rankingsPage.live')}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500">
                <tr className="border-b">
                  <th className="py-2 pr-4">{t('rankingsPage.rank')}</th>
                  <th className="py-2 pr-4">{t('rankingsPage.tool')}</th>
                  <th className="py-2 pr-4">{t('rankingsPage.category')}</th>
                  <th className="py-2 pr-4">{t('rankingsPage.reviews24h')}</th>
                  <th className="py-2 pr-4">{t('rankingsPage.avgRating')}</th>
                  <th className="py-2 pr-4">{t('rankingsPage.growth')}</th>
                  <th className="py-2 pr-4 text-right">{t('rankingsPage.action')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      {t('search.noResults')}
                    </td>
                  </tr>
                ) : (
                  filteredTools.map((tool, idx) => (
                  <tr key={tool.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-800' : idx === 1 ? 'bg-gray-100 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-50 text-gray-600'}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <LazyImage src={tool.logo} alt={tool.name} className="w-8 h-8 rounded" />
                        <div>
                          <div className="font-semibold text-gray-900">{tool.name}</div>
                          <div className="text-xs text-gray-500">{t('rankingsPage.validated')}</div>
                          {tool.useCases && tool.useCases.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {tool.useCases.slice(0, 3).map((useCase, idx) => (
                                <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">
                                  {useCase}
                                </span>
                              ))}
                              {tool.useCases.length > 3 && (
                                <span className="text-[10px] text-gray-400">+{tool.useCases.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{tool.category}</td>
                    <td className="py-3 pr-4 text-gray-900 font-semibold">{tool.reviewCount}</td>
                    <td className="py-3 pr-4 text-gray-900 font-semibold">⭐ {tool.rating}</td>
                    <td className="py-3 pr-4">
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <TrendingUp size={14} /> {tool.growth}
                      </span>
                    </td>
                    <td className="py-3 pr-0 text-right">
                      <Link to={`/tool/${tool.id}`} className="inline-block px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">
                        {t('rankingsPage.review')}
                      </Link>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      
      {/* Comparison Modal - Lazy Loaded */}
      {showComparison && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="text-white">Loading...</div></div>}>
          <LazyToolComparison
            isOpen={showComparison}
            onClose={() => setShowComparison(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default RankingsPage;

