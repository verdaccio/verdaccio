import { DIST_TAGS, DEFAULT_USER } from '@verdaccio/core';
import { validateMetadata, getVersion, normalizeDistTags, formatAuthor } from '../src/index';

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

  describe('API utilities', () => {
    describe('normalizeDistTags', () => {
      test('should delete a invalid latest version', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: '20000',
        };

        normalizeDistTags(pkg);

        expect(Object.keys(pkg[DIST_TAGS])).toHaveLength(0);
      });

      test('should define last published version as latest', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {};

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      });

      test('should define last published version as latest with a custom dist-tag', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          beta: '1.0.1',
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ beta: '1.0.1', latest: '1.0.1' });
      });

      test('should convert any array of dist-tags to a plain string', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: ['1.0.1'],
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      });
    });

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

    describe('validateMetadata', () => {
      test('should fills an empty metadata object', () => {
        // intended to fail with flow, do not remove
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain(DIST_TAGS);
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain('versions');
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain('time');
      });

      test('should fails the assertions is not an object', () => {
        expect(function () {
          // @ts-ignore
          validateMetadata('');
          // @ts-ignore
        }).toThrow(expect.hasAssertions());
      });

      test('should fails the assertions is name does not match', () => {
        expect(function () {
          // @ts-ignore
          validateMetadata({}, 'no-name');
          // @ts-ignore
        }).toThrow(expect.hasAssertions());
      });
    });

    describe('formatAuthor', () => {
      test('should check author field different values', () => {
        const author = 'verdaccioNpm';
        expect(formatAuthor(author).name).toEqual(author);
      });
      test('should check author field for object value', () => {
        const user = {
          name: 'Verdaccion NPM',
          email: 'verdaccio@verdaccio.org',
          url: 'https://verdaccio.org',
        };
        expect(formatAuthor(user).url).toEqual(user.url);
        expect(formatAuthor(user).email).toEqual(user.email);
        expect(formatAuthor(user).name).toEqual(user.name);
      });
      test('should check author field for other value', () => {
        expect(formatAuthor(null).name).toEqual(DEFAULT_USER);
        expect(formatAuthor({}).name).toEqual(DEFAULT_USER);
        expect(formatAuthor([]).name).toEqual(DEFAULT_USER);
      });
    });
  });
});
