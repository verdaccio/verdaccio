import assert from 'assert';
import _ from 'lodash';

import meta from '../package.json';

const { version: pkgVersion } = meta;
const pkgName = 'verdaccio';

export function getUserAgent(): string {
  assert(_.isString(pkgName));
  assert(_.isString(pkgVersion));
  return `${pkgName}/${pkgVersion}`;
}
