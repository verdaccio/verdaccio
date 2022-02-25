import assert from 'assert';
import _ from 'lodash';

// FIXME: version from env variable
const pkgVersion = '6.0.0';

export function getUserAgent(): string {
  assert(_.isString(pkgVersion));
  return `verdaccio/${pkgVersion}`;
}
