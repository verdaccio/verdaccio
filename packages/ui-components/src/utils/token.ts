import { Base64 } from 'js-base64';
import { isNumber } from 'lodash-es';

export function isTokenExpire(token: string | null): boolean {
  if (typeof token !== 'string') {
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
