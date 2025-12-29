export const DIFFICULTY_CONSTANT = 100;

export interface LevelInfo {
  level: number;
  xpToNext: number;
  xpInCurrentLevel: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progress: number; // 0 to 1
  name: string;
}

export function getLevelFromXp(totalXp: number): LevelInfo {
  if (totalXp < 0) totalXp = 0;

  // 1. 核心公式：Level = floor(sqrt(totalXp / 100)) + 1
  // 例如: 400 XP -> 400/100=4 -> sqrt(4)=2 -> 2+1 = Level 3
  const level = Math.floor(Math.sqrt(totalXp / DIFFICULTY_CONSTANT)) + 1;

  // 2. 当前等级起点 XP = (Level-1)^2 * 100
  const xpForCurrentLevel = Math.pow(level - 1, 2) * DIFFICULTY_CONSTANT;

  // 3. 下一级目标 XP = Level^2 * 100
  const xpForNextLevel = Math.pow(level, 2) * DIFFICULTY_CONSTANT;

  // 4. 计算当前等级内的进度
  const xpInCurrentLevel = totalXp - xpForCurrentLevel;
  const xpToNext = xpForNextLevel - totalXp;
  
  // 5. 计算百分比 (0-1)
  const range = xpForNextLevel - xpForCurrentLevel;
  const progress = range > 0 ? Math.min(1, Math.max(0, xpInCurrentLevel / range)) : 1;

  return {
    level,
    xpToNext,
    xpInCurrentLevel,
    xpForCurrentLevel,
    xpForNextLevel,
    progress,
    name: getLevelName(level)
  };
}

export function getLevelName(level: number): string {
  if (level >= 50) return 'Legend 👑';
  if (level >= 30) return 'Grandmaster 💎';
  if (level >= 20) return 'Master 🔮';
  if (level >= 10) return 'Expert 🔥';
  if (level >= 5) return 'Advanced ⭐';
  if (level >= 2) return 'Beginner 🌱';
  return 'Novice 🥚';
}

export type UserAction =
  | 'onboarding_complete'
  | 'onboarding_step'
  | 'output_submitted'
  | 'output_verified_high'
  | 'output_verified_medium'
  | 'output_verified_low'
  | 'hire_task_completed'
  | 'hire_task_rated_positive'
  | 'portfolio_item_added'
  | 'weekly_streak'
  | 'first_output'
  | 'profile_completed';

/**
 * Get XP reward for a user action
 */
export function getXpReward(action: UserAction, metadata?: Record<string, any>): number {
  const rewards: Record<UserAction, number> = {
    onboarding_complete: 100,
    onboarding_step: 25,
    output_submitted: 10,
    output_verified_high: 50, // Quality score 8+
    output_verified_medium: 30, // Quality score 5-7
    output_verified_low: 10, // Quality score <5
    hire_task_completed: 75,
    hire_task_rated_positive: 25,
    portfolio_item_added: 20,
    weekly_streak: 50,
    first_output: 50,
    profile_completed: 50,
  };

  let baseReward = rewards[action] || 0;

  // Adjust based on quality score if provided
  if (action === 'output_verified_high' || action === 'output_verified_medium' || action === 'output_verified_low') {
    const qualityScore = metadata?.qualityScore || 0;
    if (qualityScore >= 8) {
      baseReward = 50;
    } else if (qualityScore >= 5) {
      baseReward = 30;
    } else {
      baseReward = 10;
    }
  }

  return baseReward;
}

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(profile: {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  aiTools?: string[];
  portfolioItems?: any[];
  location?: string;
}): number {
  let completed = 0;
  const total = 5;

  if (profile.displayName && profile.displayName.trim()) completed++;
  if (profile.avatarUrl) completed++;
  if (profile.bio && profile.bio.trim().length >= 20) completed++;
  if (profile.skills && profile.skills.length > 0) completed++;
  if (profile.portfolioItems && profile.portfolioItems.length > 0) completed++;

  return Math.round((completed / total) * 100);
}

/**
 * Get unlocked features based on level
 */
export function getUnlockedFeatures(level: number, profileCompletion: number): string[] {
  const features: string[] = [];

  // Level 1: Basic features
  if (level >= 1) {
    features.push('xp_challenges');
    features.push('output_submission');
  }

  // Level 2: Money bounties (requires profile completion)
  if (level >= 2 && profileCompletion >= 60) {
    features.push('money_bounties');
  }

  // Level 3: Hire marketplace
  if (level >= 3 && profileCompletion >= 70) {
    features.push('hire_applications');
  }

  // Level 5: Post Hire tasks
  if (level >= 5 && profileCompletion >= 80) {
    features.push('hire_task_creation');
  }

  return features;
}

/**
 * Check if user can access a feature
 */
export function canAccessFeature(
  feature: string,
  level: number,
  profileCompletion: number
): boolean {
  return getUnlockedFeatures(level, profileCompletion).includes(feature);
}
