import i18next from 'i18next';
import { Base64 } from 'js-base64';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import { HEADERS } from '../../lib/constants';

import API from './api';

interface PayloadInterface {
  exp: number;
}

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
  } catch (error) {
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

export interface LoginBody {
  username?: string;
  token?: string;
  error?: LoginError;
}

export interface LoginError {
  type: string;
  description: string;
}

export async function makeLogin(username?: string, password?: string): Promise<LoginBody> {
  // checks isEmpty
  if (isEmpty(username) || isEmpty(password)) {
    const error = {
      type: 'error',
      description: i18next.t('form-validation.username-or-password-cant-be-empty'),
    };
    return { error };
  }

  try {
    const response: LoginBody = await API.request('login', 'POST', {
      body: JSON.stringify({ username, password }),
      headers: {
        Accept: HEADERS.JSON,
        'Content-Type': HEADERS.JSON,
      },
    });
    const result: LoginBody = {
      username: response.username,
      token: response.token,
    };
    return result;
  } catch (e) {
    console.error('login error', e.message);
    const error = {
      type: 'error',
      description: i18next.t('form-validation.unable-to-sign-in'),
    };
    return { error };
  }
}
