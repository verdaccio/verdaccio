import { createModel } from '@rematch/core';
import { Package } from '@verdaccio/types';
import i18next from 'i18next';

import API from '../../providers/API/api';

import type { RootModel } from '.';

export const manifest = createModel<RootModel>()({
  state: {},
  reducers: {
    saveManifest(state, manifest: Package) {
      return {
        ...state,
        manifest,
      };
    },
    effects: (dispatch) => ({
      async getManifest({ packageName, packageVersion }, state) {
        const basePath = state.configuration.config.base;
        try {
          const payload: Package = await API.request(
            `${basePath}sidebar/${packageName}${packageVersion ? `?v=${packageVersion}` : ''}`
          );
          // @ts-ignore
          dispatch.manifest.saveManifest(payload);
        } catch (error: any) {
          // @ts-ignore
          dispatch.login.addError({
            type: 'error',
            description: i18next.t('form-validation.unable-to-sign-in'),
          });
        }
      },
    }),
  },
});
