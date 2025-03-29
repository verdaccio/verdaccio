import { GENERIC_AVATAR, generateGravatarUrl } from '@verdaccio/utils';

import { DIST_TAGS } from '../../../../src/lib/constants';
import { logger, setup } from '../../../../src/lib/logger';
import { getVersion, normalizeDistTags, parseReadme, sortByName } from '../../../../src/lib/utils';
import { getByQualityPriorityValue } from '../../../../src/utils/string';

setup([]);

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
    describe('Sort packages', () => {
      const packages = [
        {
          name: 'ghc',
        },
        {
          name: 'abc',
        },
        {
          name: 'zxy',
        },
      ];
      test('should order ascending', () => {
        expect(sortByName(packages)).toEqual([
          {
            name: 'abc',
          },
          {
            name: 'ghc',
          },
          {
            name: 'zxy',
          },
        ]);
      });

      test('should order descending', () => {
        expect(sortByName(packages, false)).toEqual([
          {
            name: 'zxy',
          },
          {
            name: 'ghc',
          },
          {
            name: 'abc',
          },
        ]);
      });
    });

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
  });

  describe('String utilities', () => {
    test('getByQualityPriorityValue', () => {
      expect(getByQualityPriorityValue('')).toEqual('');
      expect(getByQualityPriorityValue(null)).toEqual('');
      expect(getByQualityPriorityValue(undefined)).toEqual('');
      expect(getByQualityPriorityValue('something')).toEqual('something');
      expect(getByQualityPriorityValue('something,')).toEqual('something');
      expect(getByQualityPriorityValue('0,')).toEqual('0');
      expect(getByQualityPriorityValue('application/json')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/json; q=1')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/json; q=')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/json;')).toEqual('application/json');
      expect(
        getByQualityPriorityValue(
          'application/json; q=1.0, application/vnd.npm.install-v1+json; q=0.9, */*'
        )
      ).toEqual('application/json');
      expect(
        getByQualityPriorityValue(
          'application/json; q=1.0, application/vnd.npm.install-v1+json; q=, */*'
        )
      ).toEqual('application/json');
      expect(
        getByQualityPriorityValue(
          'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.9, */*'
        )
      ).toEqual('application/vnd.npm.install-v1+json');
      expect(
        getByQualityPriorityValue(
          'application/vnd.npm.install-v1+json; q=, application/json; q=0.9, */*'
        )
      ).toEqual('application/json');
    });
  });

  describe('User utilities', () => {
    test('should generate gravatar url with email', () => {
      const gravatarUrl: string = generateGravatarUrl('user@verdaccio.org');

      expect(gravatarUrl).toMatch('https://www.gravatar.com/avatar/');
      expect(gravatarUrl).not.toMatch('000000000');
    });

    test('should generate generic gravatar url', () => {
      const gravatarUrl: string = generateGravatarUrl();

      expect(gravatarUrl).toMatch(GENERIC_AVATAR);
    });
  });

  describe('parseReadme', () => {
    test('should show error for no readme data', () => {
      const noData = '';
      const spy = jest.spyOn(logger, 'info');
      expect(parseReadme('testPackage', noData)).toEqual('ERROR: No README data found!');
      expect(spy).toHaveBeenCalledWith(
        { packageName: 'testPackage' },
        '@{packageName}: No readme found'
      );
    });
  });
});
