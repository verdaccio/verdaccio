import { createModel } from '@rematch/core';
import i18next from 'i18next';

import type { RootModel } from '.';
import { Route } from '../../utils';
import API from '../api';
import storage from '../storage';
import { HEADERS, stripTrailingSlash } from './utils';

export type AddUserError = {
  type: string;
  description: string;
  code?: number;
};

type AddUserSessionState = {
  isRegistered: boolean;
  error?: AddUserError;
};

/**
 * @category Model
 */
export const addUser = createModel<RootModel>()({
  state: {
    isRegistered: false,
  } as AddUserSessionState,
  reducers: {
    setRegistered(state) {
      return {
        ...state,
        isRegistered: true,
        error: undefined,
      };
    },
    addError(state, error: AddUserError) {
      return {
        ...state,
        isRegistered: false,
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
    async register(
      payload: {
        username: string;
        password: string;
        email?: string;
        next?: string;
        messageType: string;
      },
      rootState
    ) {
      const basePath = stripTrailingSlash(rootState.configuration.config.base);

      try {
        const requestUrl = `${basePath}${Route.ADD_USER_API}:${payload.username}`;

        const response = await API.request<{ ok: string; token: string }>(requestUrl, 'PUT', {
          body: JSON.stringify({
            name: payload.username,
            password: payload.password,
            email: payload.email || '',
          }),
          headers: {
            Accept: HEADERS.JSON,
            'Content-Type': HEADERS.JSON,
          },
        });

        if (response.ok) {
          // Successfully added a new user!

          // Save the username and token to the UI storage
          storage.setItem('username', payload.username);
          storage.setItem('token', response.token);

          dispatch.addUser.setRegistered();
          window.location.href = `${Route.SUCCESS}?messageType=${payload.messageType}`;
        } else {
          throw new Error('Unknown add-user error:' + JSON.stringify(response));
        }
      } catch (error: any) {
        storage.removeItem('username');
        storage.removeItem('token');

        if (error.code === 409) {
          dispatch.addUser.addError({
            type: 'error',
            description: i18next.t('security.error.username-already-exists'),
            code: 409,
          });
        } else if (error.code === 404) {
          dispatch.addUser.addError({
            type: 'error',
            description: i18next.t('security.error.username-not-found'),
            code: 404,
          });
        } else {
          dispatch.addUser.addError({
            type: 'error',
            description: i18next.t('security.error.unable-to-add-user'),
            code: error.code || 400,
          });
        }
      }
    },
  }),
});
