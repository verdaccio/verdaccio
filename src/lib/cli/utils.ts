import semver from 'semver';

export const MIN_NODE_VERSION = '18';
export const RECOMMENDED_NODE_VERSION = '22';

export function isVersionValid(version) {
  return semver.satisfies(version, `>=${MIN_NODE_VERSION}`);
}

export function isVersionRecommended(version) {
  return semver.satisfies(version, `>=${RECOMMENDED_NODE_VERSION}`);
}
