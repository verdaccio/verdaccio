import { getVersion } from '../src/utils';

describe('Utilities', () => {
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
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.1.tgz',
        },
      },
    },
  };
  const cloneMetadata = (pkg = metadata) => Object.assign({}, pkg);
  describe('getVersion', () => {
    test('should get the right version', () => {
      expect(getVersion(cloneMetadata(), '1.0.0')).toEqual(metadata.versions['1.0.0']);
      expect(getVersion(cloneMetadata(), 'v1.0.0')).toEqual(metadata.versions['1.0.0']);
    });

    test('should return nothing on get non existing version', () => {
      expect(getVersion(cloneMetadata(), '0')).toBeUndefined();
      expect(getVersion(cloneMetadata(), '2.0.0')).toBeUndefined();
      expect(getVersion(cloneMetadata(), 'v2.0.0')).toBeUndefined();
      expect(getVersion(cloneMetadata(), undefined)).toBeUndefined();
      expect(getVersion(cloneMetadata(), null)).toBeUndefined();
      expect(getVersion(cloneMetadata(), 2)).toBeUndefined();
    });
  });
});
