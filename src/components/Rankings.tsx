import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Star } from 'lucide-react';
import { TOOLS } from '@/data';
import { useLanguage } from '@/contexts/LanguageContext';

const Rankings: React.FC = () => {
  const { t } = useLanguage();
  const topTools = TOOLS.slice(0, 3);
  const ranks = [
    { class: 'bg-accent-gold/20 text-yellow-700 border-yellow-200', icon: '🏆', label: '1' },
    { class: 'bg-slate-800/50/10 text-gray-300 border-white/10', icon: '', label: '2' },
    { class: 'bg-orange-100 text-orange-800 border-orange-200', icon: '', label: '3' },
  ];

  return (
    <section id="rankings" className="py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 animate-slideDown">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
              <span className="text-3xl animate-float">🏆</span> <span className="gradient-text">{t('rankings.title')}</span>
            </h2>
            <p className="text-gray-400 mt-2 font-medium">{t('rankings.subtitle')}</p>
          </div>
          <span className="glass-card text-sm font-medium text-gray-400 px-4 py-2 rounded-full shadow-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {topTools.map((tool, index) => (
            <div key={tool.id} className="glass-card rounded-xl p-6 relative card-3d hover:shadow-2xl transition-all duration-300 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`absolute -top-4 -left-4 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-xl bg-gradient-to-br ${index === 0 ? 'from-yellow-400 to-yellow-600 text-white' : index === 1 ? 'from-gray-300 to-gray-500 text-white' : 'from-orange-400 to-orange-600 text-white'} transform hover:scale-110 transition-transform animate-float`} style={{ animationDelay: `${index * 0.2}s` }}>
                {index === 0 ? ranks[index].icon : ranks[index].label}
              </div>
              
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 pl-4">
                  <img loading="lazy" src={tool.logo} alt={tool.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-bold justify-end">
                      <Star size={16} fill="currentColor" /> {tool.rating}
                    </div>
                    <div className="text-xs text-accent-green font-medium bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                      {tool.growth}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-black text-white mb-1 tracking-tight">{tool.name}</h3>
                  <p className="text-sm font-medium text-gray-400 mb-2">{tool.category}</p>
                  {tool.useCases && tool.useCases.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tool.useCases.slice(0, 3).map((useCase, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-primary-blue rounded-full font-medium border border-blue-100">
                          {useCase}
                        </span>
                      ))}
                      {tool.useCases.length > 3 && (
                        <span className="text-xs text-gray-400">+{tool.useCases.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-500" />
                    {tool.reviewCount} {t('rankings.reviewsToday')}
                  </div>
                  <Link 
                    to={`/tool/${tool.id}`}
                    className="block w-full text-center bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium py-2.5 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {t('rankings.reviewAndEarn')} ${50 - (index * 5)}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rankings;