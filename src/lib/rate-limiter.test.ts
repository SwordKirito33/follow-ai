import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  checkRateLimit,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
  rateLimitStore,
  createRateLimitMiddleware,
} from './rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear store before each test
    (rateLimitStore as any).store.clear();
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('user1', RATE_LIMIT_CONFIGS.api);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99); // 100 - 1
    });

    it('should track multiple requests', () => {
      const config = RATE_LIMIT_CONFIGS.api;
      
      // First request
      let result = checkRateLimit('user1', config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);

      // Second request
      result = checkRateLimit('user1', config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(98);

      // Third request
      result = checkRateLimit('user1', config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(97);
    });

    it('should enforce rate limit', () => {
      const config = {
        windowMs: 60 * 1000,
        maxRequests: 3,
        message: 'Too many requests',
        statusCode: 429,
      };

      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        const result = checkRateLimit('user1', config);
        expect(result.allowed).toBe(true);
      }

      // 4th request should be blocked
      const result = checkRateLimit('user1', config);
      expect(result.allowed).toBe(false);
      expect(result.message).toBe('Too many requests');
    });

    it('should isolate limits per user', () => {
      const config = RATE_LIMIT_CONFIGS.auth;

      // User 1 makes requests
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit('user1', config);
        expect(result.allowed).toBe(true);
      }

      // User 2 should still be able to make requests
      const result = checkRateLimit('user2', config);
      expect(result.allowed).toBe(true);
    });

    it('should use different configs', () => {
      // Auth config is stricter
      const authConfig = RATE_LIMIT_CONFIGS.auth;
      const apiConfig = RATE_LIMIT_CONFIGS.api;

      // Auth endpoint - limited to 5 requests
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit('user1-auth', authConfig);
        expect(result.allowed).toBe(true);
      }
      const authResult = checkRateLimit('user1-auth', authConfig);
      expect(authResult.allowed).toBe(false);

      // API endpoint - limited to 100 requests
      for (let i = 0; i < 100; i++) {
        const result = checkRateLimit('user1-api', apiConfig);
        expect(result.allowed).toBe(true);
      }
      const apiResult = checkRateLimit('user1-api', apiConfig);
      expect(apiResult.allowed).toBe(false);
    });
  });

  describe('getRateLimitHeaders', () => {
    it('should return correct headers', () => {
      const config = RATE_LIMIT_CONFIGS.api;
      
      // Make a request
      checkRateLimit('user1', config);

      // Get headers
      const headers = getRateLimitHeaders('user1', config);

      expect(headers['X-RateLimit-Limit']).toBe('100');
      expect(headers['X-RateLimit-Remaining']).toBe('99');
      expect(headers['X-RateLimit-Reset']).toBeDefined();
    });

    it('should update headers after multiple requests', () => {
      const config = RATE_LIMIT_CONFIGS.api;

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit('user1', config);
      }

      // Get headers
      const headers = getRateLimitHeaders('user1', config);

      expect(headers['X-RateLimit-Remaining']).toBe('95');
    });
  });

  describe('RATE_LIMIT_CONFIGS', () => {
    it('should have all required configs', () => {
      expect(RATE_LIMIT_CONFIGS.auth).toBeDefined();
      expect(RATE_LIMIT_CONFIGS.api).toBeDefined();
      expect(RATE_LIMIT_CONFIGS.read).toBeDefined();
      expect(RATE_LIMIT_CONFIGS.write).toBeDefined();
      expect(RATE_LIMIT_CONFIGS.sensitive).toBeDefined();
    });

    it('should have correct auth config', () => {
      const config = RATE_LIMIT_CONFIGS.auth;
      expect(config.maxRequests).toBe(5);
      expect(config.windowMs).toBe(15 * 60 * 1000);
    });

    it('should have correct sensitive config', () => {
      const config = RATE_LIMIT_CONFIGS.sensitive;
      expect(config.maxRequests).toBe(10);
      expect(config.windowMs).toBe(60 * 60 * 1000);
    });

    it('should have correct read config', () => {
      const config = RATE_LIMIT_CONFIGS.read;
      expect(config.maxRequests).toBe(300);
      expect(config.windowMs).toBe(60 * 1000);
    });

    it('should have correct write config', () => {
      const config = RATE_LIMIT_CONFIGS.write;
      expect(config.maxRequests).toBe(30);
      expect(config.windowMs).toBe(60 * 1000);
    });
  });

  describe('rateLimitStore', () => {
    it('should cleanup expired entries', () => {
      const config = {
        windowMs: 100, // 100ms
        maxRequests: 5,
        message: 'Too many requests',
        statusCode: 429,
      };

      // Make a request
      checkRateLimit('user1', config);

      // Wait for expiration
      return new Promise((resolve) => {
        setTimeout(() => {
          // Cleanup
          rateLimitStore.cleanup();

          // Next request should be allowed
          const result = checkRateLimit('user1', config);
          expect(result.allowed).toBe(true);
          expect(result.remaining).toBe(4);
          resolve(undefined);
        }, 150);
      });
    });

    it('should handle expired entries', () => {
      const config = {
        windowMs: 100, // 100ms
        maxRequests: 3,
        message: 'Too many requests',
        statusCode: 429,
      };

      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        checkRateLimit('user1', config);
      }

      // 4th request should be blocked
      let result = checkRateLimit('user1', config);
      expect(result.allowed).toBe(false);

      // Wait for expiration
      return new Promise((resolve) => {
        setTimeout(() => {
          // Next request should be allowed
          result = checkRateLimit('user1', config);
          expect(result.allowed).toBe(true);
          resolve(undefined);
        }, 150);
      });
    });

    it('should return correct remaining count', () => {
      const config = RATE_LIMIT_CONFIGS.api;

      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        checkRateLimit('user1', config);
      }

      // Check remaining
      const result = checkRateLimit('user1', config);
      expect(result.remaining).toBe(89); // 100 - 11
    });

    it('should return correct reset time', () => {
      const config = RATE_LIMIT_CONFIGS.api;
      const before = Date.now();

      // Make a request
      const result = checkRateLimit('user1', config);

      // Reset time should be in the future
      expect(result.resetTime).toBeGreaterThan(before);
      expect(result.resetTime).toBeLessThanOrEqual(before + config.windowMs + 100);
    });
  });

  describe('createRateLimitMiddleware', () => {
    it('should create middleware that allows requests', () => {
      const config = RATE_LIMIT_CONFIGS.api;
      const getIdentifier = (context: any) => context.userId;
      const middleware = createRateLimitMiddleware(getIdentifier, config);

      const context = { userId: 'user1' };
      const result = middleware(context);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeLessThan(100);
    });

    it('should create middleware that blocks requests', () => {
      const config = {
        windowMs: 60 * 1000,
        maxRequests: 2,
        message: 'Too many requests',
        statusCode: 429,
      };
      const getIdentifier = (context: any) => context.userId;
      const middleware = createRateLimitMiddleware(getIdentifier, config);

      const context = { userId: 'user1' };

      // First two requests should succeed
      middleware(context);
      middleware(context);

      // Third request should throw
      expect(() => middleware(context)).toThrow('Too many requests');
    });

    it('should use custom identifier function', () => {
      const config = RATE_LIMIT_CONFIGS.api;
      const getIdentifier = (context: any) => `${context.userId}-${context.endpoint}`;
      const middleware = createRateLimitMiddleware(getIdentifier, config);

      const context1 = { userId: 'user1', endpoint: '/api/v1' };
      const context2 = { userId: 'user1', endpoint: '/api/v2' };

      // Different identifiers should have separate limits
      const result1 = middleware(context1);
      const result2 = middleware(context2);

      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle zero remaining requests', () => {
      const config = {
        windowMs: 60 * 1000,
        maxRequests: 1,
        message: 'Too many requests',
        statusCode: 429,
      };

      // First request
      const result1 = checkRateLimit('user1', config);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(0);

      // Second request should be blocked
      const result2 = checkRateLimit('user1', config);
      expect(result2.allowed).toBe(false);
      expect(result2.message).toBe('Too many requests');
    });

    it('should handle concurrent requests', () => {
      const config = RATE_LIMIT_CONFIGS.api;

      // Simulate concurrent requests
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(checkRateLimit('user1', config));
      }

      // All should be allowed
      results.forEach((result) => {
        expect(result.allowed).toBe(true);
      });

      // Remaining should decrease
      expect(results[0].remaining).toBe(99);
      expect(results[9].remaining).toBe(90);
    });

    it('should handle different users concurrently', () => {
      const config = RATE_LIMIT_CONFIGS.api;

      // Multiple users make requests
      const result1 = checkRateLimit('user1', config);
      const result2 = checkRateLimit('user2', config);
      const result3 = checkRateLimit('user3', config);

      // All should be allowed with same remaining count
      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result3.allowed).toBe(true);
      expect(result1.remaining).toBe(99);
      expect(result2.remaining).toBe(99);
      expect(result3.remaining).toBe(99);
    });
  });
});
