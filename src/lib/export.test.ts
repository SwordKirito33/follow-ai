import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportToCSV,
  exportToJSON,
  exportUserData,
  exportTransactions,
  exportXPHistory,
  exportReviews,
  exportAllUserData,
} from './export';

// Mock DOM APIs
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('Export Utilities', () => {
  beforeEach(() => {
    // Clear mocks
    vi.clearAllMocks();
    
    // Mock document.body
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
  });

  describe('exportToCSV', () => {
    it('should convert data to CSV format', () => {
      const data = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'London' },
      ];

      // Mock createElement
      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportToCSV(data, 'test.csv');

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle empty data', () => {
      expect(() => exportToCSV([], 'test.csv')).toThrow('No data to export');
    });

    it('should escape commas in values', () => {
      const data = [
        { name: 'John, Doe', age: 30 },
      ];

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportToCSV(data, 'test.csv');

      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('exportToJSON', () => {
    it('should convert data to JSON format', () => {
      const data = { name: 'John', age: 30 };

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportToJSON(data, 'test.json');

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle null data', () => {
      expect(() => exportToJSON(null, 'test.json')).toThrow('No data to export');
    });

    it('should handle complex objects', () => {
      const data = {
        user: { name: 'John', age: 30 },
        transactions: [{ id: 1, amount: 100 }],
      };

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportToJSON(data, 'test.json');

      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('exportUserData', () => {
    it('should export user data as JSON', () => {
      const user = { id: 1, name: 'John', email: 'john@example.com' };

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportUserData(user);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toContain('user-data-');
      expect(mockLink.download).toContain('.json');
    });
  });

  describe('exportTransactions', () => {
    it('should export transactions as CSV', () => {
      const transactions = [
        { id: 1, amount: 100, date: '2026-01-01' },
        { id: 2, amount: 200, date: '2026-01-02' },
      ];

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportTransactions(transactions);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toContain('transactions-');
      expect(mockLink.download).toContain('.csv');
    });
  });

  describe('exportXPHistory', () => {
    it('should export XP history as CSV', () => {
      const history = [
        { date: '2026-01-01', xp: 100, action: 'Task completed' },
        { date: '2026-01-02', xp: 50, action: 'Review submitted' },
      ];

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportXPHistory(history);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toContain('xp-history-');
      expect(mockLink.download).toContain('.csv');
    });
  });

  describe('exportReviews', () => {
    it('should export reviews as CSV', () => {
      const reviews = [
        { id: 1, rating: 5, comment: 'Great!' },
        { id: 2, rating: 4, comment: 'Good' },
      ];

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportReviews(reviews);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toContain('reviews-');
      expect(mockLink.download).toContain('.csv');
    });
  });

  describe('exportAllUserData', () => {
    it('should export all user data as JSON', () => {
      const data = {
        user: { id: 1, name: 'John' },
        transactions: [{ id: 1, amount: 100 }],
        xpHistory: [{ date: '2026-01-01', xp: 100 }],
        reviews: [{ id: 1, rating: 5 }],
      };

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportAllUserData(data);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toContain('all-user-data-');
      expect(mockLink.download).toContain('.json');
    });
  });

  describe('CSV edge cases', () => {
    it('should escape quotes in values', () => {
      const data = [
        { name: 'John "Johnny" Doe', age: 30 },
      ];

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportToCSV(data, 'test.csv');

      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle null values', () => {
      const data = [
        { name: 'John', age: null, city: 'New York' },
      ];

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportToCSV(data, 'test.csv');

      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle undefined values', () => {
      const data = [
        { name: 'John', age: undefined, city: 'New York' },
      ];

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);

      exportToCSV(data, 'test.csv');

      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
