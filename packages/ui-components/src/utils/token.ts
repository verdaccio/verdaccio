import { Base64 } from 'js-base64';
import { isNumber } from 'lodash-es';

// ms until the token reports as expired (30s guard included); null when undecodable
export function tokenExpireInMs(token: string | null): number | null {
  if (typeof token !== 'string') {
    return null;
  }

  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  let exp: number;
  try {
    exp = JSON.parse(Base64.decode(payload)).exp;
  } catch (error: unknown) {
    // never log the token itself: even a malformed one is credential material
    console.error('Invalid token:', error);
    return null;
  }

  if (!exp || !isNumber(exp)) {
    return null;
  }
  // Report as expired before (real expire time - 30s)
  return exp * 1000 - 30000 - Date.now();
}

export function isTokenExpire(token: string | null): boolean {
  const remaining = tokenExpireInMs(token);
  return remaining === null || remaining <= 0;
}
