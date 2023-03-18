import _ from 'lodash';
import path from 'path';

import { normalisePackageAccess } from '@verdaccio/config';

import { hasProxyTo } from '../../../../src/lib/config-utils';
import { parseConfigFile } from '../../../../src/lib/utils';

describe('Config Utilities', () => {
  const parseConfigurationFile = (conf) => {
    const { name, ext } = path.parse(conf);
    const format = ext.startsWith('.') ? ext.substring(1) : 'yaml';

    return path.join(__dirname, `../../partials/config/${format}/${name}.${format}`);
  };

  describe('hasProxyTo', () => {
    test('should test basic config', () => {
      const packages = normalisePackageAccess(
        parseConfigFile(parseConfigurationFile('pkgs-basic')).packages
      );
      // react
      expect(hasProxyTo('react', 'facebook', packages)).toBeFalsy();
      expect(hasProxyTo('react', 'google', packages)).toBeFalsy();
      // vue
      expect(hasProxyTo('vue', 'google', packages)).toBeFalsy();
      expect(hasProxyTo('vue', 'fake', packages)).toBeFalsy();
      expect(hasProxyTo('vue', 'npmjs', packages)).toBeTruthy();
      // angular
      expect(hasProxyTo('angular', 'google', packages)).toBeFalsy();
      expect(hasProxyTo('angular', 'facebook', packages)).toBeFalsy();
      expect(hasProxyTo('angular', 'npmjs', packages)).toBeTruthy();
    });

    test('should test resolve based on custom package access', () => {
      const packages = normalisePackageAccess(
        parseConfigFile(parseConfigurationFile('pkgs-custom')).packages
      );
      // react
      expect(hasProxyTo('react', 'facebook', packages)).toBeTruthy();
      expect(hasProxyTo('react', 'google', packages)).toBeFalsy();
      // vue
      expect(hasProxyTo('vue', 'google', packages)).toBeFalsy();
      expect(hasProxyTo('vue', 'fake', packages)).toBeFalsy();
      expect(hasProxyTo('vue', 'npmjs', packages)).toBeTruthy();
      // angular
      expect(hasProxyTo('angular', 'google', packages)).toBeTruthy();
      expect(hasProxyTo('angular', 'facebook', packages)).toBeFalsy();
      expect(hasProxyTo('angular', 'npmjs', packages)).toBeFalsy();
    });

    test('should not resolve any proxy', () => {
      const packages = normalisePackageAccess(
        parseConfigFile(parseConfigurationFile('pkgs-empty')).packages
      );
      // react
      expect(hasProxyTo('react', 'npmjs', packages)).toBeFalsy();
      expect(hasProxyTo('react', 'npmjs', packages)).toBeFalsy();
      // vue
      expect(hasProxyTo('vue', 'npmjs', packages)).toBeFalsy();
      expect(hasProxyTo('vue', 'npmjs', packages)).toBeFalsy();
      expect(hasProxyTo('vue', 'npmjs', packages)).toBeFalsy();
      // angular
      expect(hasProxyTo('angular', 'npmjs', packages)).toBeFalsy();
      expect(hasProxyTo('angular', 'npmjs', packages)).toBeFalsy();
      expect(hasProxyTo('angular', 'npmjs', packages)).toBeFalsy();
      // private
      expect(hasProxyTo('private', 'fake', packages)).toBeFalsy();
    });
  });
});
