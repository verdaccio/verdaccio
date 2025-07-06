import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Logger } from '@verdaccio/types';

import { getListenAddress, parseAddress } from '../src';

const logger: Logger = {
  warn: vi.fn(),
  error: vi.fn(),
} as any;

describe('address parsing', () => {
  describe('getListenAddress', () => {
    const warn = logger.warn as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('returns a parsed object for a simple port', () => {
      const addr = getListenAddress('4873', logger);

      expect(addr).toEqual({
        proto: 'http',
        host: 'localhost',
        port: '4873',
      });
      expect(warn).not.toHaveBeenCalled();
    });

    test('throws when the single string is invalid', () => {
      expect(() => getListenAddress('not_valid', logger)).toThrow(/Invalid address/i);
      expect(warn).not.toHaveBeenCalled();
    });

    test('uses the first valid element and warns about the rest', () => {
      const addr = getListenAddress(['bad', 'http://localhost:4873', 'unix:/tmp/x.sock'], logger);

      expect(addr).toEqual({
        proto: 'http',
        host: 'localhost',
        port: '4873',
      });

      expect(warn).toHaveBeenCalledTimes(2);
      // expect(warn.mock.calls[0][0]).toMatchObject({ addr: 'bad' });
      expect(warn.mock.calls[1][0]).toMatch(/Multiple listen addresses/i);
    });

    test('throws if every element in the array is invalid', () => {
      expect(() => getListenAddress(['bad1', 'also_bad'], logger)).toThrow(
        /No valid listen addresses/i
      );
      // two warnings, one per invalid element
      expect(warn).toHaveBeenCalledTimes(2);
    });

    test('throws when given an empty array', () => {
      expect(() => getListenAddress([])).toThrow(/array cannot be empty/i);
      expect(warn).not.toHaveBeenCalled();
    });

    test('localhost:4873  (default value)', () => {
      const addr = getListenAddress('localhost:4873');

      expect(addr).toEqual({ proto: 'http', host: 'localhost', port: '4873' });
      expect(warn).not.toHaveBeenCalled();
    });

    test('http://localhost:4873 (explicit protocol)', () => {
      const addr = getListenAddress('http://localhost:4873', logger);

      expect(addr).toEqual({ proto: 'http', host: 'localhost', port: '4873' });
      expect(warn).not.toHaveBeenCalled();
    });

    test('0.0.0.0:4873 (INADDR_ANY)', () => {
      const addr = getListenAddress('0.0.0.0:4873', logger);

      expect(addr).toEqual({ proto: 'http', host: '0.0.0.0', port: '4873' });
      expect(warn).not.toHaveBeenCalled();
    });

    test('https://example.org:4873 (TLS)', () => {
      const addr = getListenAddress('https://example.org:4873', logger);

      expect(addr).toEqual({ proto: 'https', host: 'example.org', port: '4873' });
      expect(warn).not.toHaveBeenCalled();
    });

    test('"[::1]:4873" (IPv6)', () => {
      const addr = getListenAddress('[::1]:4873', logger);

      /* parseAddress collapses brackets & assigns proto http */
      expect(addr).toEqual({ proto: 'http', host: '::1', port: '4873' });
      expect(warn).not.toHaveBeenCalled();
    });

    test('"https:[::1]:4873" (IPv6)', () => {
      const addr = getListenAddress('https:[::1]:4873', logger);

      /* parseAddress collapses brackets & assigns proto http */
      expect(addr).toEqual({ proto: 'https', host: '::1', port: '4873' });
      expect(warn).not.toHaveBeenCalled();
    });

    test('unix:/tmp/verdaccio.sock (Unix socket)', () => {
      const addr = getListenAddress('unix:/tmp/verdaccio.sock', logger);

      expect(addr).toEqual({
        proto: 'unix',
        path: '/tmp/verdaccio.sock',
        host: '/tmp/verdaccio.sock',
      });
      expect(warn).not.toHaveBeenCalled();
    });

    test('http://foo.sock:34 (Unix socket)', () => {
      const addr = getListenAddress('http://foo.sock:34', logger);

      expect(addr).toEqual({
        host: 'foo.sock',
        port: '34',
        proto: 'http',
      });
      expect(warn).not.toHaveBeenCalled();
    });

    test('http://unix:/tmp/verdaccio.sock (HTTP Unix socket)', () => {
      const addr = getListenAddress('http://unix:/tmp/verdaccio.sock', logger);

      expect(addr).toEqual({
        path: '/tmp/verdaccio.sock',
        proto: 'http',
        host: '/tmp/verdaccio.sock',
      });
      expect(warn).not.toHaveBeenCalled();
    });

    test('https://unix:/tmp/verdaccio.sock (HTTPS Unix socket)', () => {
      const addr = getListenAddress('https://unix:/tmp/verdaccio.sock', logger);

      expect(addr).toEqual({
        path: '/tmp/verdaccio.sock',
        proto: 'https',
        host: '/tmp/verdaccio.sock',
      });
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe('parseAddress – documented listen values', () => {
    test('localhost:4873   (default style)', () => {
      expect(parseAddress('localhost:4873')).toEqual({
        proto: 'http',
        host: 'localhost',
        port: '4873',
      });
    });

    test('http://localhost:4873  (explicit protocol)', () => {
      expect(parseAddress('http://localhost:4873')).toEqual({
        proto: 'http',
        host: 'localhost',
        port: '4873',
      });
    });

    test('0.0.0.0:4873  (INADDR_ANY)', () => {
      expect(parseAddress('0.0.0.0:4873')).toEqual({
        proto: 'http',
        host: '0.0.0.0',
        port: '4873',
      });
    });

    test('https://example.org:4873  (HTTPS)', () => {
      expect(parseAddress('https://example.org:4873')).toEqual({
        proto: 'https',
        host: 'example.org',
        port: '4873',
      });
    });

    test('"[::1]:4873"  (IPv6)', () => {
      expect(parseAddress('[::1]:4873')).toEqual({
        proto: 'http',
        host: '::1',
        port: '4873',
      });
    });

    test('unix:/tmp/verdaccio.sock  (Unix socket)', () => {
      expect(parseAddress('unix:/tmp/verdaccio.sock')).toEqual({
        host: '/tmp/verdaccio.sock',
        proto: 'unix',
        path: '/tmp/verdaccio.sock',
      });
    });

    test('https://unix:/tmp/verdaccio.sock  (HTTPS Unix socket)', () => {
      expect(parseAddress('https://unix:/tmp/verdaccio.sock')).toEqual({
        host: '/tmp/verdaccio.sock',
        proto: 'https',
        path: '/tmp/verdaccio.sock',
      });
    });
  });
});
