/**
 * Form Validation Utilities
 * Provides comprehensive validation functions for forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Password validation with strength requirements
 */
export const validatePassword = (
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): ValidationResult => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true };
};

/**
 * Calculate password strength (0-100)
 */
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  // Length contribution (up to 30 points)
  strength += Math.min(password.length * 3, 30);

  // Character variety (up to 40 points)
  if (/[a-z]/.test(password)) strength += 10;
  if (/[A-Z]/.test(password)) strength += 10;
  if (/\d/.test(password)) strength += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;

  // Bonus for mixing (up to 30 points)
  const varietyCount = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ].filter(Boolean).length;

  if (varietyCount >= 3) strength += 15;
  if (varietyCount === 4) strength += 15;

  return Math.min(strength, 100);
};

/**
 * Username validation
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 30) {
    return { isValid: false, error: 'Username must be less than 30 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { isValid: true };
};

/**
 * URL validation
 */
export const validateURL = (url: string, required = false): ValidationResult => {
  if (!url) {
    return required ? { isValid: false, error: 'URL is required' } : { isValid: true };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

/**
 * Phone number validation (basic)
 */
export const validatePhone = (phone: string, required = false): ValidationResult => {
  if (!phone) {
    return required ? { isValid: false, error: 'Phone number is required' } : { isValid: true };
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
};

/**
 * Required field validation
 */
export const validateRequired = (value: any, fieldName = 'Field'): ValidationResult => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

/**
 * Number range validation
 */
export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number,
  fieldName = 'Value'
): ValidationResult => {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (min !== undefined && value < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }

  return { isValid: true };
};

/**
 * Text length validation
 */
export const validateLength = (
  text: string,
  min?: number,
  max?: number,
  fieldName = 'Text'
): ValidationResult => {
  if (min !== undefined && text.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }

  if (max !== undefined && text.length > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max} characters` };
  }

  return { isValid: true };
};

/**
 * Match validation (e.g., confirm password)
 */
export const validateMatch = (
  value1: string,
  value2: string,
  fieldName = 'Values'
): ValidationResult => {
  if (value1 !== value2) {
    return { isValid: false, error: `${fieldName} do not match` };
  }

  return { isValid: true };
};

/**
 * Credit card number validation (Luhn algorithm)
 */
export const validateCreditCard = (cardNumber: string): ValidationResult => {
  const cleaned = cardNumber.replace(/\s/g, '');

  if (!/^\d{13,19}$/.test(cleaned)) {
    return { isValid: false, error: 'Please enter a valid card number' };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Please enter a valid card number' };
  }

  return { isValid: true };
};

export default {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  validateUsername,
  validateURL,
  validatePhone,
  validateRequired,
  validateNumberRange,
  validateLength,
  validateMatch,
  validateCreditCard,
};
