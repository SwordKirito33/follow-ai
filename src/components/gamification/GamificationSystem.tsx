import React, { useState, useEffect } from 'react';

// =====================================================
// 游戏化系统组件
// 任务: 191-220 游戏化相关任务
// =====================================================

// =====================================================
// 每日任务组件
// =====================================================

interface DailyTask {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  type: 'login' | 'review' | 'task' | 'social' | 'streak';
}

interface DailyTasksProps {
  tasks: DailyTask[];
  onClaim: (taskId: string) => Promise<void>;
  resetTime: Date;
}

export const DailyTasks: React.FC<DailyTasksProps> = ({
  tasks,
  onClaim,
  resetTime
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = resetTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('已重置');
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [resetTime]);

  const handleClaim = async (taskId: string) => {
    setClaiming(taskId);
    try {
      await onClaim(taskId);
    } finally {
      setClaiming(null);
    }
  };

  const getTaskIcon = (type: DailyTask['type']) => {
    const icons = {
      login: '🔑',
      review: '⭐',
      task: '✅',
      social: '👥',
      streak: '🔥'
    };
    return icons[type];
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalXP = tasks.reduce((sum, t) => sum + (t.completed ? t.xpReward : 0), 0);

  return (
    <div className="space-y-6">
      {/* 头部统计 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">每日任务</h3>
          <p className="text-sm text-muted-foreground">
            已完成 {completedCount}/{tasks.length} · 获得 {totalXP} XP
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">重置倒计时</p>
          <p className="font-mono text-lg text-primary">{timeLeft}</p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / tasks.length) * 100}%` }}
        />
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`
              flex items-center gap-4 p-4 rounded-lg border transition-all
              ${task.completed ? 'border-green-500/30 bg-green-500/5' : 'border-border'}
            `}
          >
            <div className="text-2xl">{getTaskIcon(task.type)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{task.title}</h4>
                {task.completed && (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              {!task.completed && task.target > 1 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>进度</span>
                    <span>{task.progress}/{task.target}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(task.progress / task.target) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary">+{task.xpReward} XP</p>
              {task.progress >= task.target && !task.completed && (
                <button
                  onClick={() => handleClaim(task.id)}
                  disabled={claiming === task.id}
                  className="mt-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {claiming === task.id ? '...' : '领取'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// 连续签到组件
// =====================================================

interface StreakCalendarProps {
  currentStreak: number;
  longestStreak: number;
  checkedDays: Date[];
  rewards: Array<{
    day: number;
    xp: number;
    bonus?: string;
  }>;
  onCheckIn: () => Promise<void>;
  hasCheckedToday: boolean;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  currentStreak,
  longestStreak,
  checkedDays,
  rewards,
  onCheckIn,
  hasCheckedToday
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckIn = async () => {
    setIsChecking(true);
    try {
      await onCheckIn();
    } finally {
      setIsChecking(false);
    }
  };

  // 获取当前周的日期
  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const isChecked = (date: Date) => {
    return checkedDays.some(d => 
      d.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      {/* 签到统计 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-primary">{currentStreak}</p>
          <p className="text-sm text-muted-foreground">当前连续</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{longestStreak}</p>
          <p className="text-sm text-muted-foreground">最长连续</p>
        </div>
      </div>

      {/* 本周日历 */}
      <div>
        <h4 className="font-medium text-foreground mb-3">本周签到</h4>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            const checked = isChecked(date);
            const today = isToday(date);
            const isPast = date < new Date() && !today;

            return (
              <div key={index} className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{dayNames[index]}</p>
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center mx-auto
                    ${checked ? 'bg-primary text-primary-foreground' : ''}
                    ${today && !checked ? 'border-2 border-primary' : ''}
                    ${!checked && !today ? 'bg-muted text-muted-foreground' : ''}
                    ${isPast && !checked ? 'opacity-50' : ''}
                  `}
                >
                  {checked ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    date.getDate()
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 签到按钮 */}
      <button
        onClick={handleCheckIn}
        disabled={hasCheckedToday || isChecking}
        className={`
          w-full py-4 rounded-xl font-semibold text-lg transition-all
          ${hasCheckedToday
            ? 'bg-green-500/10 text-green-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-purple-500 text-white hover:opacity-90'
          }
        `}
      >
        {isChecking ? '签到中...' : hasCheckedToday ? '✓ 今日已签到' : '立即签到'}
      </button>

      {/* 连续签到奖励 */}
      <div>
        <h4 className="font-medium text-foreground mb-3">连续签到奖励</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {rewards.map((reward, index) => {
            const unlocked = currentStreak >= reward.day;
            return (
              <div
                key={index}
                className={`
                  flex-shrink-0 w-20 p-3 rounded-lg text-center
                  ${unlocked ? 'bg-primary/10 border border-primary/30' : 'bg-muted'}
                `}
              >
                <p className="text-xs text-muted-foreground">第{reward.day}天</p>
                <p className={`font-bold ${unlocked ? 'text-primary' : 'text-foreground'}`}>
                  {reward.xp} XP
                </p>
                {reward.bonus && (
                  <p className="text-xs text-yellow-500 mt-1">{reward.bonus}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// 成就系统组件
// =====================================================

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'social' | 'task' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  onClaim: (achievementId: string) => Promise<void>;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  onClaim
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [claiming, setClaiming] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'beginner', name: '新手' },
    { id: 'social', name: '社交' },
    { id: 'task', name: '任务' },
    { id: 'special', name: '特殊' }
  ];

  const rarityColors = {
    common: 'text-gray-400 border-gray-500/30 bg-gray-800/50/10',
    rare: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
    epic: 'text-purple-500 border-purple-500/30 bg-purple-500/10',
    legendary: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10'
  };

  const rarityNames = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  };

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  const handleClaim = async (id: string) => {
    setClaiming(id);
    try {
      await onClaim(id);
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">成就</h3>
          <p className="text-sm text-muted-foreground">
            已解锁 {unlockedCount}/{achievements.length} · 获得 {totalXP} XP
          </p>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 成就列表 */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`
              relative p-4 rounded-lg border transition-all
              ${achievement.unlocked
                ? `${rarityColors[achievement.rarity]} border`
                : 'border-border bg-muted/30'
              }
            `}
          >
            {/* 稀有度标签 */}
            <span className={`
              absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium
              ${rarityColors[achievement.rarity]}
            `}>
              {rarityNames[achievement.rarity]}
            </span>

            <div className="flex gap-4">
              {/* 图标 */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                ${achievement.unlocked ? 'bg-background/50' : 'bg-muted grayscale'}
              `}>
                {achievement.icon}
              </div>

              {/* 信息 */}
              <div className="flex-1">
                <h4 className={`font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {achievement.description}
                </p>

                {/* 进度 */}
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>进度</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 奖励 */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-primary">+{achievement.xpReward} XP</span>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="text-xs text-muted-foreground">
                      {achievement.unlockedAt.toLocaleDateString('zh-CN')}
                    </span>
                  )}
                  {achievement.progress >= achievement.target && !achievement.unlocked && (
                    <button
                      onClick={() => handleClaim(achievement.id)}
                      disabled={claiming === achievement.id}
                      className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      {claiming === achievement.id ? '...' : '领取'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// 等级进度组件
// =====================================================

interface LevelProgressProps {
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  xpInCurrentLevel: number;
  perks: Array<{
    level: number;
    name: string;
    description: string;
    unlocked: boolean;
  }>;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  currentXP,
  totalXP,
  xpToNextLevel,
  xpInCurrentLevel,
  perks
}) => {
  const progress = (xpInCurrentLevel / xpToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* 等级显示 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white mb-4">
          <div>
            <p className="text-xs opacity-80">LEVEL</p>
            <p className="text-3xl font-bold">{level}</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-foreground">{totalXP.toLocaleString()} XP</p>
        <p className="text-sm text-muted-foreground">
          距离下一级还需 {(xpToNextLevel - xpInCurrentLevel).toLocaleString()} XP
        </p>
      </div>

      {/* 进度条 */}
      <div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Lv.{level}</span>
          <span className="text-muted-foreground">Lv.{level + 1}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {xpInCurrentLevel.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
        </p>
      </div>

      {/* 等级特权 */}
      <div>
        <h4 className="font-medium text-foreground mb-3">等级特权</h4>
        <div className="space-y-3">
          {perks.map((perk, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 p-3 rounded-lg
                ${perk.unlocked ? 'bg-primary/10' : 'bg-muted/50 opacity-60'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${perk.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `}>
                {perk.level}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${perk.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {perk.name}
                </p>
                <p className="text-sm text-muted-foreground">{perk.description}</p>
              </div>
              {perk.unlocked && (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
