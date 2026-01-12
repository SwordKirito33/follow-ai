import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logger, LogLevel } from './logger';

describe('Logger', () => {
  beforeEach(() => {
    logger.clearLogs();
    logger.setLevel(LogLevel.DEBUG);
    
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('log levels', () => {
    it('should log debug messages', () => {
      logger.debug('Debug message', { key: 'value' });
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LogLevel.DEBUG);
      expect(logs[0].message).toBe('Debug message');
    });

    it('should log info messages', () => {
      logger.info('Info message');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LogLevel.INFO);
    });

    it('should log warning messages', () => {
      logger.warn('Warning message');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LogLevel.WARN);
    });

    it('should log error messages', () => {
      const error = new Error('Test error');
      logger.error('Error message', error);
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(logs[0].error).toBe(error);
    });
  });

  describe('log filtering', () => {
    it('should filter logs by level', () => {
      logger.setLevel(LogLevel.WARN);
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(2); // Only WARN and ERROR
    });

    it('should get logs by level', () => {
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      
      const warnLogs = logger.getLogsByLevel(LogLevel.WARN);
      expect(warnLogs).toHaveLength(1);
      expect(warnLogs[0].message).toBe('Warning message');
    });
  });

  describe('log management', () => {
    it('should get recent logs', () => {
      for (let i = 0; i < 10; i++) {
        logger.info(`Message ${i}`);
      }
      
      const recentLogs = logger.getRecentLogs(3);
      expect(recentLogs).toHaveLength(3);
      expect(recentLogs[2].message).toBe('Message 9');
    });

    it('should clear logs', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      
      expect(logger.getLogs()).toHaveLength(2);
      
      logger.clearLogs();
      
      expect(logger.getLogs()).toHaveLength(0);
    });

    it('should export logs as JSON', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      
      const exported = logger.exportLogs();
      const parsed = JSON.parse(exported);
      
      expect(parsed).toHaveLength(2);
      expect(parsed[0].message).toBe('Message 1');
    });
  });

  describe('context', () => {
    it('should include context in logs', () => {
      const context = { userId: '123', action: 'login' };
      logger.info('User logged in', context);
      
      const logs = logger.getLogs();
      expect(logs[0].context).toEqual(context);
    });
  });
});
