/**
 * XP & Level System for Follow.ai
 * 
 * Level progression curve:
 * Level 1: 0-99 XP
 * Level 2: 100-299 XP
 * Level 3: 300-699 XP
 * Level 4: 700-1499 XP
 * Level 5: 1500-2999 XP
 * Level 6: 3000-5999 XP
 * Level 7: 6000-11999 XP
 * Level 8: 12000-23999 XP
 * Level 9: 24000-47999 XP
 * Level 10+: 48000+ XP (continues with ~2x progression)
 */

export interface LevelInfo {
  level: number;
  xpToNext: number;
  xpInCurrentLevel: number;
  xpForCurrentLevel: number; // Total XP needed to reach this level
  progress: number; // 0-1
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
 * Calculate level from total XP
 */
export function getLevelFromXp(totalXp: number): LevelInfo {
  if (totalXp < 0) totalXp = 0;

  // Level thresholds
  const thresholds = [
    0,      // Level 1
    100,    // Level 2
    300,    // Level 3
    700,    // Level 4
    1500,   // Level 5
    3000,   // Level 6
    6000,   // Level 7
    12000,  // Level 8
    24000,  // Level 9
    48000,  // Level 10
  ];

  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = 100;

  // Find current level
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalXp >= thresholds[i]) {
      level = i + 1;
      xpForCurrentLevel = thresholds[i];
      xpForNextLevel = i + 1 < thresholds.length ? thresholds[i + 1] : thresholds[i] * 2;
      break;
    }
  }

  // If beyond defined thresholds, calculate dynamically
  if (totalXp >= thresholds[thresholds.length - 1]) {
    level = thresholds.length;
    xpForCurrentLevel = thresholds[thresholds.length - 1];
    
    // Calculate next threshold (roughly 2x)
    let nextThreshold = xpForCurrentLevel;
    while (nextThreshold <= totalXp) {
      nextThreshold *= 2;
    }
    xpForNextLevel = nextThreshold;
  }

  const xpInCurrentLevel = totalXp - xpForCurrentLevel;
  const xpToNext = xpForNextLevel - totalXp;
  const progress = (xpInCurrentLevel / (xpForNextLevel - xpForCurrentLevel)) || 0;

  return {
    level,
    xpToNext,
    xpInCurrentLevel,
    xpForCurrentLevel,
    progress: Math.min(progress, 1),
  };
}

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

