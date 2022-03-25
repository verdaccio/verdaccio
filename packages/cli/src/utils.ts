import semver from 'semver';

export const MIN_NODE_VERSION = '14.0.0';

export function isVersionValid(processVersion) {
  const version = processVersion.slice(1);
  return semver.satisfies(version, `>=${MIN_NODE_VERSION}`);
}
