/**
 * XP progression table
 * Index = level - 1, Value = total XP needed to reach that level
 */
export const XP_PER_LEVEL = [
  0,      // Level 1 (starting)
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1400,   // Level 7
  1900,   // Level 8
  2500,   // Level 9
  3200,   // Level 10
  4000,   // Level 11
  5000,   // Level 12
  6200,   // Level 13
  7600,   // Level 14
  9200,   // Level 15
] as const;

/**
 * Profile completion weights
 * MUST total 100%
 * Changed from original: portfolio 15%→20%, username 10%→5%
 */
export const PROFILE_COMPLETION_WEIGHTS = {
  avatar: 20,
  bio: 20,
  skills: 20,
  ai_tools: 20,
  portfolio: 20,
} as const;

/**
 * Unicode character minimum for experience text
 * NOT words, CHARACTERS (supports Chinese, emoji, etc)
 */
export const MIN_EXPERIENCE_CHARS = 100;
export const MIN_BIO_LENGTH = 50;
export const MAX_SKILLS = 50;
export const MAX_AI_TOOLS = 50;

/**
 * Upload limits
 */
export const UPLOAD_LIMITS = {
  DAILY_PER_BUCKET: 30,
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'text/markdown'],
} as const;

/**
 * Storage bucket names (MUST match PART A SQL)
 */
export const STORAGE_BUCKETS = {
  AVATARS: 'user-avatars',
  REVIEW_OUTPUTS: 'review-outputs',
  PORTFOLIO_IMAGES: 'portfolio-images',
} as const;

/**
 * XP source types (for anti-duplicate tracking)
 */
export const XP_SOURCES = {
  ONBOARDING_STEP: 'onboarding_step',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  TASK_SUBMISSION: 'task_submission',
  PROFILE_COMPLETE: 'profile_complete',
  PORTFOLIO_ADDED: 'portfolio_added',
} as const;

