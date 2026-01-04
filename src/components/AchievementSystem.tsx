import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Star, Zap, Target, Award, Crown, Gem, Shield, Flame } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'tasks' | 'xp' | 'social' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  totalXPFromAchievements: number;
  className?: string;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  totalXPFromAchievements,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: <Trophy className="w-4 h-4" /> },
    { id: 'tasks', name: 'Tasks', icon: <Target className="w-4 h-4" /> },
    { id: 'xp', name: 'XP', icon: <Zap className="w-4 h-4" /> },
    { id: 'social', name: 'Social', icon: <Star className="w-4 h-4" /> },
    { id: 'streak', name: 'Streak', icon: <Flame className="w-4 h-4" /> },
    { id: 'special', name: 'Special', icon: <Gem className="w-4 h-4" /> },
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
  };

  const rarityBgColors = {
    common: 'bg-slate-800/50/10 dark:bg-gray-800',
    rare: 'bg-blue-50 dark:bg-blue-900/20',
    epic: 'bg-purple-50 dark:bg-purple-900/20',
    legendary: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
  };

  const rarityTextColors = {
    common: 'text-gray-400 dark:text-gray-400',
    rare: 'text-primary-cyan dark:text-blue-400',
    epic: 'text-primary-purple dark:text-purple-400',
    legendary: 'text-accent-gold dark:text-yellow-400',
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      trophy: <Trophy className="w-6 h-6" />,
      star: <Star className="w-6 h-6" />,
      zap: <Zap className="w-6 h-6" />,
      target: <Target className="w-6 h-6" />,
      award: <Award className="w-6 h-6" />,
      crown: <Crown className="w-6 h-6" />,
      gem: <Gem className="w-6 h-6" />,
      shield: <Shield className="w-6 h-6" />,
      flame: <Flame className="w-6 h-6" />,
    };
    return icons[iconName] || <Trophy className="w-6 h-6" />;
  };

  const filteredAchievements = achievements.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const completionPercentage = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className={`bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Achievements
          </h2>
          <div className="text-right">
            <p className="text-2xl font-bold text-white dark:text-white">
              {unlockedCount}/{achievements.length}
            </p>
            <p className="text-sm text-gray-400">Unlocked</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400 dark:text-gray-400">Completion</span>
            <span className="font-medium text-white dark:text-white">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-slate-800/50/10 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
          </div>
        </div>

        {/* Total XP earned */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 dark:text-gray-400">Total XP from Achievements</span>
            <span className="text-xl font-bold text-primary-cyan dark:text-blue-400">
              +{totalXPFromAchievements.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="p-4 border-b border-white/10 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all
                ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white'
                  : 'bg-slate-800/50/10 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-slate-800/50/10 dark:hover:bg-gray-700'
                }
              `}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <motion.button
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-xl text-left transition-all
                ${achievement.isUnlocked
                  ? rarityBgColors[achievement.rarity]
                  : 'bg-slate-800/50/10 dark:bg-gray-800 opacity-60'
                }
                ${achievement.rarity === 'legendary' && achievement.isUnlocked ? 'ring-2 ring-yellow-400' : ''}
              `}
            >
              {/* Rarity indicator */}
              <div className={`
                absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium
                ${rarityTextColors[achievement.rarity]}
              `}>
                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
              </div>

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  ${achievement.isUnlocked
                    ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white`
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-400'
                  }
                `}>
                  {achievement.isUnlocked ? (
                    getIcon(achievement.icon)
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold truncate ${
                    achievement.isUnlocked
                      ? 'text-white dark:text-white'
                      : 'text-gray-400 dark:text-gray-300'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-400 dark:text-gray-300 line-clamp-2 mt-0.5">
                    {achievement.description}
                  </p>

                  {/* Progress */}
                  {!achievement.isUnlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400 dark:text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* XP reward */}
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className={achievement.isUnlocked ? 'text-accent-green' : 'text-gray-400'}>
                      {achievement.isUnlocked ? 'Earned' : ''} +{achievement.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header with gradient */}
              <div className={`
                p-6 text-center
                ${selectedAchievement.isUnlocked
                  ? `bg-gradient-to-br ${rarityColors[selectedAchievement.rarity]}`
                  : 'bg-gray-400'
                }
              `}>
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-800/50/20 rounded-2xl flex items-center justify-center text-white">
                  {selectedAchievement.isUnlocked ? (
                    getIcon(selectedAchievement.icon)
                  ) : (
                    <Lock className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedAchievement.name}
                </h3>
                <p className="text-white/80 mt-1 capitalize">
                  {selectedAchievement.rarity} Achievement
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-400 dark:text-gray-400 text-center mb-4">
                  {selectedAchievement.description}
                </p>

                {/* Progress or completion */}
                {selectedAchievement.isUnlocked ? (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <p className="text-accent-green font-semibold flex items-center justify-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Unlocked!
                    </p>
                    {selectedAchievement.unlockedAt && (
                      <p className="text-sm text-green-500 mt-1">
                        {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-800/50/10 dark:bg-gray-800 rounded-xl">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-white dark:text-white">
                        {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* XP reward */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-between">
                  <span className="text-gray-400 dark:text-gray-400">XP Reward</span>
                  <span className="text-xl font-bold text-primary-cyan dark:text-blue-400">
                    +{selectedAchievement.xpReward} XP
                  </span>
                </div>

                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="w-full mt-4 py-3 bg-slate-800/50/10 dark:bg-gray-800 text-gray-300 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-800/50/10 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementSystem;
