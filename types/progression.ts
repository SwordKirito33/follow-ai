/**
 * Progression system types for Follow.ai 2.0
 */

export interface UserProgression {
  xp: number;
  level: number;
  xpToNextLevel: number;
  unlockedFeatures: string[];
  profileCompletion: number; // 0-100
  badges: string[];
  weeklyStreak?: number;
  lastActivityDate?: string;
}

export type TaskType = 'xp_challenge' | 'bounty' | 'hire';

export interface BaseTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  category: string;
  status: 'open' | 'in_review' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  minLevel?: number;
  requiredProfileCompletion?: number;
}

export interface XpChallenge extends BaseTask {
  type: 'xp_challenge';
  xpReward: number;
  requirements?: string[];
}

export interface Bounty extends BaseTask {
  type: 'bounty';
  rewardAmount: number;
  totalSlots: number;
  filledSlots: number;
  deadline?: string;
  requirements?: string[];
}

export interface HireTask extends BaseTask {
  type: 'hire';
  creatorId: string;
  requiredSkills: string[];
  requiredAiTools: string[];
  rewardType: 'money' | 'xp' | 'money_and_xp';
  budgetMin?: number;
  budgetMax?: number;
  xpReward?: number;
  deadline?: string;
  attachments?: string[];
  applications?: HireApplication[];
}

export interface HireApplication {
  id: string;
  taskId: string;
  applicantId: string;
  proposal: string;
  estimatedTimeline?: string;
  portfolioLinks?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;
}

export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  link?: string;
  attachmentUrl?: string;
  relatedTools?: string[];
  createdAt: string;
  isVerified?: boolean;
}

export interface UserProfile {
  id: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  languages: string[];
  skills: string[];
  aiTools: string[];
  portfolioItems: PortfolioItem[];
  badges: string[];
  progression: UserProgression;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  route?: string;
}

