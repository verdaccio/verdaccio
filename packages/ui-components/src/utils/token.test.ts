import { describe, expect, test, vi } from 'vitest';

import { isTokenExpire, tokenExpireInMs } from './token';
import {
  generateInvalidToken,
  generateTokenWithExpirationAsString,
  generateTokenWithOutExpiration,
  generateTokenWithTimeRange,
} from './token-generate';

console.error = vi.fn();

describe('isTokenExpire', (): void => {
  test('isTokenExpire - null is not a valid payload', (): void => {
    expect(isTokenExpire(null)).toBeTruthy();
  });

  test('isTokenExpire - token is not a valid payload', (): void => {
    expect(isTokenExpire('not_a_valid_token')).toBeTruthy();
  });

  test('isTokenExpire - token should not expire in 24 hrs range', (): void => {
    const token = generateTokenWithTimeRange(24);
    expect(isTokenExpire(token)).toBeFalsy();
  });

  test('isTokenExpire - token should expire for current time', (): void => {
    const token = generateTokenWithTimeRange();
    expect(isTokenExpire(token)).toBeTruthy();
  });

  test('isTokenExpire - token expiration is not available', (): void => {
    const token = generateTokenWithOutExpiration();
    expect(isTokenExpire(token)).toBeTruthy();
  });

  test('isTokenExpire - token is not a valid json token', (): void => {
    const NODE_MAJOR_VERSION = +process.versions.node.split('.')[0];
    const errorToken = new SyntaxError(
      NODE_MAJOR_VERSION >= 20
        ? 'Unexpected token \'i\', "invalidtoken" is not valid JSON'
        : 'Unexpected token i in JSON at position 0'
    );
    const token = generateInvalidToken();
    expect(isTokenExpire(token)).toBeTruthy();
    // the token itself must NOT be logged: it is credential material
    expect(console.error).toHaveBeenCalledWith('Invalid token:', errorToken);
  });

  test('isTokenExpire - token expiration is not a number', (): void => {
    const token = generateTokenWithExpirationAsString();
    expect(isTokenExpire(token)).toBeTruthy();
  });
});

describe('tokenExpireInMs', (): void => {
  test('returns null for undecodable tokens', (): void => {
    expect(tokenExpireInMs(null)).toBeNull();
    expect(tokenExpireInMs('not_a_valid_token')).toBeNull();
    expect(tokenExpireInMs(generateTokenWithOutExpiration())).toBeNull();
    expect(tokenExpireInMs(generateTokenWithExpirationAsString())).toBeNull();
  });

  test('returns a positive delay for a token expiring in the future', (): void => {
    expect(tokenExpireInMs(generateTokenWithTimeRange(24))).toBeGreaterThan(0);
  });

  test('returns a non-positive delay for an expired token', (): void => {
    expect(tokenExpireInMs(generateTokenWithTimeRange())).toBeLessThanOrEqual(0);
  });
});
