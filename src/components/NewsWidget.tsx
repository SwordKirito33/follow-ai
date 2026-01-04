import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { NEWS } from '@/data';
import { Rocket, Zap, TrendingUp, Star } from 'lucide-react';

const NewsWidget: React.FC = () => {
  const { t } = useLanguage();
  const getIcon = (type: string) => {
    switch(type) {
      case 'launch': return <Rocket size={16} className="text-purple-500" />;
      case 'update': return <Zap size={16} className="text-amber-500" />;
      case 'trending': return <TrendingUp size={16} className="text-green-500" />;
      case 'highlight': return <Star size={16} className="text-blue-500" />;
      default: return <Zap size={16} />;
    }
  };

  return (
    <div id="news" className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          {t('news.latestNews')}
        </h3>
        <Link to="/news" className="text-xs font-medium text-primary-cyan hover:text-primary-blue">{t('common.viewAll')}</Link>
      </div>

      <div className="space-y-6">
        {NEWS.map((item) => (
          <div key={item.id} className="flex gap-3 group cursor-pointer">
            <div className="mt-1 flex-shrink-0 w-8 h-8 bg-gray-800/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-slate-800/50 group-hover:shadow-sm transition-all">
              {getIcon(item.type)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 rounded-sm 
                  ${item.type === 'launch' ? 'bg-primary-purple/20 text-purple-700' : 
                    item.type === 'update' ? 'bg-amber-100 text-amber-800' :
                    item.type === 'trending' ? 'bg-accent-green/20 text-green-800' : 'bg-primary-blue/20 text-blue-800'}`}>
                  {item.type}
                </span>
                <span className="text-xs text-gray-400">{item.meta1}</span>
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-primary-cyan transition-colors leading-tight mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsWidget;