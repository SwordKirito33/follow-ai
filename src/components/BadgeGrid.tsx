import React from 'react';
import { BadgeInfo } from '@/lib/level-calculation';
import { useLanguage } from '@/contexts/LanguageContext';

interface BadgeGridProps {
  badges: BadgeInfo[];
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ badges }) => {
  const { t } = useLanguage();
  return (
    <div className="glass-card rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-black text-white mb-6 tracking-tight">{t('badges.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-xl p-4 border-2 transition-all ${
              badge.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                : 'bg-white/5 border-white/10 opacity-50 grayscale'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  badge.unlocked ? 'bg-accent-gold/20' : 'bg-white/10'
                }`}
              >
                {badge.emoji}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${badge.unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {badge.name}
                </h3>
                <p className={`text-sm ${badge.unlocked ? 'text-gray-400' : 'text-gray-400'}`}>
                  Level {badge.level}
                </p>
                {badge.unlocked && (
                  <span className="inline-block mt-2 text-xs font-semibold text-yellow-700 bg-accent-gold/20 px-2 py-1 rounded">
                    ✓ {t('badges.unlocked')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeGrid;

