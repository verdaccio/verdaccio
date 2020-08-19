import { createSalt } from '../src/crypt3';

jest.mock('crypto', () => {
  return {
    randomBytes: (): { toString: () => string } => {
      return {
        toString: (): string => '/UEGzD0RxSNDZA==',
      };
    },
  };
});

describe('createSalt', () => {
  test('should match with the correct salt type', () => {
    expect(createSalt('crypt')).toEqual('/UEGzD0RxSNDZA==');
    expect(createSalt('md5')).toEqual('$1$/UEGzD0RxSNDZA==');
    expect(createSalt('blowfish')).toEqual('$2a$/UEGzD0RxSNDZA==');
    expect(createSalt('sha256')).toEqual('$5$/UEGzD0RxSNDZA==');
    expect(createSalt('sha512')).toEqual('$6$/UEGzD0RxSNDZA==');
  });

  test('should fails on unkwon type', () => {
    expect(function () {
      createSalt('bad');
    }).toThrow(/Unknown salt type at crypt3.createSalt: bad/);
  });

  test('should generate legacy crypt salt by default', () => {
    expect(createSalt()).toEqual(createSalt('crypt'));
  });
});
