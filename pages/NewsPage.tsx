import React, { useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { NEWS } from '../data';

const NewsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs: { key: string; label: string; types: string[] }[] = [
    { key: 'all', label: t('news.allNews'), types: ['launch', 'update', 'trending', 'highlight'] },
    { key: 'launch', label: t('news.newLaunches'), types: ['launch'] },
    { key: 'update', label: t('news.updates'), types: ['update'] },
    { key: 'trending', label: t('news.trending'), types: ['trending'] },
    { key: 'community', label: t('news.community'), types: ['highlight'] },
  ];

  const filtered = useMemo(() => {
    const tab = tabs.find(t => t.key === activeTab);
    if (!tab) return NEWS;
    return NEWS.filter(n => tab.types.includes(n.type));
  }, [activeTab]);

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-6xl grid lg:grid-cols-[2fr_1fr] gap-8 relative z-10">
        <div>
          <header className="mb-8 animate-slideDown">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-3xl animate-float">📰</span> <span className="gradient-text">{t('news.title')}</span>
            </h1>
            <p className="text-gray-600">{t('news.subtitle')}</p>
          </header>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'glass-card text-gray-700 hover:bg-white/90'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((item, idx) => (
              <article key={item.id} className="glass-card rounded-xl shadow-xl p-5 flex gap-4 group hover:shadow-2xl transition-all duration-300 card-3d animate-slideUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2">
                  <span className={`px-2 py-1 rounded ${item.type === 'launch' ? 'bg-purple-100 text-purple-700' : item.type === 'update' ? 'bg-amber-100 text-amber-800' : item.type === 'trending' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {item.type}
                  </span>
                  <span className="text-gray-400">{item.meta1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{item.meta2}</span>
                    <span>•</span>
                    <a className="text-blue-600 hover:text-blue-700 font-semibold transition-all transform hover:scale-105" href="/#/submit">Review this</a>
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="glass-card border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500">
                No news in this category yet.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="glass-card rounded-xl shadow-xl p-5 animate-slideUp">
            <h4 className="text-sm font-bold gradient-text mb-2">🔥 {t('news.trendingThisWeek')}</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span># AI Coding</span><span className="text-green-600 font-semibold">+234%</span></div>
              <div className="flex justify-between"><span># Video Gen</span><span className="text-green-600 font-semibold">+180%</span></div>
              <div className="flex justify-between"><span># Voice AI</span><span className="text-green-600 font-semibold">+95%</span></div>
              <div className="flex justify-between"><span># Image Gen</span><span className="text-green-600 font-semibold">+67%</span></div>
            </div>
          </div>
          <div className="glass-card rounded-xl shadow-xl p-5 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-sm font-bold gradient-text mb-2">{t('news.didYouKnow')}</h4>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 hover:shadow-lg transition-all transform hover:scale-105">
                <p className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span>$45,820</span>
                </p>
                <p className="text-sm text-gray-500">{t('news.totalEarned')}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 hover:shadow-lg transition-all transform hover:scale-105">
                <p className="text-3xl font-bold text-gray-900 mb-1">3,458</p>
                <p className="text-sm text-gray-500">{t('news.realReviews')}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsPage;

