import { createModel } from '@rematch/core';

import { Package } from '@verdaccio/types';

import type { RootModel } from '.';
import API from '../../providers/API/api';

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
        const payload: Package[] = await API.request(`${basePath}-/verdaccio/data/packages`, 'GET');
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
