import { FetchOptions } from '@verdaccio/proxy';
import { Config, IPluginStorageFilter, RemoteUser } from '@verdaccio/types';
import { RequestOptions } from '@verdaccio/url';

// @deprecated use IGetPackageOptionsNext
export type IGetPackageOptionsNext = {
  /**
   * Package name, could be scoped
   * eg: @scope/package-name or package-name
   */
  name: string;
  /**
   * Package version, optional.
   *
   * @type {string}
   */
  version?: string;
  /**
   * @deprecated use `TBA` instead
   */
  keepUpLinkData?: boolean;
  remoteUser?: RemoteUser;
  // fetch library retry options (mostly used by unit tests)
  retry?: FetchOptions['retry'];
  /**
   * Define if the package should be look up in the uplinks
   */
  uplinksLook: boolean;
  requestOptions: RequestOptions;
  /**
   *
   * The property write=true is used by package managers to get the most frest data
   * internally indicates to avoid any cache layer.
   */
  byPassCache?: boolean;
};

// @deprecate remove this type
export type PublishOptions = {
  signal: AbortSignal;
} & IGetPackageOptionsNext;

export type UpdateManifestOptions = {
  name: string;
  version?: string;
  revision?: string;
  keepUpLinkData?: boolean;
  remoteUser?: RemoteUser;
  uplinksLook: boolean;
  requestOptions: RequestOptions;
  signal: AbortSignal;
};

export type Users = {
  [key: string]: string;
};
export interface StarBody {
  _id: string;
  _rev: string;
  users: Users;
}

export type IPluginFilters = IPluginStorageFilter<Config>[];
