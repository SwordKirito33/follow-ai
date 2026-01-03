// Application configuration for Follow.ai

export const APP_CONFIG = {
  // App info
  name: 'Follow.ai',
  description: 'The premier platform for AI tool testing and earning rewards',
  version: '2.0.0',
  
  // URLs
  urls: {
    website: 'https://follow-ai.com',
    api: import.meta.env.VITE_API_URL || 'https://api.follow-ai.com',
    docs: 'https://docs.follow-ai.com',
    support: 'https://support.follow-ai.com',
    twitter: 'https://twitter.com/followai',
    discord: 'https://discord.gg/followai',
    github: 'https://github.com/follow-ai',
  },

  // Feature flags
  features: {
    socialLogin: true,
    darkMode: true,
    multiLanguage: true,
    pwa: true,
    notifications: true,
    analytics: true,
    dailyCheckIn: true,
    achievements: true,
    referralSystem: true,
    xpPurchase: true,
    leaderboard: true,
    comments: true,
    ratings: true,
  },

  // XP system configuration
  xp: {
    // Base XP for different actions
    taskCompletion: {
      beginner: 50,
      intermediate: 100,
      advanced: 200,
    },
    dailyCheckIn: {
      base: 10,
      streakBonus: 5, // Additional XP per day of streak
      maxStreakBonus: 50, // Maximum streak bonus
    },
    referral: {
      referrer: 100,
      referee: 50,
    },
    achievement: {
      common: 25,
      rare: 50,
      epic: 100,
      legendary: 250,
    },
    rating: {
      perStar: 2, // XP per star given
    },
    comment: {
      base: 5,
      helpful: 10, // Bonus for helpful comments
    },
  },

  // Level system configuration
  levels: {
    // XP required for each level (cumulative)
    thresholds: [
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
    ],
    maxLevel: 100,
    // Formula for levels beyond 20: baseXP * (level - 20)^1.5
    beyondThresholdBase: 10000,
  },

  // Supported languages
  languages: [
    { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
    { code: 'zh', name: '中文', flag: '🇨🇳', rtl: false },
    { code: 'ja', name: '日本語', flag: '🇯🇵', rtl: false },
    { code: 'ko', name: '한국어', flag: '🇰🇷', rtl: false },
    { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false },
    { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false },
    { code: 'pt', name: 'Português', flag: '🇧🇷', rtl: false },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', rtl: false },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  ],

  // Supported currencies
  currencies: [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'KRW', symbol: '₩', name: 'Korean Won' },
  ],

  // XP packages for purchase
  xpPackages: [
    { id: 'starter', xp: 500, price: 10, currency: 'USD' },
    { id: 'standard', xp: 1000, price: 18, originalPrice: 20, discount: 10, popular: true },
    { id: 'pro', xp: 5000, price: 80, originalPrice: 100, discount: 20 },
    { id: 'enterprise', xp: 10000, price: 140, originalPrice: 200, discount: 30, bestValue: true },
  ],

  // Task difficulty settings
  taskDifficulty: {
    beginner: {
      label: 'Beginner',
      color: 'green',
      minLevel: 1,
      xpMultiplier: 1,
    },
    intermediate: {
      label: 'Intermediate',
      color: 'yellow',
      minLevel: 5,
      xpMultiplier: 1.5,
    },
    advanced: {
      label: 'Advanced',
      color: 'red',
      minLevel: 10,
      xpMultiplier: 2,
    },
  },

  // Leaderboard settings
  leaderboard: {
    pageSize: 50,
    refreshInterval: 60000, // 1 minute
    timeRanges: ['daily', 'weekly', 'monthly', 'all-time'],
  },

  // Notification settings
  notifications: {
    maxVisible: 5,
    autoHideDuration: 5000, // 5 seconds
    types: ['achievement', 'task', 'system', 'reward', 'social'],
  },

  // Rate limiting
  rateLimits: {
    taskSubmission: {
      maxPerHour: 10,
      maxPerDay: 50,
    },
    comments: {
      maxPerHour: 20,
      maxPerDay: 100,
    },
    ratings: {
      maxPerHour: 30,
      maxPerDay: 150,
    },
  },

  // File upload limits
  uploads: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFiles: 5,
  },

  // Session settings
  session: {
    timeout: 30 * 60 * 1000, // 30 minutes
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },

  // Analytics
  analytics: {
    enabled: import.meta.env.PROD,
    trackPageViews: true,
    trackEvents: true,
    trackErrors: true,
  },

  // SEO defaults
  seo: {
    titleTemplate: '%s | Follow.ai',
    defaultTitle: 'Follow.ai - AI Tool Testing Platform',
    defaultDescription: 'Join Follow.ai to test AI tools, earn XP, and climb the leaderboard. The premier platform for AI enthusiasts.',
    defaultImage: '/og-image.png',
    twitterHandle: '@followai',
  },
};

export const getXpForLevel = (level: number): number => {
  const { thresholds, beyondThresholdBase, maxLevel } = APP_CONFIG.levels;
  
  if (level <= 0) return 0;
  if (level <= thresholds.length) return thresholds[level - 1];
  if (level > maxLevel) return Infinity;
  
  // Calculate XP for levels beyond the threshold array
  const beyondLevel = level - thresholds.length;
  const lastThreshold = thresholds[thresholds.length - 1];
  return lastThreshold + Math.floor(beyondThresholdBase * Math.pow(beyondLevel, 1.5));
};

export const getLevelFromXp = (xp: number): number => {
  const { thresholds, beyondThresholdBase, maxLevel } = APP_CONFIG.levels;
  
  // Check within threshold array
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      // Check if beyond threshold array
      if (i === thresholds.length - 1) {
        const remainingXp = xp - thresholds[i];
        const beyondLevel = Math.floor(Math.pow(remainingXp / beyondThresholdBase, 1 / 1.5));
        return Math.min(i + 1 + beyondLevel, maxLevel);
      }
      return i + 1;
    }
  }
  
  return 1;
};

export const getXpProgress = (xp: number): { current: number; required: number; percentage: number } => {
  const level = getLevelFromXp(xp);
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  
  const current = xp - currentLevelXp;
  const required = nextLevelXp - currentLevelXp;
  const percentage = Math.min(100, (current / required) * 100);
  
  return { current, required, percentage };
};

export default APP_CONFIG;
