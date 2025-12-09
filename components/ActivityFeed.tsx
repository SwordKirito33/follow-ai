import React from 'react';
import { DollarSign, Star, Zap, Trophy, TrendingUp } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const activities = [
    { icon: DollarSign, user: 'Sarah', action: 'just earned', value: '$75', detail: 'reviewing Cursor', time: '2m ago', color: 'text-green-400' },
    { icon: Star, user: 'Jackson', action: 'submitted', value: '9.2/10', detail: 'Midjourney review', time: '5m ago', color: 'text-amber-400' },
    { icon: Zap, user: 'Alex', action: 'completed', value: 'record time', detail: 'a testing task', time: '8m ago', color: 'text-blue-400' },
    { icon: Trophy, user: 'Emma', action: 'reached', value: 'Level 5', detail: 'Expert status', time: '12m ago', color: 'text-purple-400' },
    { icon: TrendingUp, user: 'Mike', action: 'earned', value: '$120', detail: 'top quality review', time: '15m ago', color: 'text-green-400' },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] text-white overflow-hidden py-3 relative border-b border-blue-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-shimmer"></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] animate-[shimmer_3s_ease-in-out_infinite]"></div>
      <div className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto whitespace-nowrap no-scrollbar relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex-shrink-0 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-fast shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          Live Activity
        </span>
        
        <div className="flex items-center gap-8 animate-slide-in">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-sm flex-shrink-0">
                <Icon size={14} className={activity.color} />
                <span className="text-gray-300">
                  <strong className="text-white font-semibold">{activity.user}</strong> {activity.action}{' '}
                  <span className={activity.color + ' font-bold'}>{activity.value}</span> {activity.detail}
                </span>
                <span className="text-xs text-gray-500 ml-1">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;