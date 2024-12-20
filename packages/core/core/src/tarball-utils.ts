import { URL } from 'url';

/**
 * Return package version from tarball name
 *
 * test-1.2.4.tgz -> 1.2.4
 * @param {String} fileName
 * @returns {String}
 */
export function getVersionFromTarball(fileName: string): string | void {
  const groups = fileName.replace(/\.tgz$/, '').match(/^[^/]+-(\d+\.\d+\.\d+.*)/);

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
 *
 * test, 1.2.4 -> test-1.2.4.tgz
 * @scope/name, 1.2.4 -> name-1.2.4.tgz
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
