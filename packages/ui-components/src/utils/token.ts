import { Base64 } from 'js-base64';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

export function isTokenExpire(token: string | null): boolean {
  if (!isString(token)) {
    return true;
  }

  const [, payload] = token.split('.');

  if (!payload) {
    return true;
  }

  let exp: number;
  try {
    exp = JSON.parse(Base64.decode(payload)).exp;
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Invalid token:', error, token);
    return true;
  }

  if (!exp || !isNumber(exp)) {
    return true;
  }
  // Report as expire before (real expire time - 30s)
  const jsTimestamp = exp * 1000 - 30000;
  const expired = Date.now() >= jsTimestamp;

  return expired;
}
