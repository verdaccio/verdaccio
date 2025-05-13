import { describe, expect, test } from 'vitest';

import { cryptoUtils } from '../src';

describe('Crypto Utilities', () => {
  describe('createTarballHash', () => {
    test('should create a tarball hash', () => {
      const hash = cryptoUtils.createTarballHash();
      expect(hash).toBeDefined();
      expect(hash.update).toBeDefined();
      expect(hash.digest).toBeDefined();
    });
  });

  describe('stringToMD5', () => {
    test('should return correct md5 hash for a string', () => {
      const hash = cryptoUtils.stringToMD5('test');
      expect(hash).toBe('098f6bcd4621d373cade4e832627b4f6');
    });

    test('should return correct md5 hash for a Buffer', () => {
      const hash = cryptoUtils.stringToMD5(Buffer.from('test'));
      expect(hash).toBe('098f6bcd4621d373cade4e832627b4f6');
    });
  });

  describe('generateRandomHexString', () => {
    test('should generate a hex string of default length', () => {
      const hex = cryptoUtils.generateRandomHexString();
      expect(typeof hex).toBe('string');
      expect(hex.length).toBe(16); // 8 bytes * 2 hex chars per byte
    });

    test('should generate a hex string of specified length', () => {
      const hex = cryptoUtils.generateRandomHexString(4);
      expect(hex.length).toBe(8); // 4 bytes * 2 hex chars per byte
    });

    test('should generate different values on each call', () => {
      const hex1 = cryptoUtils.generateRandomHexString();
      const hex2 = cryptoUtils.generateRandomHexString();
      expect(hex1).not.toBe(hex2);
    });
  });

  describe('mask', () => {
    test('should mask a string with default charNum', () => {
      expect(cryptoUtils.mask('abcdefgh')).toBe('abc...fgh');
    });

    test('should mask a string with custom charNum', () => {
      expect(cryptoUtils.mask('abcdefgh', 2)).toBe('ab...gh');
    });

    test('should handle short strings gracefully', () => {
      expect(cryptoUtils.mask('abc', 2)).toBe('ab...bc');
      expect(cryptoUtils.mask('ab', 1)).toBe('a...b');
      expect(cryptoUtils.mask('a', 1)).toBe('a...a');
    });

    test('should handle empty string', () => {
      expect(cryptoUtils.mask('', 2)).toBe('...');
    });
  });
});
