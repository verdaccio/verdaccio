import { createModel } from '@rematch/core';
import i18next from 'i18next';

import type { RootModel } from '.';
import { Route } from '../../utils';
import API from '../api';
import storage from '../storage';
import { HEADERS, stripTrailingSlash } from './utils';

export type LoginV1Error = {
  type: string;
  description: string;
  code?: number;
};

type LoginSessionState = {
  isLoggedIn: boolean;
  error?: LoginV1Error;
};

/**
 * @category Model
 */
export const loginV1 = createModel<RootModel>()({
  state: {
    isLoggedIn: false,
  } as LoginSessionState,
  reducers: {
    setLoggedIn(state) {
      return {
        ...state,
        isLoggedIn: true,
        error: undefined,
      };
    },
    addError(state, error: LoginV1Error) {
      return {
        ...state,
        isLoggedIn: false,
        error,
      };
    },
    clearError(state) {
      return {
        ...state,
        error: undefined,
      };
    },
  },
  effects: (dispatch) => ({
    async login(
      payload: { username: string; password: string; next: string; messageType: string },
      rootState
    ) {
      const basePath = stripTrailingSlash(rootState.configuration.config.base);

      try {
        // Make sure we have a valid next parameter
        if (!payload.next) {
          dispatch.loginV1.addError({
            type: 'error',
            description: i18next.t('security.error.invalid-next-param'),
            code: 400,
          });
          return;
        }

        const requestUrl = `${basePath}${payload.next}`;

        const response = await API.request<{ ok: string; token: string }>(requestUrl, 'POST', {
          body: JSON.stringify({ username: payload.username, password: payload.password }),
          headers: {
            Accept: HEADERS.JSON,
            'Content-Type': HEADERS.JSON,
          },
        });

        if (response.ok) {
          // Successfully logged in!

          // Save the username and token to the UI storage
          storage.setItem('username', payload.username);
          storage.setItem('token', response.token);

          dispatch.loginV1.setLoggedIn();
          window.location.href = `${Route.SUCCESS}?messageType=${payload.messageType}`;
        } else {
          throw new Error('Unknown error:' + JSON.stringify(response));
        }
      } catch (error: any) {
        storage.removeItem('username');
        storage.removeItem('token');

        if (error.code === 404) {
          dispatch.loginV1.addError({
            type: 'error',
            description: i18next.t('security.error.username-not-found'),
            code: 404,
          });
        } else if (error.code === 401) {
          dispatch.loginV1.addError({
            type: 'error',
            description: i18next.t('security.error.invalid-credentials'),
            code: 401,
          });
        } else {
          dispatch.loginV1.addError({
            type: 'error',
            description: i18next.t('security.error.unable-to-login'),
            code: error.code || 403,
          });
        }
      }
    },
  }),
});
