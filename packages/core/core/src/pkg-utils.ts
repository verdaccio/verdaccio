import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';

import type { Manifest } from '@verdaccio/types';

import { DIST_TAGS } from './constants';

/**
 * Whether `version` is a string that semver parses in loose mode, the format npm
 * has historically accepted. Loose admits non-canonical spellings such as `v1.2.3`,
 * `=1.2.3`, `01.2.3`, `1.2.3beta` or trailing whitespace, and callers keep the
 * original string: nothing is normalised. Spellings that parse to the same version
 * compare equal under `semver.compareLoose`, and so does build metadata
 * (`1.2.3+build.1` equals `1.2.3`), so compare with it and never by string equality.
 */
export function isValidVersion(version: unknown): version is string {
  return typeof version === 'string' && semver.parse(version, { loose: true }) !== null;
}

/**
 * Function filters out bad semver versions and sorts the array.
 * @return {Array} sorted Array
 */
export function semverSort(listVersions: string[]): string[] {
  return listVersions.filter(isValidVersion).sort(semver.compareLoose).map(String);
}

/**
 * Sanitize a version string to a valid semver version.
 * @param version - The version string to sanitize.
 * @returns The sanitized version string.
 */
export function semverSanitize(version: string): string {
  return (
    semver.valid(version) || semver.coerce(version, { includePrerelease: true })?.version || ''
  );
}

/**
 * Get the latest publihsed version of a package.
 * @param package metadata
 **/
export function getLatest(pkg: Manifest): string {
  const listVersions: string[] = Object.keys(pkg.versions);
  if (listVersions.length < 1) {
    throw Error('cannot get lastest version of none');
  }

  const versions: string[] = semverSort(listVersions);
  const latest: string | undefined = pkg[DIST_TAGS]?.latest ? pkg[DIST_TAGS].latest : versions[0];

  return latest;
}

/**
 * Get package informations from package.json
 * @param packagePath - The path to the package.json file.
 * @returns The package.json content
 */
export function getPackageJson(packagePath: string, relativePath: string): Record<string, unknown> {
  const packageJsonPath = path.join(packagePath, relativePath, 'package.json');
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}
