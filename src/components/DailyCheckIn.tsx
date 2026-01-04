import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Gift, Flame, Star, Check, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckInDay {
  day: number;
  xpReward: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  bonusReward?: string;
}

interface DailyCheckInProps {
  currentStreak: number;
  totalCheckIns: number;
  lastCheckIn?: Date;
  onCheckIn: () => Promise<{ xp: number; streak: number; bonus?: string }>;
  className?: string;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  currentStreak,
  totalCheckIns,
  lastCheckIn,
  onCheckIn,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<{ xp: number; streak: number; bonus?: string } | null>(null);

  // Check if already checked in today
  useEffect(() => {
    if (lastCheckIn) {
      const today = new Date().toDateString();
      const lastCheckInDate = new Date(lastCheckIn).toDateString();
      setIsCheckedInToday(today === lastCheckInDate);
    }
  }, [lastCheckIn]);

  // Generate week days
  const generateWeekDays = (): CheckInDay[] => {
    const days: CheckInDay[] = [];
    const streakDay = currentStreak % 7 || 7;
    
    for (let i = 1; i <= 7; i++) {
      const isCompleted = i < streakDay || (i === streakDay && isCheckedInToday);
      const isCurrent = i === streakDay && !isCheckedInToday;
      const isLocked = i > streakDay;
      
      // XP rewards increase each day
      const baseXP = 10;
      const xpReward = baseXP * i;
      
      // Day 7 has bonus reward
      const bonusReward = i === 7 ? '🎁 Mystery Box' : undefined;
      
      days.push({
        day: i,
        xpReward,
        isCompleted,
        isCurrent,
        isLocked,
        bonusReward,
      });
    }
    
    return days;
  };

  const weekDays = generateWeekDays();

  const handleCheckIn = async () => {
    if (isCheckedInToday || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await onCheckIn();
      setRewardData(result);
      setIsCheckedInToday(true);
      setShowReward(true);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Check-in button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative group ${className}`}
      >
        <div className={`
          p-3 rounded-xl transition-all
          ${isCheckedInToday 
            ? 'bg-accent-green/20 dark:bg-green-900/30 text-accent-green' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
          }
        `}>
          {isCheckedInToday ? (
            <Check className="w-5 h-5" />
          ) : (
            <Gift className="w-5 h-5" />
          )}
        </div>
        
        {/* Streak badge */}
        {currentStreak > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {currentStreak}
          </div>
        )}
        
        {/* Pulse animation for unchecked */}
        {!isCheckedInToday && (
          <span className="absolute inset-0 rounded-xl bg-blue-500 animate-ping opacity-25" />
        )}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-blue to-primary-purple p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      Daily Check-In
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Check in daily to earn XP rewards!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-800/50/20 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold">{currentStreak}</p>
                      <p className="text-xs text-blue-100">Day Streak</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold">{totalCheckIns}</p>
                      <p className="text-xs text-blue-100">Total Check-ins</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Week calendar */}
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => (
                    <div
                      key={day.day}
                      className={`
                        relative p-3 rounded-xl text-center transition-all
                        ${day.isCompleted 
                          ? 'bg-accent-green/20 dark:bg-green-900/30 text-accent-green' 
                          : day.isCurrent
                            ? 'bg-primary-blue/20 dark:bg-blue-900/30 text-primary-cyan ring-2 ring-blue-500'
                            : 'bg-slate-800/50/10 dark:bg-gray-800 text-gray-400'
                        }
                      `}
                    >
                      <p className="text-xs font-medium mb-1">Day {day.day}</p>
                      <p className="text-lg font-bold">
                        {day.isCompleted ? (
                          <Check className="w-5 h-5 mx-auto" />
                        ) : day.isLocked ? (
                          <Lock className="w-4 h-4 mx-auto" />
                        ) : (
                          `+${day.xpReward}`
                        )}
                      </p>
                      {day.bonusReward && (
                        <div className="absolute -top-2 -right-2">
                          <Gift className="w-4 h-4 text-purple-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Check-in button */}
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckedInToday || isLoading}
                  className={`
                    w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                    ${isCheckedInToday
                      ? 'bg-slate-800/50/10 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-blue to-primary-purple text-white hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : isCheckedInToday ? (
                    <>
                      <Check className="w-5 h-5" />
                      Already Checked In Today
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Check In Now
                    </>
                  )}
                </button>

                {/* Streak bonus info */}
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Flame className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white dark:text-white">
                        Streak Bonus
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-400">
                        Keep your streak going! 7-day streak = Mystery Box + 2x XP
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reward popup */}
      <AnimatePresence>
        {showReward && rewardData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReward(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              className="relative bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">
                Check-In Complete!
              </h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-primary-cyan mb-2"
              >
                +{rewardData.xp} XP
              </motion.div>

              <p className="text-gray-400 dark:text-gray-400 mb-4">
                🔥 {rewardData.streak} day streak!
              </p>

              {rewardData.bonus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 bg-primary-purple/20 dark:bg-purple-900/30 rounded-xl text-primary-purple font-semibold"
                >
                  🎁 Bonus: {rewardData.bonus}
                </motion.div>
              )}

              <button
                onClick={() => setShowReward(false)}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DailyCheckIn;
