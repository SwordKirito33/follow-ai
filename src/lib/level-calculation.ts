/**
 * Level Calculation Functions
 * Based on the formula from Prompt 5:
 * - Level 1-5: 50 * level^2
 * - Level 6-15: 100 * level^2
 * - Level 16-100: 150 * level^2
 */

export interface LevelInfo {
  level: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  xpToNext: number;
  progress: number; // 0 to 1
}

/**
 * Calculate XP required for a specific level
 */
export function getXpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level <= 5) {
    return 50 * level * level;
  } else if (level <= 15) {
    return 100 * level * level;
  } else {
    return 150 * level * level;
  }
}

/**
 * Get level from total XP
 */
export function getLevelFromTotalXp(totalXp: number): number {
  if (totalXp < 0) totalXp = 0;

  // Binary search for the correct level
  let low = 1;
  let high = 100;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const xpForMid = getXpForLevel(mid);

    if (totalXp >= xpForMid) {
      if (mid === 100 || totalXp < getXpForLevel(mid + 1)) {
        return mid;
      }
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return 1;
}

/**
 * Get detailed level information from total XP
 */
export function getLevelInfo(totalXp: number): LevelInfo {
  if (totalXp < 0) totalXp = 0;

  const level = getLevelFromTotalXp(totalXp);
  const xpForCurrentLevel = getXpForLevel(level);
  const xpForNextLevel = level < 100 ? getXpForLevel(level + 1) : xpForCurrentLevel;
  const xpInCurrentLevel = totalXp - xpForCurrentLevel;
  const xpToNext = xpForNextLevel - totalXp;
  const range = xpForNextLevel - xpForCurrentLevel;
  const progress = range > 0 ? Math.min(1, Math.max(0, xpInCurrentLevel / range)) : 1;

  return {
    level,
    xpForCurrentLevel,
    xpForNextLevel,
    xpInCurrentLevel,
    xpToNext,
    progress,
  };
}

/**
 * Get badge information for a level
 */
export interface BadgeInfo {
  id: string;
  name: string;
  level: number;
  emoji: string;
  unlocked: boolean;
}

export function getBadgesForLevel(level: number): BadgeInfo[] {
  const allBadges: BadgeInfo[] = [
    { id: 'novice', name: '新手', level: 1, emoji: '🥚', unlocked: level >= 1 },
    { id: 'beginner', name: '初级测试者', level: 5, emoji: '🌱', unlocked: level >= 5 },
    { id: 'intermediate', name: '中级测试者', level: 10, emoji: '⭐', unlocked: level >= 10 },
    { id: 'advanced', name: '高级测试者', level: 15, emoji: '🔥', unlocked: level >= 15 },
    { id: 'expert', name: '专家测试者', level: 20, emoji: '💎', unlocked: level >= 20 },
    { id: 'master', name: '大师测试者', level: 50, emoji: '👑', unlocked: level >= 50 },
    { id: 'legend', name: '传奇测试者', level: 100, emoji: '🏆', unlocked: level >= 100 },
  ];

  return allBadges;
}

