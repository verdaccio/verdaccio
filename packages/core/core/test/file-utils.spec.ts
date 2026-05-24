import os from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { resolveSafePath, sanitizeFilename } from '../src/file-utils';

describe('resolveSafePath', () => {
  // Use an absolute path that works on all platforms
  const basePath = path.resolve(os.tmpdir(), 'base', 'path');

  test('should resolve valid paths within base directory', () => {
    expect(resolveSafePath(basePath, 'file.txt')).toBe(path.resolve(basePath, 'file.txt'));
    expect(resolveSafePath(basePath, 'subfolder/file.txt')).toBe(
      path.resolve(basePath, 'subfolder/file.txt')
    );
  });

  test('should reject paths traversing outside base directory', () => {
    expect(resolveSafePath(basePath, '../file.txt')).toBeNull();
    expect(resolveSafePath(basePath, '../../file.txt')).toBeNull();
    expect(resolveSafePath(basePath, '/absolute/path/file.txt')).toBeNull();
    expect(resolveSafePath(basePath, 'subfolder/../../file.txt')).toBeNull();
  });

  test('should handle special characters and encoded paths', () => {
    expect(resolveSafePath(basePath, 'file%20with%20spaces.txt')).toBe(
      path.resolve(basePath, 'file with spaces.txt')
    );
    expect(resolveSafePath(basePath, 'file+with+plus.txt')).toBe(
      path.resolve(basePath, 'file+with+plus.txt')
    );
    expect(resolveSafePath(basePath, 'file%2Fwith%2Fencoded%2Fslashes.txt')).toBe(
      path.resolve(basePath, 'file/with/encoded/slashes.txt')
    );
  });

  test('should handle edge cases', () => {
    expect(resolveSafePath(basePath, undefined)).toBeNull();
    expect(resolveSafePath(basePath, '')).toBeNull();
    // '.' and './' resolve to the base path because their relative path is empty
    const resolvedBase = path.resolve(basePath);
    expect(resolveSafePath(basePath, '.')).toBe(resolvedBase);
    expect(resolveSafePath(basePath, './')).toBe(resolvedBase);
  });

  test('should reject malformed paths', () => {
    expect(resolveSafePath(basePath, '%')).toBeNull(); // Invalid URL encoding
    expect(resolveSafePath(basePath, '%2F')).toBeNull(); // Encoded slash attempt
    expect(resolveSafePath(basePath, '%2E%2E%2F')).toBeNull(); // Encoded ../
  });
});

describe('sanitizeFilename', () => {
  test('should preserve directory separators', () => {
    expect(sanitizeFilename('logos/verdaccio.svg')).toBe('logos/verdaccio.svg');
  });

  test('should normalize windows separators to posix', () => {
    expect(sanitizeFilename('logos\\verdaccio.svg')).toBe('logos/verdaccio.svg');
  });

  test('should preserve dot-dot traversal markers so resolveSafePath can reject them', () => {
    expect(sanitizeFilename('..')).toBe('..');
    expect(sanitizeFilename('../secret.txt')).toBe('../secret.txt');
    expect(sanitizeFilename('subfolder/../secret.txt')).toBe('subfolder/../secret.txt');
    expect(sanitizeFilename('..\\secret.txt')).toBe('../secret.txt');
  });

  test('should preserve single-dot segments', () => {
    expect(sanitizeFilename('.')).toBe('.');
    expect(sanitizeFilename('./file.txt')).toBe('./file.txt');
    expect(sanitizeFilename('a/./b')).toBe('a/./b');
  });

  test('should strip null bytes from segments', () => {
    // null byte injection should not survive sanitization (avoids
    // ERR_INVALID_ARG_VALUE crashes and any extension-spoofing risk)
    expect(sanitizeFilename('file\0.txt')).not.toContain('\0');
    expect(sanitizeFilename('logos/evil\0.svg')).not.toContain('\0');
  });

  test('should strip filesystem-reserved characters per segment', () => {
    // `sanitize-filename` strips: < > : " | ? * and control chars
    for (const ch of ['<', '>', ':', '"', '|', '?', '*']) {
      const out = sanitizeFilename(`bad${ch}name.txt`);
      expect(out).not.toContain(ch);
    }
  });

  test('should preserve `/` as separator even when sanitize() would strip it inside a segment', () => {
    // sanity check: the per-segment split must happen before sanitize(),
    // otherwise the separator would be eaten
    const out = sanitizeFilename('a/b/c.txt');
    expect(out.split('/')).toEqual(['a', 'b', 'c.txt']);
  });

  test('should handle empty input and empty segments', () => {
    expect(sanitizeFilename('')).toBe('');
    // leading `/` produces an empty leading segment; downstream resolveSafePath
    // is responsible for rejecting absolute paths
    expect(sanitizeFilename('/foo.txt')).toBe('/foo.txt');
    expect(sanitizeFilename('a//b.txt')).toBe('a//b.txt');
  });

  test('should be idempotent', () => {
    const cases = [
      'logos/verdaccio.svg',
      '../secret.txt',
      'file\0.txt',
      'bad<name>.txt',
      'a/./b/../c.txt',
    ];
    for (const input of cases) {
      expect(sanitizeFilename(sanitizeFilename(input))).toBe(sanitizeFilename(input));
    }
  });
});
