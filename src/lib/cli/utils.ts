import semver from 'semver';

export const MIN_NODE_VERSION = '18';

export function isVersionValid(version) {
  return semver.satisfies(version, `>=${MIN_NODE_VERSION}`);
}
