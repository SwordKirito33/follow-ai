export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  earnings: number;
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

export interface Task {
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