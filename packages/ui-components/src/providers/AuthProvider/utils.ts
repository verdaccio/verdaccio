import storage from '../../store/storage';
import { isTokenExpire } from '../../utils';
import { LoginBody } from './types';

export function getDefaultUserState(): LoginBody {
  const token = storage.getItem('token');
  const username = storage.getItem('username');
  const defaultUserState = isTokenExpire(token)
    ? { token: null, username: null }
    : { token, username };

  return defaultUserState;
}
