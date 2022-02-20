import { describe, expect, test } from 'vitest';

import { EncryptionMethod, createSalt } from '../src/crypt3';

describe('createSalt', () => {
  test('md5', () => {
    expect(createSalt(EncryptionMethod.md5).startsWith('$1$')).toBeTruthy();
    expect(createSalt(EncryptionMethod.md5)).toHaveLength(19);
  });

  test('crypt', () => {
    expect(createSalt(EncryptionMethod.crypt)).toHaveLength(4);
  });

  test('blowfish', () => {
    expect(createSalt(EncryptionMethod.blowfish).startsWith('$2a$')).toBeTruthy();
    expect(createSalt(EncryptionMethod.blowfish)).toHaveLength(20);
  });

  test('sha256', () => {
    expect(createSalt(EncryptionMethod.sha256).startsWith('$5$')).toBeTruthy();
    expect(createSalt(EncryptionMethod.sha256)).toHaveLength(19);
  });

  test('sha512', () => {
    expect(createSalt(EncryptionMethod.sha512).startsWith('$6$')).toBeTruthy();
    expect(createSalt(EncryptionMethod.sha512)).toHaveLength(19);
  });

  test('should fails on unkwon type', () => {
    expect(function () {
      createSalt('bad' as any);
    }).toThrow(/Unknown salt type at crypt3.createSalt: bad/);
  });

  test('should generate legacy crypt salt by default', () => {
    expect(createSalt()).toHaveLength(createSalt(EncryptionMethod.crypt).length);
  });
});
