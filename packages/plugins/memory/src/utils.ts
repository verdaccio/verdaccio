import { Package } from '@verdaccio/types';

export function stringifyPackage(pkg: Package) {
  return JSON.stringify(pkg, null, '\t');
}

export function parsePackage(pkg: string) {
  return JSON.parse(pkg);
}
