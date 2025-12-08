import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Star } from 'lucide-react';
import { TOOLS } from '../data';
import { useLanguage } from '../contexts/LanguageContext';

const Rankings: React.FC = () => {
  const { t } = useLanguage();
  const topTools = TOOLS.slice(0, 3);
  const ranks = [
    { class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🏆', label: '1' },
    { class: 'bg-gray-100 text-gray-700 border-gray-200', icon: '', label: '2' },
    { class: 'bg-orange-100 text-orange-800 border-orange-200', icon: '', label: '3' },
  ];

  return (
    <section id="rankings" className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">🏆</span> {t('rankings.title')}
            </h2>
            <p className="text-gray-500 mt-2">{t('rankings.subtitle')}</p>
          </div>
          <span className="text-sm font-medium text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {topTools.map((tool, index) => (
            <div key={tool.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative hover:shadow-lg transition-shadow">
              <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-md ${ranks[index].class}`}>
                {index === 0 ? ranks[index].icon : ranks[index].label}
              </div>
              
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 pl-4">
                  <img src={tool.logo} alt={tool.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-bold justify-end">
                      <Star size={16} fill="currentColor" /> {tool.rating}
                    </div>
                    <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                      {tool.growth}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{tool.category}</p>
                  {tool.useCases && tool.useCases.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tool.useCases.slice(0, 3).map((useCase, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100">
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
                  <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-500" />
                    {tool.reviewCount} {t('rankings.reviewsToday')}
                  </div>
                  <Link 
                    to={`/tool/${tool.id}`}
                    className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors"
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