import { Manifest } from '@verdaccio/types';

import { generatePackageMetadata } from '../../api/node_modules/@verdaccio/test-helper/build';
import { isStarManifest } from '../src';

describe('Star Utils', () => {
  describe('isStarManifest', () => {
    test('is not star manifest', () => {
      const pkg = generatePackageMetadata('foo');
      expect(isStarManifest(pkg)).toBe(false);
    });

    test('is not star manifest empty users', () => {
      const pkg = generatePackageMetadata('foo');
      pkg.users = {};
      expect(isStarManifest(pkg)).toBe(false);
    });

    test('is star manifest', () => {
      const pkg = generatePackageMetadata('foo', '3.0.0') as Manifest;
      // Staring a package usually is without versions and the user property within
      // the manifest body
      // @ts-expect-error
      delete pkg.versions;
      pkg.users = {
        foo: true,
      };
      expect(isStarManifest(pkg)).toBe(true);
    });
  });
});
