import { createModel } from '@rematch/core';

import { Manifest } from '@verdaccio/types';

import type { RootModel } from '.';
import { PackageMetaInterface } from '../../types/packageMeta';
import API from '../api';

function isPackageVersionValid(
  packageMeta: Partial<PackageMetaInterface>,
  packageVersion?: string
): boolean {
  if (!packageVersion || typeof packageVersion === 'undefined') {
    // if is undefined, that means versions does not exist, we continue
    return true;
  }

  if (packageMeta.versions) {
    return Object.keys(packageMeta.versions).includes(packageVersion);
  }

  return false;
}

/**
 *
 * @category Model
 */
export const manifest = createModel<RootModel>()({
  state: {},
  reducers: {
    notFound(state) {
      return {
        ...state,
        hasNotBeenFound: true,
        manifest: undefined,
        packageName: undefined,
        packageVersion: undefined,
        readme: undefined,
      };
    },
    clearError(state) {
      return {
        ...state,
        isError: null,
      };
    },
    isError(state) {
      return {
        ...state,
        isError: true,
        hasNotBeenFound: false,
        manifest: undefined,
        packageName: undefined,
        packageVersion: undefined,
        readme: undefined,
      };
    },
    saveManifest(state, { packageName, packageVersion, manifest, readme }) {
      return {
        ...state,
        manifest,
        packageName,
        packageVersion,
        readme,
        hasNotBeenFound: false,
      };
    },
  },
  effects: (dispatch) => ({
    async getManifest({ packageName, packageVersion }, state) {
      const basePath = state.configuration.config.base;
      try {
        const manifest: Manifest = await API.request(
          `${basePath}-/verdaccio/data/sidebar/${packageName}${
            packageVersion ? `?v=${packageVersion}` : ''
          }`
        );

        // FIXME: update types accordingly
        // @ts-ignore
        if (!isPackageVersionValid(manifest, packageVersion)) {
          throw new Error('not found');
        }

        const readme: string = await API.request<string>(
          `${basePath}-/verdaccio/data/package/readme/${packageName}${
            packageVersion ? `?v=${packageVersion}` : ''
          }`,
          'GET'
        );
        dispatch.manifest.saveManifest({ packageName, packageVersion, manifest, readme });
      } catch (error: any) {
        dispatch.manifest.notFound();
      }
    },
  }),
});
