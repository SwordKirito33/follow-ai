import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { Achievement } from '../types';

interface Props {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementNotification: React.FC<Props> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Wait for exit animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div 
      className={`fixed top-24 right-4 z-[90] transform transition-all duration-500 ease-out ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl min-w-[320px] flex items-center gap-4 border border-white/20">
        <div className="bg-white/20 p-3 rounded-full">
          <Trophy size={32} className="text-yellow-300" fill="currentColor" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">Achievement Unlocked!</h3>
          <p className="font-bold text-yellow-300 text-md mt-1">{achievement.name}</p>
          <p className="text-xs text-white/80 mt-0.5">{achievement.description}</p>
        </div>
        <div className="ml-auto bg-white/20 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
          +50 XP
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;