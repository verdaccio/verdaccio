import { describe, expect, test } from 'vitest';

import {
  composeTarballFromPackage,
  extractTarballFromUrl,
  getVersionFromTarball,
} from '../src/tarball-utils';

describe('Utilities', () => {
  describe('getVersionFromTarball', () => {
    test('should get the right version', () => {
      const simpleName = 'test-name-4.2.12.tgz';
      const complexName = 'test-5.6.4-beta.2.tgz';
      const otherComplexName = 'test-3.5.0-6.tgz';
      expect(getVersionFromTarball(simpleName)).toEqual('4.2.12');
      expect(getVersionFromTarball(complexName)).toEqual('5.6.4-beta.2');
      expect(getVersionFromTarball(otherComplexName)).toEqual('3.5.0-6');
    });

    test('should fail at incorrect tarball name', () => {
      expect(getVersionFromTarball('incorrectName')).toBeUndefined();
      expect(getVersionFromTarball('test-1.2.tgz')).toBeUndefined();
    });
  });
});

describe('extractTarballFromUrl', () => {
  const metadata: any = {
    name: 'npm_test',
    versions: {
      '1.0.0': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.0.tgz',
        },
      },
      '1.0.1': {
        dist: {
          tarball: 'https://localhost:4873/npm_test/-/npm_test-1.0.1.tgz',
        },
      },
      '1.0.2': {
        dist: {
          tarball: 'https://localhost/npm_test-1.0.2.tgz',
        },
      },
      '1.0.3': {
        dist: {
          tarball: 'http://registry.org/@org/npm_test/-/npm_test-1.0.3.tgz',
        },
      },
    },
  };

  test('should return only name of tarball', () => {
    expect(extractTarballFromUrl(metadata.versions['1.0.0'].dist.tarball)).toEqual(
      'npm_test-1.0.0.tgz'
    );
    expect(extractTarballFromUrl(metadata.versions['1.0.1'].dist.tarball)).toEqual(
      'npm_test-1.0.1.tgz'
    );
    expect(extractTarballFromUrl(metadata.versions['1.0.2'].dist.tarball)).toEqual(
      'npm_test-1.0.2.tgz'
    );
    expect(extractTarballFromUrl(metadata.versions['1.0.3'].dist.tarball)).toEqual(
      'npm_test-1.0.3.tgz'
    );
  });

  test('without tarball should not fails', () => {
    expect(extractTarballFromUrl('https://registry.npmjs.org/')).toBe('');
  });

  test('fails with incomplete URL', () => {
    expect(() => extractTarballFromUrl('xxxxregistry.npmjs.org/test/-/test-0.0.2.tgz')).toThrow();
  });
});

test('composeTarballFromPackage - should return filename of tarball', () => {
  expect(composeTarballFromPackage('npm_test', '1.0.0')).toEqual('npm_test-1.0.0.tgz');
  expect(composeTarballFromPackage('@mbtools/npm_test', '1.0.1')).toEqual('npm_test-1.0.1.tgz');
});
