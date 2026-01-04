import React from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { LevelInfo } from '@/lib/level-calculation';

interface LevelProgressProps {
  levelInfo: LevelInfo;
  currentXp: number;
  totalXp: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  levelInfo,
  currentXp,
  totalXp,
}) => {
  const progressPercentage = Math.round(levelInfo.progress * 100);

  return (
    <div className="glass-card rounded-xl shadow-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-purple/20 p-3 rounded-lg text-primary-purple">
          <Award size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Level Progress</h2>
          <p className="text-sm text-gray-400">Current Level: {levelInfo.level}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Level {levelInfo.level}</span>
          <span>Level {levelInfo.level + 1}</span>
        </div>
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-purple to-primary-blue transition-all duration-700 ease-out flex items-center justify-end pr-2"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && (
              <span className="text-xs font-semibold text-white">{progressPercentage}%</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
          <span>{levelInfo.xpInCurrentLevel.toLocaleString()} XP in current level</span>
          <span>{levelInfo.xpToNext.toLocaleString()} XP to next level</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs">Current Level</span>
          </div>
          <div className="text-2xl font-bold text-white">{levelInfo.level}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Award size={16} />
            <span className="text-xs">Total XP</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalXp.toLocaleString()}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Current Level XP</div>
          <div className="text-2xl font-bold text-white">{currentXp.toLocaleString()}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">XP to Next</div>
          <div className="text-2xl font-bold text-primary-cyan">{levelInfo.xpToNext.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;

