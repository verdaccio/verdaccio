import { getAuth } from '../../store/storage';
import { isTokenExpire } from '../../utils';
import type { LoginBody } from './types';

export function getDefaultUserState(): LoginBody {
  const { token, username } = getAuth();
  return isTokenExpire(token) ? { token: null, username: null } : { token, username };
}

export function normalizeAuthError(err: any): Error {
  const message =
    err?.info?.message || err?.response?.data?.message || err?.message || 'Authentication failed';

  return new Error(message);
}
