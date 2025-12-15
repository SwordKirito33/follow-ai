import React, { useState } from 'react';
import { TOOLS } from '../data';
import { Star, TrendingUp, Trophy, GitCompare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SearchBar from '../components/SearchBar';
import ToolComparison from '../components/ToolComparison';

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

        <section className="grid lg:grid-cols-3 gap-6">
          {extendedTools.slice(0, 3).map((tool, index) => (
            <div key={tool.id} className="glass-card rounded-xl p-6 relative card-3d hover:shadow-2xl transition-all duration-300 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-md ${badgeClasses[index] || badgeClasses[0]}`}>
                {index === 0 ? '🏆' : index + 1}
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={tool.logo} alt={tool.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-500">{tool.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-bold justify-end">
                    <Star size={16} fill="currentColor" /> {tool.rating}
                  </div>
                  <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                    {tool.growth}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">Use Cases:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.useCases.map((useCase, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Trophy size={16} className="text-blue-500" /> {tool.reviewCount} reviews today
                </span>
                <Link to={`/tool/${tool.id}`} className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold hover:from-gray-800 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg">
                  Review & Earn ${50 - index * 5}
                </Link>
              </div>
            </div>
          ))}
        </section>

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
                        <img src={tool.logo} alt={tool.name} className="w-8 h-8 rounded" />
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
      
      {/* Comparison Modal */}
      <ToolComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
};

export default RankingsPage;

