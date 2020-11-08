import assert from 'assert';
import _ from 'lodash';

const pkgVersion = require('../package.json').version;
const pkgName = require('../package.json').name;

export function getUserAgent(): string {
  assert(_.isString(pkgName));
  assert(_.isString(pkgVersion));
  return `${pkgName}/${pkgVersion}`;
}
