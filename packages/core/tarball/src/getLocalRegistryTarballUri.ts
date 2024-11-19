import buildDebug from 'debug';

import { tarballUtils } from '@verdaccio/core';
import { RequestOptions } from '@verdaccio/url';
import { getPublicUrl } from '@verdaccio/url';

const debug = buildDebug('verdaccio:core:tarball');

/**
 * Extract the tarball name from a registry dist url
 * 'https://registry.npmjs.org/test/-/test-0.0.2.tgz'
 * @param tarball tarball url
 * @returns tarball filename
 */
export function extractTarballFromUrl(url: string): string {
  // @ts-ignore
  return URL.parse(url).pathname.replace(/^.*\//, '');
}

/**
 * Build the tarball filename from paackage name and version
 * @param name package name
 * @param version package version
 * @returns tarball filename
 */
export function composeTarballFromPackage(name: string, version: string): string {
  if (name.includes('/')) {
    return `${name.split('/')[1]}-${version}.tgz`;
  } else {
    return `${name}-${version}.tgz`;
  }
}

/**
 * Filter a tarball url.
 * @param {*} uri
 * @return {String} a parsed url
 */
export function getLocalRegistryTarballUri(
  uri: string,
  pkgName: string,
  requestOptions: RequestOptions,
  urlPrefix: string | void
): string {
  const currentHost = requestOptions?.headers?.host;

  if (!currentHost) {
    return uri;
  }
  const tarballName = tarballUtils.extractTarballFromUrl(uri);
  debug('tarball name %o', tarballName);
  // header only set with proxy that setup with HTTPS
  const domainRegistry = getPublicUrl(urlPrefix || '', requestOptions);

  return `${domainRegistry}${pkgName}/-/${tarballName}`;
}
