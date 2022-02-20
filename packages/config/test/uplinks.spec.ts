import { describe, expect, test } from 'vitest';

import { normalisePackageAccess, parseConfigFile } from '../src';
import { hasProxyTo, sanityCheckUplinksProps, uplinkSanityCheck } from '../src/uplinks';
import { parseConfigurationFile } from './utils';

describe('Uplinks Utilities', () => {
  describe('uplinkSanityCheck', () => {
    test('should test basic conversion', async () => {
      const config = await parseConfigFile(parseConfigurationFile('uplink-basic'));
      const uplinks = uplinkSanityCheck(config.uplinks);
      expect(Object.keys(uplinks)).toContain('server1');
      expect(Object.keys(uplinks)).toContain('server2');
    });

    test('should throw error on blacklisted uplink name', async () => {
      const { uplinks } = await parseConfigFile(parseConfigurationFile('uplink-wrong'));

      expect(() => {
        uplinkSanityCheck(uplinks);
      }).toThrow('CONFIG: reserved uplink name: anonymous');
    });
  });

  describe('sanityCheckUplinksProps', () => {
    test('should fails if url prop is missing', async () => {
      const { uplinks } = await parseConfigFile(parseConfigurationFile('uplink-wrong'));
      expect(() => {
        sanityCheckUplinksProps(uplinks);
      }).toThrow('CONFIG: no url for uplink: none-url');
    });

    test('should bypass an empty uplink list', () => {
      // @ts-ignore
      expect(sanityCheckUplinksProps([])).toHaveLength(0);
    });
  });

  describe('hasProxyTo', () => {
    test('should test basic config', async () => {
      const config = await parseConfigFile(parseConfigurationFile('pkgs-basic'));
      const packages = normalisePackageAccess(config.packages);
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

    test('should test resolve based on custom package access', async () => {
      const config = await parseConfigFile(parseConfigurationFile('pkgs-custom'));
      const packages = normalisePackageAccess(config.packages);
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

    test('should not resolve any proxy', async () => {
      const packages = normalisePackageAccess(
        await parseConfigFile(parseConfigurationFile('pkgs-empty')).packages
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
