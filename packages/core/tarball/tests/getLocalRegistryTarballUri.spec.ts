import { describe, expect, test } from 'vitest';

import { extractTarballFromUrl } from '../src';

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
          tarball: 'npm_test-1.0.1.tgz',
        },
      },
      '1.0.2': {
        dist: {
          tarball: 'https://localhost/npm_test-1.0.2.tgz',
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
  });
});
