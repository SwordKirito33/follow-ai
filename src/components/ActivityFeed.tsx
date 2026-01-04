import React from 'react';
import { DollarSign, Star, Zap, Trophy, TrendingUp, Award, Target, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ActivityFeed: React.FC = () => {
  const { t } = useLanguage();
  const activities = [
    { icon: DollarSign, user: 'Sarah', action: 'just earned', value: '$75', detail: 'reviewing Cursor', time: '2m ago', color: 'text-green-400' },
    { icon: Star, user: 'Jackson', action: 'submitted', value: '9.2/10', detail: 'Midjourney review', time: '5m ago', color: 'text-amber-400' },
    { icon: Zap, user: 'Alex', action: 'completed', value: 'record time', detail: 'a testing task', time: '8m ago', color: 'text-blue-400' },
    { icon: Trophy, user: 'Emma', action: 'reached', value: 'Level 5', detail: 'Expert status', time: '12m ago', color: 'text-purple-400' },
    { icon: TrendingUp, user: 'Mike', action: 'earned', value: '$120', detail: 'top quality review', time: '15m ago', color: 'text-green-400' },
    { icon: Award, user: 'Lisa', action: 'won', value: 'Badge', detail: 'First Review', time: '18m ago', color: 'text-cyan-400' },
    { icon: Target, user: 'David', action: 'hit', value: '100%', detail: 'accuracy score', time: '22m ago', color: 'text-emerald-400' },
    { icon: Flame, user: 'Sophie', action: 'on', value: '7-day', detail: 'streak', time: '25m ago', color: 'text-orange-400' },
  ];

  // Duplicate activities for seamless loop
  const duplicatedActivities = [...activities, ...activities];

  return (
    <div className="w-full bg-gradient-to-r from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] text-white overflow-hidden py-3 relative border-b border-blue-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 flex items-center gap-6 relative z-10">
        {/* Live Activity Label - Fixed */}
        <span className="text-xs font-black uppercase tracking-widest text-blue-300 flex-shrink-0 flex items-center gap-2 z-20 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f] to-transparent pr-4">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_12px_rgba(59,130,246,1)]"></span>
          Live Activity
        </span>
        
        {/* Scrolling Container */}
        <div className="overflow-hidden flex-1 relative">
          {/* Gradient masks for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling content - Right to Left */}
          <div className="flex items-center gap-8 animate-scroll-rtl whitespace-nowrap">
            {duplicatedActivities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 text-sm flex-shrink-0 hover:scale-105 transition-transform cursor-default"
                >
                  <Icon size={14} className={activity.color} />
                  <span className="text-gray-300">
                    <strong className="text-white font-semibold">{activity.user}</strong> {activity.action}{' '}
                    <span className={activity.color + ' font-bold'}>{activity.value}</span> {activity.detail}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-rtl {
          animation: scroll-rtl 30s linear infinite;
        }
        
        .animate-scroll-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;