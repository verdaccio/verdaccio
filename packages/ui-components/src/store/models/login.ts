import { createModel } from '@rematch/core';
import i18next from 'i18next';

import type { RootModel } from '.';
import { isTokenExpire } from '../../utils';
import API from '../api';
import storage from '../storage';
import { APIRoute } from './routes';
import { stripTrailingSlash } from './utils';

export const HEADERS = {
  JSON: 'application/json',
};

export type LoginError = {
  type: string;
  description: string;
};

export type LoginResponse = {
  username: string | null;
  token: string | null;
};

export type LoginBody = {
  error?: LoginError;
} & LoginResponse;

export function getDefaultUserState(): LoginBody {
  const token = storage.getItem('token');
  const username = storage.getItem('username');
  const defaultUserState = isTokenExpire(token)
    ? { token: null, username: null }
    : { token, username };

  return defaultUserState;
}

const defaultUserState: LoginBody = getDefaultUserState();

/**
 *
 * @category Model
 */
export const login = createModel<RootModel>()({
  state: {
    username: defaultUserState.username,
    token: defaultUserState.token,
  },
  reducers: {
    logOutUser(state) {
      storage.removeItem('username');
      storage.removeItem('token');
      return {
        ...state,
        username: null,
        token: null,
      };
    },
    addError(state, error: LoginError) {
      return {
        ...state,
        error,
      };
    },
    clearError(state) {
      return {
        ...state,
        error: undefined,
      };
    },
    logInUser(state, response: LoginResponse) {
      // we might persist this in another way with
      storage.setItem('username', response.username as string);
      storage.setItem('token', response.token as string);
      return {
        ...state,
        token: response.token as string,
        username: response.username as string,
      };
    },
  },
  effects: (dispatch) => ({
    async getUser({ username, password }, state) {
      const basePath = stripTrailingSlash(state.configuration.config.base);
      try {
        const payload: LoginResponse = await API.request(`${basePath}${APIRoute.LOGIN}`, 'POST', {
          body: JSON.stringify({ username, password }),
          headers: {
            Accept: HEADERS.JSON,
            'Content-Type': HEADERS.JSON,
          },
        });
        dispatch.login.logInUser(payload);
        dispatch.packages.getPackages(undefined);
      } catch (error: any) {
        dispatch.login.addError({
          type: 'error',
          description: i18next.t('form-validation.unable-to-sign-in'),
        });
      }
    },
  }),
});
