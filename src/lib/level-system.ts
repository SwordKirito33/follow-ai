// Unified Level System for Follow.ai
// This is the SINGLE SOURCE OF TRUTH for all level calculations

import type { LevelInfo } from '../types';

// ============================================
// Level Configuration
// ============================================

/**
 * XP thresholds for each level (cumulative)
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP
 * ...and so on
 */
export const LEVEL_THRESHOLDS: number[] = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  900,    // Level 5
  1500,   // Level 6
  2400,   // Level 7
  3600,   // Level 8
  5100,   // Level 9
  7000,   // Level 10
  9500,   // Level 11
  12500,  // Level 12
  16000,  // Level 13
  20000,  // Level 14
  25000,  // Level 15
  31000,  // Level 16
  38000,  // Level 17
  46000,  // Level 18
  55000,  // Level 19
  65000,  // Level 20
];

export const MAX_LEVEL = 100;
export const BEYOND_THRESHOLD_BASE = 10000;

/**
 * Level titles based on level ranges
 */
export const LEVEL_TITLES: Record<number, string> = {
  1: '新手',
  5: '初级测试者',
  10: '中级测试者',
  15: '高级测试者',
  20: '专家测试者',
  25: '大师测试者',
  30: '传奇测试者',
  50: '神话测试者',
  75: '至尊测试者',
  100: '终极测试者',
};

/**
 * Level badges/icons
 */
export const LEVEL_BADGES: Record<number, string> = {
  1: '🌱',
  5: '🌿',
  10: '🌳',
  15: '⭐',
  20: '🌟',
  25: '💫',
  30: '🔥',
  50: '👑',
  75: '💎',
  100: '🏆',
};

// ============================================
// Core Level Functions
// ============================================

/**
 * Get the XP required to reach a specific level
 * @param level - Target level (1-100)
 * @returns Total XP required
 */
export function getXpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level <= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[level - 1];
  }
  if (level > MAX_LEVEL) return Infinity;
  
  // Calculate XP for levels beyond the threshold array
  const beyondLevel = level - LEVEL_THRESHOLDS.length;
  const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return lastThreshold + Math.floor(BEYOND_THRESHOLD_BASE * Math.pow(beyondLevel, 1.5));
}

/**
 * Get the level for a given total XP
 * @param totalXp - Total XP earned
 * @returns Current level
 */
export function getLevelFromXp(totalXp: number): number {
  if (totalXp < 0) return 1;
  
  // Check within threshold array
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      // Check if beyond threshold array
      if (i === LEVEL_THRESHOLDS.length - 1) {
        const remainingXp = totalXp - LEVEL_THRESHOLDS[i];
        const beyondLevel = Math.floor(Math.pow(remainingXp / BEYOND_THRESHOLD_BASE, 1 / 1.5));
        return Math.min(i + 1 + beyondLevel, MAX_LEVEL);
      }
      return i + 1;
    }
  }
  
  return 1;
}

/**
 * Get comprehensive level information
 * @param totalXp - Total XP earned
 * @returns LevelInfo object with all level details
 */
export function getLevelInfo(totalXp: number): LevelInfo {
  const level = getLevelFromXp(totalXp);
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  
  const xpInCurrentLevel = totalXp - currentLevelXp;
  const xpToNextLevel = nextLevelXp - currentLevelXp;
  const progress = level >= MAX_LEVEL ? 100 : Math.min(100, (xpInCurrentLevel / xpToNextLevel) * 100);
  
  // Find appropriate title
  let title = LEVEL_TITLES[1];
  for (const [minLevel, levelTitle] of Object.entries(LEVEL_TITLES)) {
    if (level >= parseInt(minLevel)) {
      title = levelTitle;
    }
  }
  
  return {
    level,
    currentXp: totalXp,
    xpInCurrentLevel,
    xpToNextLevel,
    progress,
    title,
  };
}

/**
 * Get the badge/icon for a level
 * @param level - Current level
 * @returns Badge emoji
 */
export function getLevelBadge(level: number): string {
  let badge = LEVEL_BADGES[1];
  for (const [minLevel, levelBadge] of Object.entries(LEVEL_BADGES)) {
    if (level >= parseInt(minLevel)) {
      badge = levelBadge;
    }
  }
  return badge;
}

/**
 * Calculate XP needed to reach next level
 * @param totalXp - Current total XP
 * @returns XP needed for next level
 */
export function getXpToNextLevel(totalXp: number): number {
  const currentLevel = getLevelFromXp(totalXp);
  const nextLevelXp = getXpForLevel(currentLevel + 1);
  return Math.max(0, nextLevelXp - totalXp);
}

/**
 * Check if user leveled up
 * @param oldXp - Previous total XP
 * @param newXp - New total XP
 * @returns Object with level up info
 */
export function checkLevelUp(oldXp: number, newXp: number): {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  levelsGained: number;
} {
  const oldLevel = getLevelFromXp(oldXp);
  const newLevel = getLevelFromXp(newXp);
  const leveledUp = newLevel > oldLevel;
  
  return {
    leveledUp,
    oldLevel,
    newLevel,
    levelsGained: newLevel - oldLevel,
  };
}

/**
 * Format XP number with commas
 * @param xp - XP value
 * @returns Formatted string
 */
export function formatXp(xp: number): string {
  return xp.toLocaleString();
}

/**
 * Format progress percentage
 * @param progress - Progress value (0-100)
 * @returns Formatted string
 */
export function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

// ============================================
// XP Rewards Configuration
// ============================================

export const XP_REWARDS = {
  // Task completion
  task: {
    beginner: 50,
    intermediate: 100,
    advanced: 200,
  },
  
  // Daily check-in
  checkIn: {
    base: 10,
    streakBonus: 5, // Per day of streak
    maxStreakBonus: 50,
  },
  
  // Referral
  referral: {
    referrer: 100,
    referee: 50,
  },
  
  // Achievements
  achievement: {
    common: 25,
    rare: 50,
    epic: 100,
    legendary: 250,
  },
  
  // Social
  rating: 2, // Per star given
  comment: 5,
  helpfulComment: 10,
};

/**
 * Calculate check-in XP with streak bonus
 * @param streakDays - Current streak days
 * @returns Total XP for check-in
 */
export function calculateCheckInXp(streakDays: number): number {
  const { base, streakBonus, maxStreakBonus } = XP_REWARDS.checkIn;
  const bonus = Math.min(streakDays * streakBonus, maxStreakBonus);
  return base + bonus;
}

/**
 * Calculate task completion XP
 * @param difficulty - Task difficulty
 * @param bonusMultiplier - Optional bonus multiplier
 * @returns XP earned
 */
export function calculateTaskXp(
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  bonusMultiplier: number = 1
): number {
  return Math.floor(XP_REWARDS.task[difficulty] * bonusMultiplier);
}

// ============================================
// Level Progress Component Props
// ============================================

export interface LevelProgressProps {
  totalXp: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface LevelBadgeProps {
  level: number;
  showTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
