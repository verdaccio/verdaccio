import semver from 'semver';

export const MIN_NODE_VERSION = '10.22.1';

export const isVersionValid = () =>
  semver.satisfies(process.version, `>=${MIN_NODE_VERSION}`) === false;
