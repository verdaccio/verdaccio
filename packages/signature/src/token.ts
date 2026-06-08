import type { BasicPayload } from './types';

/**
 *
 * @param credentials
 * @returns
 */
export function parseBasicPayload(credentials: string): BasicPayload {
  if (credentials.startsWith('{')) {
    try {
      const parsed = JSON.parse(credentials);

      if (typeof parsed.user === 'string' && typeof parsed.password === 'string') {
        return {
          user: parsed.user,
          password: parsed.password,
          tokenKey: typeof parsed.tokenKey === 'string' ? parsed.tokenKey : undefined,
        };
      }
    } catch {
      // not a JSON payload, fall through to the legacy "user:password" parsing
    }
  }

  const index = credentials.indexOf(':');
  if (index < 0) {
    return;
  }

  const user: string = credentials.slice(0, index);
  const password: string = credentials.slice(index + 1);

  return { user, password };
}
