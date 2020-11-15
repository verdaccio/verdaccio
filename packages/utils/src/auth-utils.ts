import { VerdaccioError, DEFAULT_MIN_LIMIT_PASSWORD } from '@verdaccio/commons-api';
import { RemoteUser, AuthPackageAllow } from '@verdaccio/types';

export interface CookieSessionToken {
  expires: Date;
}

export function validatePassword(
  password: string,
  minLength: number = DEFAULT_MIN_LIMIT_PASSWORD
): boolean {
  return typeof password === 'string' && password.length >= minLength;
}

export type AllowActionCallbackResponse = boolean | undefined;
export type AllowActionCallback = (
  error: VerdaccioError | null,
  allowed?: AllowActionCallbackResponse
) => void;

export type AllowAction = (
  user: RemoteUser,
  pkg: AuthPackageAllow,
  callback: AllowActionCallback
) => void;

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
