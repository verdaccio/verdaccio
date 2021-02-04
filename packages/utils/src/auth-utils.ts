import { DEFAULT_MIN_LIMIT_PASSWORD } from '@verdaccio/commons-api';

export interface CookieSessionToken {
  expires: Date;
}

export function validatePassword(
  password: string,
  minLength: number = DEFAULT_MIN_LIMIT_PASSWORD
): boolean {
  return typeof password === 'string' && password.length >= minLength;
}

export function createSessionToken(): CookieSessionToken {
  const tenHoursTime = 10 * 60 * 60 * 1000;
  return {
    // npmjs.org sets 10h expire
    expires: new Date(Date.now() + tenHoursTime),
  };
}

export function getAuthenticatedMessage(user: string): string {
  return `you are authenticated as '${user}'`;
}

export function buildUserBuffer(name: string, password: string): Buffer {
  return Buffer.from(`${name}:${password}`, 'utf8');
}
