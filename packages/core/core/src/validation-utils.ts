import assert from 'assert';

import { Manifest } from '@verdaccio/types';

import { DEFAULT_PASSWORD_VALIDATION, DIST_TAGS } from './constants';

export { validatePublishSingleVersion } from './schemes/publish-manifest';

export function isPackageNameScoped(name: string): boolean {
  return name.startsWith('@');
}

/**
 * From normalize-package-data/lib/fixer.js
 * @param {*} name  the package name
 * @return {Boolean} whether is valid or not
 */
export function validateName(name: string): boolean {
  if (typeof name !== 'string') {
    return false;
  }

  let normalizedName: string = name.toLowerCase();

  const isScoped: boolean = isPackageNameScoped(name);
  const scopedName = name.split('/', 2)[1];

  if (isScoped && typeof scopedName !== 'undefined') {
    normalizedName = scopedName.toLowerCase();
  }

  /**
   * Some context about the first regex
   * - npm used to have a different tarball naming system.
   * eg: http://registry.npmjs.com/thirty-two
   * https://registry.npmjs.org/thirty-two/-/thirty-two@0.0.1.tgz
   * The file name thirty-two@0.0.1.tgz, the version and the pkg name was separated by an at (@)
   * while nowadays the naming system is based in dashes
   * https://registry.npmjs.org/verdaccio/-/verdaccio-1.4.0.tgz
   *
   * more info here: https://github.com/rlidwka/sinopia/issues/75
   */
  return !(
    !normalizedName.match(/^[-a-zA-Z0-9_.!~*'()@]+$/) ||
    normalizedName.startsWith('.') || // ".bin", etc.
    ['node_modules', '__proto__', 'favicon.ico'].includes(normalizedName)
  );
}

/**
 * Validate a package.
 * @return {Boolean} whether the package is valid or not
 */
export function validatePackage(name: string): boolean {
  const nameList = name.split('/', 2);
  if (nameList.length === 1) {
    // normal package
    return validateName(nameList[0]);
  }
  // scoped package
  return nameList[0][0] === '@' && validateName(nameList[0].slice(1)) && validateName(nameList[1]);
}

/**
 * Validate the package metadata, add additional properties whether are missing within
 * the metadata properties.
 * @param {*} manifest
 * @param {*} name
 * @return {Object} the object with additional properties as dist-tags ad versions
 * FUTURE: rename to normalizeMetadata
 */
export function normalizeMetadata(manifest: Manifest, name: string): Manifest {
  assert.strictEqual(manifest.name, name);
  const _manifest = { ...manifest };

  if (!isObject(manifest[DIST_TAGS])) {
    _manifest[DIST_TAGS] = {};
  }

  // This may not be nee dit
  if (!isObject(manifest['versions'])) {
    _manifest['versions'] = {};
  }

  if (!isObject(manifest['time'])) {
    _manifest['time'] = {};
  }

  return _manifest;
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
export function isObject(obj: any): boolean {
  if (obj === null || typeof obj === 'undefined' || typeof obj === 'string') {
    return false;
  }

  return (
    (typeof obj === 'object' || typeof obj.prototype === 'undefined') &&
    Array.isArray(obj) === false
  );
}

export function validatePassword(
  password: string,
  validation: RegExp = DEFAULT_PASSWORD_VALIDATION
): boolean {
  return typeof password === 'string' && validation instanceof RegExp
    ? password.match(validation) !== null
    : false;
}
