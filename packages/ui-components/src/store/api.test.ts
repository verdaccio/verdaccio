import { beforeEach, describe, expect, it, vi } from 'vitest';

import API, { CustomError, handleResponseType } from './api';
import storage from './storage';

// Mock the storage dependency (assuming it's a default export)
vi.mock('./storage', () => ({
  default: {
    getItem: vi.fn(),
  },
}));

describe('API Module', () => {
  beforeEach(() => {
    // This is the safest way to mock globals in Vitest
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  describe('CustomError', () => {
    it('should create an error with a name and status code', () => {
      const err = new CustomError('Unauthorized', 401);
      expect(err.message).toBe('Unauthorized');
      expect(err.code).toBe(401);
      expect(err.name).toBe('CustomError');
    });

    it('should default to code 500', () => {
      const err = new CustomError('Server Error');
      expect(err.code).toBe(500);
    });
  });

  describe('handleResponseType', () => {
    it('should process JSON content correctly', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ user: 'verdaccio' }),
      } as unknown as Response;

      const [ok, data, status] = await handleResponseType(mockResponse);
      expect(ok).toBe(true);
      expect(data).toEqual({ user: 'verdaccio' });
      expect(status).toBe(200);
    });

    it('should process .tgz files as blobs via URL matching', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        url: 'https://registry.npmjs.org/package/-/file.tgz',
        headers: new Headers({ 'Content-Type': 'application/octet-stream' }),
        blob: vi.fn().mockResolvedValue(new Blob(['archive-data'])),
      } as unknown as Response;

      const [ok, data] = await handleResponseType(mockResponse);
      expect(ok).toBe(true);
      expect(data).toBeInstanceOf(Blob);
    });
  });

  describe('API.request', () => {
    it('should inject Authorization header when token exists', async () => {
      // Setup: Mock storage to return a token
      vi.mocked(storage.getItem).mockReturnValue('valid-jwt-token');

      // Setup: Mock fetch response
      const mockFetch = vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ success: true }),
      } as unknown as Response);

      await API.request('/api/packages');

      // Verify the call
      const [url, init] = mockFetch.mock.calls[0];
      const headers = init?.headers as Headers;

      expect(url).toBe('/api/packages');
      expect(headers.get('Authorization')).toBe('Bearer valid-jwt-token');
      expect(headers.get('x-client')).toBe('verdaccio-ui');
      expect(init?.credentials).toBe('include');
    });

    it('should reject when the fetch call fails (network error)', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network Failure'));

      await expect(API.request('/any-url')).rejects.toThrow('Network Failure');
    });

    it('should reject with CustomError when response.ok is false (text response)', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 403,
        headers: new Headers({ 'Content-Type': 'text/plain' }),
        text: vi.fn().mockResolvedValue('Forbidden'),
      } as unknown as Response);

      try {
        await API.request('/admin');
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toBe('Forbidden');
        expect(error.code).toBe(403);
      }
    });

    it('should reject with CustomError when response.ok is false (JSON response)', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ error: 'package not found' }),
      } as unknown as Response);

      try {
        await API.request('/api/packages/missing');
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toBe('package not found');
        expect(error.code).toBe(404);
      }
    });
  });
});
