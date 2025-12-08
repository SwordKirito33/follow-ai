import React from 'react';
import { NEWS } from '../data';
import { Rocket, Zap, TrendingUp, Star } from 'lucide-react';

const NewsWidget: React.FC = () => {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          🔥 Latest AI News
        </h3>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
      </div>

      <div className="space-y-6">
        {NEWS.map((item) => (
          <div key={item.id} className="flex gap-3 group cursor-pointer">
            <div className="mt-1 flex-shrink-0 w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
              {getIcon(item.type)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 rounded-sm 
                  ${item.type === 'launch' ? 'bg-purple-100 text-purple-700' : 
                    item.type === 'update' ? 'bg-amber-100 text-amber-800' :
                    item.type === 'trending' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {item.type}
                </span>
                <span className="text-xs text-gray-400">{item.meta1}</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsWidget;