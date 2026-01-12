import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rateLimitedFetch, get, post, put, del } from './api-client';

// Mock fetch
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  describe('rateLimitedFetch', () => {
    it('should make a fetch request', async () => {
      await rateLimitedFetch('https://api.example.com/data');
      
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', undefined);
    });

    it('should pass options to fetch', async () => {
      const options = { method: 'POST', body: 'test' };
      await rateLimitedFetch('https://api.example.com/data', options);
      
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', options);
    });

    it('should enforce rate limiting', async () => {
      // Make many requests quickly
      const requests = Array.from({ length: 150 }, () =>
        rateLimitedFetch('https://api.example.com/data')
      );
      
      // Some requests should be rejected
      const results = await Promise.allSettled(requests);
      const rejected = results.filter(r => r.status === 'rejected');
      
      expect(rejected.length).toBeGreaterThan(0);
    });
  });

  describe('get', () => {
    it('should make a GET request', async () => {
      const result = await get('https://api.example.com/data');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        { method: 'GET' }
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw on HTTP error', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
      });
      
      await expect(get('https://api.example.com/data')).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('post', () => {
    it('should make a POST request with JSON body', async () => {
      const data = { name: 'Test' };
      const result = await post('https://api.example.com/data', data);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw on HTTP error', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
      });
      
      await expect(post('https://api.example.com/data', {})).rejects.toThrow('HTTP error! status: 400');
    });
  });

  describe('put', () => {
    it('should make a PUT request with JSON body', async () => {
      const data = { name: 'Updated' };
      const result = await put('https://api.example.com/data', data);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw on HTTP error', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
      });
      
      await expect(put('https://api.example.com/data', {})).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('del', () => {
    it('should make a DELETE request', async () => {
      const result = await del('https://api.example.com/data');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        { method: 'DELETE' }
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw on HTTP error', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
      });
      
      await expect(del('https://api.example.com/data')).rejects.toThrow('HTTP error! status: 404');
    });
  });
});
