import semver from 'semver';

export const MIN_NODE_VERSION = '12.0.0';

export const isVersionValid = () =>
  semver.satisfies(process.version, `>=${MIN_NODE_VERSION}`) === false;
