import { createModel } from '@rematch/core';
import { Package } from '@verdaccio/types';

import API from '../../providers/API/api';

import type { RootModel } from '.';

export const packages = createModel<RootModel>()({
  state: {
    response: [] as Package[],
  },
  reducers: {
    savePackages(state, response: Package[]) {
      return {
        ...state,
        response,
      };
    },
  },
  effects: (dispatch) => ({
    async getPackages(_payload, state) {
      const basePath = state.configuration.config.base;
      try {
        const options =
          typeof state?.login?.token === 'string'
            ? {
                headers: {
                  Authentication: `Bearer ${state.login.token}`,
                },
              }
            : {};

        const payload: Package[] = await API.request(
          `${basePath}-/verdaccio/packages`,
          'GET',
          options
        );
        dispatch.packages.savePackages(payload);
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error({
          title: 'Warning',
          message: `Unable to load package list: ${error.message}`,
        });
        // TODO: handle error, display something retry or something
      }
    },
  }),
});
