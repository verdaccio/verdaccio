import { describe, expect, test } from 'vitest';

import { Manifest } from '@verdaccio/types';

import { generatePackageMetadata } from '../../api/node_modules/@verdaccio/test-helper/build';
import { isExecutingStarCommand } from '../src';
import { isStarManifest } from '../src';

describe('Star Utils', () => {
  describe('isExecutingStarCommand', () => {
    describe('disallow states', () => {
      test('should not allow add star with no existing users', () => {
        expect(isExecutingStarCommand({}, 'foo', false)).toBeFalsy();
      });

      test('should not allow add star with existing users', () => {
        expect(isExecutingStarCommand({ bar: true }, 'foo', false)).toBeFalsy();
      });

      test('should fails if user already exist and us trying to add star', () => {
        expect(isExecutingStarCommand({ foo: true }, 'foo', true)).toBeFalsy();
      });
    });

    describe('allow states', () => {
      test('should allow add star with existing users', () => {
        expect(isExecutingStarCommand({ foo: true }, 'foo', false)).toBeTruthy();
      });

      test('should allow if is adding star and does not exist', () => {
        expect(isExecutingStarCommand({ foo: true }, 'bar', true)).toBeTruthy();
      });
    });
  });

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
