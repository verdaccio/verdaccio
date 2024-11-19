import { URL } from 'url';

/**
 * Return package version from tarball name
 * @param {String} name
 * @returns {String}
 */
export function getVersionFromTarball(name: string): string | void {
  const groups = name.match(/.+-(\d.+)\.tgz/);

  return groups !== null ? groups[1] : undefined;
}

/**
 * Extract the tarball name from a registry dist url
 *
 * https://registry.npmjs.org/test/-/test-0.0.2.tgz -> test-0.0.2.tgz
 * @param tarball tarball url
 * @returns tarball filename
 */
export function extractTarballFromUrl(url: string): string {
  const urlObject = new URL(url);
  return urlObject.pathname.replace(/^.*\//, '');
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
