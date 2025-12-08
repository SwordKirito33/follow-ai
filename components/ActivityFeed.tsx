import React from 'react';

const ActivityFeed: React.FC = () => {
  return (
    <div className="w-full bg-gray-900 text-white overflow-hidden py-3">
      <div className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto whitespace-nowrap no-scrollbar">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex-shrink-0">Live Activity</span>
        
        <div className="flex items-center gap-8 animate-slide-in">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-fast"></span>
            <span className="text-gray-300"><strong className="text-white">Sarah</strong> just earned <span className="text-green-400">$75</span> reviewing Cursor</span>
            <span className="text-xs text-gray-500 ml-1">2m ago</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-fast"></span>
            <span className="text-gray-300"><strong className="text-white">Jackson</strong> submitted Midjourney review (9.2/10)</span>
            <span className="text-xs text-gray-500 ml-1">5m ago</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-fast"></span>
            <span className="text-gray-300"><strong className="text-white">Alex</strong> completed a task in record time</span>
            <span className="text-xs text-gray-500 ml-1">8m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;