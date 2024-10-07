import { describe, expect, test, vi } from 'vitest';

import { EncryptionMethod, createSalt } from '../src/crypt3';

vi.mock('../src/crypto-utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/crypto-utils')>()),
  randomBytes: (len: number): { toString: () => string } => {
    return {
      toString: (): string => '/UEGzD0RxSNDZA=='.substring(0, len),
    };
  },
}));

describe('createSalt', () => {
  test('should match with the correct salt type', () => {
    expect(createSalt(EncryptionMethod.crypt)).toEqual('/U');
    expect(createSalt(EncryptionMethod.md5)).toEqual('$1$/UEGzD0RxS');
    expect(createSalt(EncryptionMethod.blowfish)).toEqual('$2a$/UEGzD0RxS');
    expect(createSalt(EncryptionMethod.sha256)).toEqual('$5$/UEGzD0RxS');
    expect(createSalt(EncryptionMethod.sha512)).toEqual('$6$/UEGzD0RxS');
  });

  test('should fails on unkwon type', () => {
    expect(function () {
      createSalt('bad' as any);
    }).toThrow(/Unknown salt type at crypt3.createSalt: bad/);
  });

  test('should generate legacy crypt salt by default', () => {
    expect(createSalt()).toEqual(createSalt(EncryptionMethod.crypt));
  });
});
