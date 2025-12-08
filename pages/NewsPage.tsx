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
      <div className="container mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">📰 {t('news.title')}</h1>
          <p className="text-gray-600">{t('news.subtitle')}</p>
        </header>

        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeTab === tab.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            {filtered.map(item => (
              <article key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2">
                  <span className={`px-2 py-1 rounded ${item.type === 'launch' ? 'bg-purple-100 text-purple-700' : item.type === 'update' ? 'bg-amber-100 text-amber-800' : item.type === 'trending' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {item.type}
                  </span>
                  <span className="text-gray-400">{item.meta1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{item.meta2}</span>
                  <span>•</span>
                  <a className="text-blue-600 hover:text-blue-700 font-semibold" href="/#/submit">Review this</a>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-500">
                No news in this category yet.
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-2">🔥 Trending This Week</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between"><span># AI Coding</span><span className="text-green-600 font-semibold">+234%</span></div>
                <div className="flex justify-between"><span># Video Gen</span><span className="text-green-600 font-semibold">+180%</span></div>
                <div className="flex justify-between"><span># Voice AI</span><span className="text-green-600 font-semibold">+95%</span></div>
                <div className="flex justify-between"><span># Image Gen</span><span className="text-green-600 font-semibold">+67%</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-3">💡 Did You Know?</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900">$45,820</div>
                  <p className="text-xs text-gray-500">Total earned by testers this month</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900">3,458</div>
                  <p className="text-xs text-gray-500">Verified reviews with outputs</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;

