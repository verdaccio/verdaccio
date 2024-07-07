import { createModel } from '@rematch/core';

import { Manifest } from '@verdaccio/types';

import type { RootModel } from '.';
import { PackageMetaInterface } from '../../types/packageMeta';
import API from '../api';
import { APIRoute } from './routes';
import { stripTrailingSlash } from './utils';

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
        forbidden: false,
        manifest: undefined,
        packageName: undefined,
        packageVersion: undefined,
        readme: undefined,
      };
    },
    forbidden(state) {
      return {
        ...state,
        forbidden: true,
        hasNotBeenFound: false,
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
        forbidden: false,
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
        forbidden: false,
      };
    },
  },
  effects: (dispatch) => ({
    async getManifest({ packageName, packageVersion }, state) {
      const basePath = stripTrailingSlash(state.configuration.config.base);
      try {
        const manifest: Manifest = await API.request(
          `${basePath}${APIRoute.SIDEBAR}${packageName}${
            packageVersion ? `?v=${packageVersion}` : ''
          }`
        );

        // FIXME: update types accordingly
        // @ts-ignore
        if (!isPackageVersionValid(manifest, packageVersion)) {
          throw new Error('not found');
        }

        const readme: string = await API.request<string>(
          `${basePath}${APIRoute.README}${packageName}${
            packageVersion ? `?v=${packageVersion}` : ''
          }`
        );
        dispatch.manifest.saveManifest({ packageName, packageVersion, manifest, readme });
      } catch (error: any) {
        if (error.code === 404) {
          dispatch.manifest.notFound();
        } else {
          dispatch.manifest.forbidden();
        }
      }
    },
  }),
});
