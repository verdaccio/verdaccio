import { createModel } from '@rematch/core';
import i18next from 'i18next';

import type { RootModel } from '.';
import { Route } from '../../utils';
import API from '../api';
import { HEADERS, stripTrailingSlash } from './utils';

const TOKEN_BEARER = 'Bearer';

export type ChangePasswordError = {
  type: string;
  description: string;
  code?: number;
};

type ChangePasswordState = {
  isPasswordChanged: boolean;
  error?: ChangePasswordError;
};

/**
 * @category Model
 */
export const changePassword = createModel<RootModel>()({
  state: {
    isPasswordChanged: false,
  } as ChangePasswordState,
  reducers: {
    setPasswordChanged(state) {
      return {
        ...state,
        isPasswordChanged: true,
        error: undefined,
      };
    },
    addError(state, error: ChangePasswordError) {
      return {
        ...state,
        isPasswordChanged: false,
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
    async updatePassword(
      payload: {
        username: string;
        oldPassword: string;
        newPassword: string;
        messageType: string;
      },
      rootState
    ) {
      const basePath = stripTrailingSlash(rootState.configuration.config.base);

      try {
        // Authorize the user and get token
        const requestAuthorize = `${basePath}${Route.ADD_USER_API}:${payload.username}`;

        const responseAuthorize = await API.request<{ ok: string; token: string }>(
          requestAuthorize,
          'PUT',
          {
            body: JSON.stringify({
              name: payload.username,
              password: payload.oldPassword,
            }),
            headers: {
              Accept: HEADERS.JSON,
              'Content-Type': HEADERS.JSON,
            },
          }
        );

        if (!responseAuthorize.ok) {
          throw new Error('Invalid credentials');
        }

        const token = `${TOKEN_BEARER} ${responseAuthorize.token}`;

        // Change the password
        const requestChangePassword = `${basePath}${Route.CHANGE_PASSWORD_API}`;

        const responseChangePassword = await API.request<{ ok: string }>(
          requestChangePassword,
          'POST',
          {
            body: JSON.stringify({
              password: { new: payload.newPassword, old: payload.oldPassword },
            }),
            headers: {
              Accept: HEADERS.JSON,
              'Content-Type': HEADERS.JSON,
              Authorization: token,
            },
          }
        );

        if (responseChangePassword.ok) {
          // Successfully changed the password!

          dispatch.changePassword.setPasswordChanged();
          window.location.href = `${Route.SUCCESS}?messageType=${payload.messageType}`;
        } else {
          throw new Error('Unknown error:' + JSON.stringify(responseChangePassword));
        }
      } catch (error: any) {
        if (error.code === 401) {
          dispatch.changePassword.addError({
            type: 'error',
            description: i18next.t('security.error.invalid-credentials'),
            code: 401,
          });
        } else if (error.code === 404) {
          dispatch.changePassword.addError({
            type: 'error',
            description: i18next.t('security.error.username-not-found'),
            code: 404,
          });
        } else {
          dispatch.changePassword.addError({
            type: 'error',
            description: i18next.t('security.error.unable-to-change-password'),
            code: error.code || 400,
          });
        }
      }
    },
  }),
});
