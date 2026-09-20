import { clearAuth, getAuth } from '../../store/storage';
import { isTokenExpire } from '../../utils';
import type { LoginBody } from './types';

export function getDefaultUserState(): LoginBody {
  const { token, username } = getAuth();
  return isTokenExpire(token) ? { token: null, username: null } : { token, username };
}

/**
 * Drop an expired token from storage on boot: the api client attaches whatever
 * is stored, and the server treats an expired bearer as anonymous while the
 * header still claims the user is logged in.
 */
export function clearExpiredAuth(): void {
  const { token } = getAuth();
  if (token && isTokenExpire(token)) {
    clearAuth();
  }
}

export const AUTH_ERROR_FALLBACK = 'Authentication failed';

export function normalizeAuthError(err: any): Error {
  const message =
    err?.info?.message || err?.response?.data?.message || err?.message || AUTH_ERROR_FALLBACK;

  return new Error(message);
}

/**
 * Message to display for a failed auth request: the server's own message when
 * there is one, otherwise the (already translated) fallback text.
 */
export function authErrorMessage(err: any, translatedFallback: string): string {
  // errors without an HTTP code (network failures, unexpected exceptions) carry
  // technical messages like "Failed to fetch" — not something to show the user
  if (typeof err?.code !== 'number') {
    return translatedFallback;
  }
  const { message } = normalizeAuthError(err);
  return message && message !== AUTH_ERROR_FALLBACK ? message : translatedFallback;
}
