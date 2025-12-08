import { Review, Tool, NewsItem, Task, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Developer',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  level: 1,
  levelName: 'Novice',
  earnings: 0
};

export const TOOLS: Tool[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'Coding',
    logo: 'https://picsum.photos/seed/cursor/60/60',
    rating: 4.8,
    reviewCount: 45,
    growth: '+120%',
    description: 'The AI-first code editor.'
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    category: 'AI Assistant',
    logo: 'https://picsum.photos/seed/claude/60/60',
    rating: 4.9,
    reviewCount: 38,
    growth: '+85%',
    description: 'Anthropic\'s most intelligent model.'
  },
  {
    id: 'midjourney',
    name: 'Midjourney v7',
    category: 'Image Gen',
    logo: 'https://picsum.photos/seed/midjourney/60/60',
    rating: 4.7,
    reviewCount: 32,
    growth: 'NEW',
    description: 'Hyper-realistic image generation.'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    user: {
      id: 'u2',
      name: 'Jackson',
      avatar: 'https://picsum.photos/seed/jackson/100/100',
      level: 3,
      levelName: 'Expert',
      earnings: 4500
    },
    toolId: 'cursor',
    toolName: 'Cursor',
    toolLogo: 'https://picsum.photos/seed/cursor/60/60',
    toolCategory: 'Coding',
    rating: 5.0,
    qualityScore: 9.2,
    text: 'Built a full todo app in 30 minutes. The context awareness is mind-blowing. It knew exactly where to place the code without me explicitly telling it the file structure. The "Composer" feature specifically saved me about 2 hours of refactoring time.',
    outputImage: 'https://picsum.photos/seed/codeoutput/600/400',
    likes: 24,
    helpful: 12,
    timeAgo: '2 hours ago'
  },
  {
    id: 2,
    user: {
      id: 'u3',
      name: 'Sarah',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
      level: 2,
      levelName: 'Tester',
      earnings: 1200
    },
    toolId: 'midjourney',
    toolName: 'Midjourney v7',
    toolLogo: 'https://picsum.photos/seed/midjourney/60/60',
    toolCategory: 'Image Gen',
    rating: 4.7,
    qualityScore: 8.8,
    text: 'Created 50 logo variations for a client in under an hour. The new v7 styles are incredible. Minor complaint: sometimes ignores specific color requests, but the "vary region" tool fixes that easily.',
    outputImage: 'https://picsum.photos/seed/logooutput/600/400',
    likes: 18,
    helpful: 9,
    timeAgo: '5 hours ago'
  },
  {
    id: 3,
    user: {
      id: 'u4',
      name: 'David',
      avatar: 'https://picsum.photos/seed/david/100/100',
      level: 1,
      levelName: 'Explorer',
      earnings: 150
    },
    toolId: 'claude',
    toolName: 'Claude 3.5 Sonnet',
    toolLogo: 'https://picsum.photos/seed/claude/60/60',
    toolCategory: 'AI Assistant',
    rating: 4.9,
    qualityScore: 9.5,
    text: 'I used Claude to analyze a 500mb CSV file of sales data. It wrote the Python script, executed it, and gave me a summary report. Absolutely flawless reasoning capabilities compared to GPT-4.',
    outputImage: 'https://picsum.photos/seed/csvoutput/600/400',
    likes: 42,
    helpful: 30,
    timeAgo: '1 day ago'
  }
];

export const NEWS: NewsItem[] = [
  { id: 1, type: 'launch', title: 'Cursor v0.42 Released', description: 'New AI model, 50% faster completion', meta1: '2h ago', meta2: '12 reviews' },
  { id: 2, type: 'update', title: 'Midjourney v7 Live', description: 'Improved quality, new styles', meta1: '5h ago', meta2: '28 reviews' },
  { id: 3, type: 'trending', title: 'AI Coding Tools Surge', description: '5 new editors launched this week', meta1: '1d ago', meta2: '15 comments' },
  { id: 4, type: 'highlight', title: 'Sarah\'s Review Hits 100 Likes', description: '"Best AI for coding" breakdown', meta1: '1d ago', meta2: 'by @sarahdev' },
];

export const TASKS: Task[] = [
  { id: 1, title: 'Test Cursor\'s New Composer Feature', reward: 50, spots: 3, timeLeft: '4h', tool: 'Cursor' },
  { id: 2, title: 'Generate 10 Fantasy Landscapes', reward: 35, spots: 12, timeLeft: '1d', tool: 'Midjourney' },
  { id: 3, title: 'Analyze Financial PDF Report', reward: 40, spots: 5, timeLeft: '6h', tool: 'Claude 3.5' },
];