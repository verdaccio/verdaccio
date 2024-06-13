import { FetchOptions } from '@verdaccio/proxy';
import { Manifest, RemoteUser } from '@verdaccio/types';
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

  /**
   * Reduce the package metadata to the minimum required to get the package.
   * https://github.com/npm/registry/blob/c0b573593fb5d6e0268de7d6612addd7059cb779/docs/responses/package-metadata.md#package-metadata
   */
  abbreviated?: boolean;
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

/**
 * When the command `npm star` is executed, the body only contains the following
 * values in the body.
 */
export type StarManifestBody = Pick<Manifest, '_id' | 'users' | '_rev'>;

/**
 * When the command `npm owner add/rm` is executed, the body only contains the following
 * values in the body.
 */
export type OwnerManifestBody = Pick<Manifest, '_id' | 'maintainers' | '_rev'>;
