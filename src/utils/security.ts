/**
 * Security utilities for Follow.ai
 */

// XSS Prevention - Sanitize HTML input
export const sanitizeHTML = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Escape special characters for safe display
export const escapeHTML = (str: string): string => {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
};

// CSRF Token management
export const getCSRFToken = (): string | null => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') || null;
};

export const setCSRFToken = (token: string): void => {
  let meta = document.querySelector('meta[name="csrf-token"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'csrf-token');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', token);
};

// Secure random string generation
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

// Password strength checker
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters');
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include both uppercase and lowercase letters');
  }

  if (/\d/.test(password)) {
    score += 0.5;
  } else {
    feedback.push('Include at least one number');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 0.5;
  } else {
    feedback.push('Include at least one special character');
  }

  // Check for common patterns
  const commonPatterns = [
    /^123/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /111111/,
    /000000/,
  ];
  
  if (commonPatterns.some((pattern) => pattern.test(password))) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid common patterns');
  }

  return {
    score: Math.min(4, Math.floor(score)),
    feedback,
    isStrong: score >= 3,
  };
};

// Input validation
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  username: (username: string): boolean => {
    // 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  },

  creditCard: (card: string): boolean => {
    // Luhn algorithm
    const digits = card.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },
};

// Rate limiting helper (client-side)
interface RateLimitState {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitState>();

export const checkRateLimit = (
  key: string,
  maxRequests: number,
  windowMs: number
): boolean => {
  const now = Date.now();
  const state = rateLimitStore.get(key);

  if (!state || now > state.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (state.count >= maxRequests) {
    return false;
  }

  state.count += 1;
  return true;
};

// Secure storage wrapper
export const secureStorage = {
  set: (key: string, value: unknown): void => {
    try {
      const serialized = JSON.stringify(value);
      // In production, you might want to encrypt this
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('SecureStorage set error:', error);
    }
  },

  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('SecureStorage get error:', error);
      return defaultValue;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

// Content Security Policy helpers
export const generateNonce = (): string => {
  return generateSecureToken(16);
};

// Detect suspicious activity
export const detectSuspiciousActivity = (): boolean => {
  const checks = [
    // Check for DevTools
    () => {
      const threshold = 160;
      return (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      );
    },
    // Check for automation
    () => {
      return !!(
        (window as any).webdriver ||
        (navigator as any).webdriver ||
        (window as any).__nightmare
      );
    },
  ];

  return checks.some((check) => {
    try {
      return check();
    } catch {
      return false;
    }
  });
};

// Fingerprint generation (for fraud detection)
export const generateFingerprint = async (): Promise<string> => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency,
    navigator.platform,
  ];

  const fingerprint = components.join('|');
  
  // Hash the fingerprint
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export default {
  sanitizeHTML,
  escapeHTML,
  getCSRFToken,
  setCSRFToken,
  generateSecureToken,
  checkPasswordStrength,
  validators,
  checkRateLimit,
  secureStorage,
  generateNonce,
  detectSuspiciousActivity,
  generateFingerprint,
};
