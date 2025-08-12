import { createModel } from '@rematch/core';

import { Manifest } from '@verdaccio/types';

import type { RootModel } from '.';
import API from '../api';
import { APIRoute } from './routes';
import { stripTrailingSlash } from './utils';

/**
 *
 * @category Model
 */
export const packages = createModel<RootModel>()({
  state: {
    response: [] as Manifest[],
  },
  reducers: {
    savePackages(state, response: Manifest[]) {
      return {
        ...state,
        response,
      };
    },
  },
  effects: (dispatch) => ({
    async getPackages(_payload, state) {
      const basePath = stripTrailingSlash(state.configuration.config.base);
      try {
        const payload: Manifest[] = await API.request(`${basePath}${APIRoute.PACKAGES}`);
        dispatch.packages.savePackages(payload);
      } catch (error: unknown) {
        // eslint-disable-next-line no-console
        console.error({
          title: 'Warning',
          message: `Unable to load package list: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
        // TODO: handle error, display something retry or something
      }
    },
  }),
});
