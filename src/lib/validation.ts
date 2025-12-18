import { MIN_EXPERIENCE_CHARS } from './constants';

/**
 * Unicode-aware character counting
 * CRITICAL: Use Array.from() for multi-byte characters
 * 
 * Examples:
 * - "Hello" = 5 chars
 * - "你好" = 2 chars (NOT 6 bytes)
 * - "Hello你好😀" = 8 chars
 */
export function countCharacters(value: string): number {
  const trimmed = value.trim();
  return Array.from(trimmed).length;
}

/**
 * Validate experience text
 */
export function validateExperienceText(value: string): {
  valid: boolean;
  charCount: number;
  message: string;
} {
  const charCount = countCharacters(value);
  
  if (charCount < MIN_EXPERIENCE_CHARS) {
    return {
      valid: false,
      charCount,
      message: `Experience must be at least ${MIN_EXPERIENCE_CHARS} characters (currently ${charCount})`,
    };
  }

  if (detectRepetitiveText(value)) {
    return {
      valid: false,
      charCount,
      message: 'Experience appears to be repetitive. Please provide meaningful content.',
    };
  }

  return {
    valid: true,
    charCount,
    message: 'Valid',
  };
}

/**
 * Detect repetitive/spam text
 */
export function detectRepetitiveText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 20) return false;

  const segments = trimmed.split(/\s+/);
  if (segments.length < 5) return false;

  const freqMap = new Map<string, number>();
  segments.forEach(seg => {
    const normalized = seg.toLowerCase();
    freqMap.set(normalized, (freqMap.get(normalized) || 0) + 1);
  });

  const maxFreq = Math.max(...freqMap.values());
  return maxFreq > segments.length * 0.5;
}

/**
 * Detect language (simple heuristic)
 */
export function detectLanguage(text: string): 'zh' | 'en' | 'auto' {
  const trimmed = text.trim();
  
  const cjkRegex = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g;
  const cjkMatches = trimmed.match(cjkRegex);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;
  
  const asciiRegex = /[a-zA-Z]/g;
  const asciiMatches = trimmed.match(asciiRegex);
  const asciiCount = asciiMatches ? asciiMatches.length : 0;
  
  const totalChars = countCharacters(trimmed);
  const cjkRatio = cjkCount / totalChars;
  
  if (cjkRatio > 0.3) return 'zh';
  if (asciiCount > totalChars * 0.5) return 'en';
  return 'auto';
}

