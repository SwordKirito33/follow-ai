import { describe, it, expect } from 'vitest';
import {
  countCharacters,
  validateExperienceText,
  detectRepetitiveText,
  detectLanguage,
} from './validation';

describe('Form Validations', () => {
  describe('countCharacters', () => {
    it('should count ASCII characters correctly', () => {
      expect(countCharacters('Hello')).toBe(5);
      expect(countCharacters('Hello World')).toBe(11);
    });

    it('should count Chinese characters correctly', () => {
      expect(countCharacters('你好')).toBe(2);
      expect(countCharacters('你好世界')).toBe(4);
    });

    it('should count emoji correctly', () => {
      expect(countCharacters('😀')).toBe(1);
      expect(countCharacters('Hello😀')).toBe(6);
    });

    it('should trim whitespace', () => {
      expect(countCharacters('  Hello  ')).toBe(5);
      expect(countCharacters('\n\tHello\n\t')).toBe(5);
    });

    it('should handle empty strings', () => {
      expect(countCharacters('')).toBe(0);
      expect(countCharacters('   ')).toBe(0);
    });
  });

  describe('validateExperienceText', () => {
    it('should validate valid experience text', () => {
      const longText = 'This is a valid experience with enough content to pass the minimum character requirement for validation process and more content here';
      const result = validateExperienceText(longText);
      expect(result.valid).toBe(true);
      expect(result.charCount).toBeGreaterThan(100);
    });

    it('should reject text that is too short', () => {
      const result = validateExperienceText('Short');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('at least');
    });

    it('should return proper character count', () => {
      const result = validateExperienceText('test');
      expect(result.charCount).toBe(4);
    });
  });

  describe('detectRepetitiveText', () => {
    it('should detect highly repetitive text', () => {
      const result = detectRepetitiveText('word word word word word word word word word word word word word word word');
      expect(result).toBe(true);
    });

    it('should not flag normal text', () => {
      const result = detectRepetitiveText('This is a normal text with varied content and different words');
      expect(result).toBe(false);
    });

    it('should ignore short text', () => {
      const result = detectRepetitiveText('test test');
      expect(result).toBe(false);
    });
  });

  describe('detectLanguage', () => {
    it('should detect English', () => {
      expect(detectLanguage('Hello World')).toBe('en');
      expect(detectLanguage('This is English text')).toBe('en');
    });

    it('should detect Chinese', () => {
      expect(detectLanguage('你好世界')).toBe('zh');
      expect(detectLanguage('这是中文文本')).toBe('zh');
    });

    it('should handle mixed content', () => {
      const result = detectLanguage('Hello 你好 World');
      expect(['en', 'zh', 'auto']).toContain(result);
    });

    it('should trim whitespace', () => {
      expect(detectLanguage('  Hello World  ')).toBe('en');
      expect(detectLanguage('  你好世界  ')).toBe('zh');
    });
  });
});
