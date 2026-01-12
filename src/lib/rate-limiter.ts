/**
 * API Rate Limiting Configuration
 * Implements rate limiting for different API endpoints
 */

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message: string; // Error message
  statusCode: number; // HTTP status code
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMIT_CONFIGS = {
  // Strict limit for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts
    message: 'Too many login attempts, please try again later',
    statusCode: 429,
  },

  // Standard limit for API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests
    message: 'Too many requests, please try again later',
    statusCode: 429,
  },

  // Relaxed limit for read-only endpoints
  read: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 300, // 300 requests
    message: 'Too many requests, please try again later',
    statusCode: 429,
  },

  // Strict limit for write operations
  write: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests
    message: 'Too many write requests, please try again later',
    statusCode: 429,
  },

  // Very strict limit for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 requests
    message: 'Too many sensitive operations, please try again later',
    statusCode: 429,
  },
};

/**
 * Rate limit store (in-memory)
 * In production, use Redis or similar
 */
class RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * Check if request is allowed
   */
  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(key: string, config: RateLimitConfig): number {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return config.maxRequests;
    }
    return Math.max(0, config.maxRequests - entry.count);
  }

  /**
   * Get reset time
   */
  getResetTime(key: string, config: RateLimitConfig): number {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return Date.now() + config.windowMs;
    }
    return entry.resetTime;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Global rate limit store
export const rateLimitStore = new RateLimitStore();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  rateLimitStore.cleanup();
}, 5 * 60 * 1000);

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  message?: string;
} {
  const allowed = rateLimitStore.isAllowed(identifier, config);
  const remaining = rateLimitStore.getRemaining(identifier, config);
  const resetTime = rateLimitStore.getResetTime(identifier, config);

  return {
    allowed,
    remaining,
    resetTime,
    message: allowed ? undefined : config.message,
  };
}

/**
 * Get rate limit headers
 */
export function getRateLimitHeaders(
  identifier: string,
  config: RateLimitConfig
): Record<string, string> {
  const remaining = rateLimitStore.getRemaining(identifier, config);
  const resetTime = rateLimitStore.getResetTime(identifier, config);

  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };
}

/**
 * Middleware for rate limiting
 */
export function createRateLimitMiddleware(
  getIdentifier: (context: any) => string,
  config: RateLimitConfig
) {
  return (context: any) => {
    const identifier = getIdentifier(context);
    const result = checkRateLimit(identifier, config);

    if (!result.allowed) {
      throw new Error(result.message);
    }

    return result;
  };
}
