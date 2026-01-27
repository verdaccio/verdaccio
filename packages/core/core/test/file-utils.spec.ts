import os from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { resolveSafePath } from '../src/file-utils';

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
