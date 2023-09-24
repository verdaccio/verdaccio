// eslint-disable-next-line jest/no-mocks-import
import {
  generateInvalidToken,
  generateTokenWithExpirationAsString,
  generateTokenWithOutExpiration,
  generateTokenWithTimeRange,
} from '../../jest/unit/components/__mocks__/token';
import { isTokenExpire } from './token';

/* eslint-disable no-console */
console.error = jest.fn();

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
    const result = ['Invalid token:', errorToken, 'xxxxxx.aW52YWxpZHRva2Vu.xxxxxx'];
    expect(isTokenExpire(token)).toBeTruthy();
    expect(console.error).toHaveBeenCalledWith(...result);
  });

  test('isTokenExpire - token expiration is not a number', (): void => {
    const token = generateTokenWithExpirationAsString();
    expect(isTokenExpire(token)).toBeTruthy();
  });
});
