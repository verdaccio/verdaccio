import os from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { isSecureFilename, resolveSafePath } from '../src/file-utils';

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

describe('isSecureFilename', () => {
  test('should accept valid filenames', () => {
    expect(isSecureFilename('file.txt')).toBe(true);
    expect(isSecureFilename('document.pdf')).toBe(true);
    expect(isSecureFilename('image.png')).toBe(true);
    expect(isSecureFilename('script.js')).toBe(true);
    expect(isSecureFilename('config.json')).toBe(true);
    expect(isSecureFilename('data.csv')).toBe(true);
    expect(isSecureFilename('archive.tar.gz')).toBe(true);
    expect(isSecureFilename('package-1.0.0.tgz')).toBe(true);
    expect(isSecureFilename('file_with_underscores.txt')).toBe(true);
    expect(isSecureFilename('file with spaces.txt')).toBe(true);
    expect(isSecureFilename('file-with-dashes.txt')).toBe(true);
    expect(isSecureFilename('file.multiple.extensions.tar.gz')).toBe(true);
  });

  test('should reject filenames with null bytes', () => {
    expect(isSecureFilename('file\0.txt')).toBe(false);
    expect(isSecureFilename('file.txt\0')).toBe(false);
    expect(isSecureFilename('\0malicious')).toBe(false);
  });

  test('should reject filenames with directory traversal patterns', () => {
    expect(isSecureFilename('../file.txt')).toBe(false);
    expect(isSecureFilename('path/../file.txt')).toBe(false);
    expect(isSecureFilename('../../evil.txt')).toBe(false);
    expect(isSecureFilename('subdir/../file.txt')).toBe(false);
    expect(isSecureFilename('file..txt')).toBe(false); // Contains .. pattern
  });

  test('should reject filenames starting with dash (command injection prevention)', () => {
    expect(isSecureFilename('-dangerous')).toBe(false);
    expect(isSecureFilename('--flag')).toBe(false);
    expect(isSecureFilename('-rf')).toBe(false);
    expect(isSecureFilename('-file.txt')).toBe(false);
  });

  test('should reject filenames with invalid Windows characters', () => {
    expect(isSecureFilename('file<test.txt')).toBe(false);
    expect(isSecureFilename('file>test.txt')).toBe(false);
    expect(isSecureFilename('file:test.txt')).toBe(false);
    expect(isSecureFilename('file"test.txt')).toBe(false);
    expect(isSecureFilename('file|test.txt')).toBe(false);
    expect(isSecureFilename('file?test.txt')).toBe(false);
    expect(isSecureFilename('file*test.txt')).toBe(false);
  });

  test('should reject Windows reserved names', () => {
    // Basic reserved names
    expect(isSecureFilename('CON')).toBe(false);
    expect(isSecureFilename('PRN')).toBe(false);
    expect(isSecureFilename('AUX')).toBe(false);
    expect(isSecureFilename('NUL')).toBe(false);

    // COM ports
    expect(isSecureFilename('COM1')).toBe(false);
    expect(isSecureFilename('COM2')).toBe(false);
    expect(isSecureFilename('COM9')).toBe(false);

    // LPT ports
    expect(isSecureFilename('LPT1')).toBe(false);
    expect(isSecureFilename('LPT2')).toBe(false);
    expect(isSecureFilename('LPT9')).toBe(false);

    // Case insensitive
    expect(isSecureFilename('con')).toBe(false);
    expect(isSecureFilename('Con')).toBe(false);
    expect(isSecureFilename('CON')).toBe(false);
    expect(isSecureFilename('prn')).toBe(false);
    expect(isSecureFilename('aux')).toBe(false);
    expect(isSecureFilename('nul')).toBe(false);

    // With extensions
    expect(isSecureFilename('CON.txt')).toBe(false);
    expect(isSecureFilename('PRN.log')).toBe(false);
    expect(isSecureFilename('AUX.data')).toBe(false);
    expect(isSecureFilename('COM1.config')).toBe(false);
    expect(isSecureFilename('LPT1.out')).toBe(false);
  });

  test('should accept filenames that contain reserved names but are not reserved themselves', () => {
    // These should be allowed as they're not exactly reserved names
    expect(isSecureFilename('CONSOLE.txt')).toBe(true);
    expect(isSecureFilename('PRINTER.log')).toBe(true);
    expect(isSecureFilename('mycon.txt')).toBe(true);
    expect(isSecureFilename('confile.txt')).toBe(true);
    expect(isSecureFilename('COM10.txt')).toBe(true); // COM10 is not reserved (only COM1-COM9)
    expect(isSecureFilename('LPT10.txt')).toBe(true); // LPT10 is not reserved (only LPT1-LPT9)
  });

  test('should handle edge cases', () => {
    expect(isSecureFilename('')).toBe(true); // Empty string should be handled elsewhere
    expect(isSecureFilename('.')).toBe(true); // Current directory reference
    expect(isSecureFilename('a')).toBe(true); // Single character
    expect(isSecureFilename('file')).toBe(true); // No extension
  });

  test('should reject complex dangerous combinations', () => {
    expect(isSecureFilename('../../../etc/passwd')).toBe(false);
    expect(isSecureFilename('..\\..\\windows\\system32')).toBe(false);
    expect(isSecureFilename('-rf /')).toBe(false);
    expect(isSecureFilename('file\0hidden.txt')).toBe(false);
    expect(isSecureFilename('CON\0.txt')).toBe(false);
  });
});
