import { DIST_TAGS, pkgUtils } from '../src';

describe('pkg-utils', () => {
  test('extractTarballName', () => {
    expect(pkgUtils.extractTarballName('https://registry.npmjs.org/test/-/test-0.0.2.tgz')).toBe(
      'test-0.0.2.tgz'
    );
  });

  test('extractTarballName with no tarball should not fails', () => {
    expect(pkgUtils.extractTarballName('https://registry.npmjs.org/')).toBe('');
  });

  test('extractTarballName fails', () => {
    expect(() =>
      pkgUtils.extractTarballName('xxxxregistry.npmjs.org/test/-/test-0.0.2.tgz')
    ).toThrow();
  });

  test('getLatest fails if no versions', () => {
    expect(() =>
      // @ts-expect-error
      pkgUtils.getLatest({
        versions: {},
      })
    ).toThrow('cannot get lastest version of none');
  });

  test('getLatest get latest', () => {
    expect(
      pkgUtils.getLatest({
        versions: {
          // @ts-expect-error
          '1.0.0': {},
        },
        [DIST_TAGS]: {
          latest: '1.0.0',
        },
      })
    ).toBe('1.0.0');
  });
});
