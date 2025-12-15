import { UserProgression, PortfolioItem } from './types/progression';

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  earnings: number;
  // Follow.ai 2.0 additions
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  languages?: string[];
  skills?: string[];
  aiTools?: string[];
  portfolioItems?: PortfolioItem[];
  progression?: UserProgression;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  logo: string;
  rating: number;
  reviewCount: number;
  growth: string;
  description: string;
  useCases?: string[]; // e.g., ['Coding', 'Analysis', 'Writing']
}

export interface Review {
  id: number;
  user: User;
  toolId: string;
  toolName: string;
  toolLogo: string;
  toolCategory: string;
  rating: number;
  qualityScore: number;
  text: string;
  outputImage: string;
  likes: number;
  helpful: number;
  timeAgo: string;
}

export interface NewsItem {
  id: number;
  type: 'launch' | 'update' | 'trending' | 'highlight';
  title: string;
  description: string;
  meta1: string;
  meta2: string;
}

import { TaskType, XpChallenge, Bounty, HireTask } from './types/progression';

export type Task = XpChallenge | Bounty | HireTask;

// Legacy Task interface for backward compatibility
export interface LegacyTask {
  id: number;
  title: string;
  reward: number;
  spots: number;
  timeLeft: string;
  tool: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}