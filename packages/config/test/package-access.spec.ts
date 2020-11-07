import path from 'path';
import _ from 'lodash';

import { PACKAGE_ACCESS } from '@verdaccio/dev-commons';

import { getMatchedPackagesSpec, normalisePackageAccess } from '../src/package-access';
import { parseConfigFile } from '../src';

describe('Package access utilities', () => {
  const parseConfigurationFile = (conf) => {
    const { name, ext } = path.parse(conf);
    const format = ext.startsWith('.') ? ext.substring(1) : 'yaml';

    return path.join(__dirname, `./partials/config/${format}/${name}.${format}`);
  };

  describe('normalisePackageAccess', () => {
    test('should test basic conversion', () => {
      const { packages } = parseConfigFile(parseConfigurationFile('pkgs-basic'));
      const access = normalisePackageAccess(packages);

      expect(access).toBeDefined();
      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];

      expect(scoped).toBeDefined();
      expect(all).toBeDefined();
    });

    test('should define an empty publish array even if is not defined in packages', () => {
      const { packages } = parseConfigFile(parseConfigurationFile('pkgs-basic-no-publish'));
      const access = normalisePackageAccess(packages);

      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      // publish must defined
      expect(scoped.publish).toBeDefined();
      expect(scoped.publish).toHaveLength(0);
      expect(all.publish).toBeDefined();
      expect(all.publish).toHaveLength(0);
    });

    test('should define an empty access array even if is not defined in packages', () => {
      const { packages } = parseConfigFile(parseConfigurationFile('pkgs-basic-no-access'));
      const access = normalisePackageAccess(packages);

      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      // publish must defined
      expect(scoped.access).toBeDefined();
      expect(scoped.access).toHaveLength(0);
      expect(all.access).toBeDefined();
      expect(all.access).toHaveLength(0);
    });

    test('should define an empty proxy array even if is not defined in package', () => {
      const { packages } = parseConfigFile(parseConfigurationFile('pkgs-basic-no-proxy'));
      const access = normalisePackageAccess(packages);

      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      // publish must defined
      expect(scoped.proxy).toBeDefined();
      expect(scoped.proxy).toHaveLength(0);
      expect(all.proxy).toBeDefined();
      expect(all.proxy).toHaveLength(0);
    });

    test('should test multi user group definition', () => {
      const { packages } = parseConfigFile(parseConfigurationFile('pkgs-multi-group'));
      const access = normalisePackageAccess(packages);

      expect(access).toBeDefined();
      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];

      const all = access[`${PACKAGE_ACCESS.ALL}`];

      expect(scoped).toBeDefined();
      expect(scoped.access).toContain('$all');
      expect(scoped.publish).toHaveLength(2);
      expect(scoped.publish).toContain('admin');
      expect(scoped.publish).toContain('superadmin');

      expect(all).toBeDefined();
      expect(all.access).toHaveLength(3);
      expect(all.access).toContain('$all');
      expect(all.publish).toHaveLength(1);
      expect(all.publish).toContain('admin');
    });

    test(
      'should normalize deprecated packages into the new ones ' + '(backward props compatible)',
      () => {
        const { packages } = parseConfigFile(parseConfigurationFile('deprecated-pkgs-basic'));
        const access = normalisePackageAccess(packages);

        expect(access).toBeDefined();

        const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
        const all = access[`${PACKAGE_ACCESS.ALL}`];
        const react = access['react-*'];

        expect(react).toBeDefined();
        expect(react.access).toBeDefined();

        // Intended checks, Typescript should catch this, we test the runtime part
        // @ts-ignore
        expect(react.access).toEqual([]);
        // @ts-ignore
        expect(react.publish[0]).toBe('admin');
        expect(react.proxy).toBeDefined();
        // @ts-ignore
        expect(react.proxy).toEqual([]);
        expect(react.storage).toBeDefined();

        expect(react.storage).toBe('react-storage');
        expect(scoped).toBeDefined();
        expect(scoped.storage).not.toBeDefined();
        expect(all).toBeDefined();
        expect(all.access).toBeDefined();
        expect(all.storage).not.toBeDefined();
        expect(all.publish).toBeDefined();
        expect(all.proxy).toBeDefined();
      }
    );

    test('should check not default packages access', () => {
      const { packages } = parseConfigFile(parseConfigurationFile('pkgs-empty'));
      const access = normalisePackageAccess(packages);
      expect(access).toBeDefined();

      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      expect(scoped).toBeUndefined();

      // ** should be added by default **
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      expect(all).toBeDefined();

      expect(all.access).toBeDefined();
      expect(_.isArray(all.access)).toBeTruthy();
      expect(all.publish).toBeDefined();
      expect(_.isArray(all.publish)).toBeTruthy();
    });
  });

  describe('getMatchedPackagesSpec', () => {
    test('should test basic config', () => {
      const { packages } = parseConfigFile(parseConfigurationFile('pkgs-custom'));
      // @ts-ignore
      expect(getMatchedPackagesSpec('react', packages).proxy).toMatch('facebook');
      // @ts-ignore
      expect(getMatchedPackagesSpec('angular', packages).proxy).toMatch('google');
      // @ts-ignore
      expect(getMatchedPackagesSpec('vue', packages).proxy).toMatch('npmjs');
      // @ts-ignore
      expect(getMatchedPackagesSpec('@scope/vue', packages).proxy).toMatch('npmjs');
    });

    test('should test no ** wildcard on config', () => {
      const { packages } = parseConfigFile(parseConfigurationFile('pkgs-nosuper-wildcard-custom'));
      // @ts-ignore
      expect(getMatchedPackagesSpec('react', packages).proxy).toMatch('facebook');
      // @ts-ignore
      expect(getMatchedPackagesSpec('angular', packages).proxy).toMatch('google');
      // @ts-ignore
      expect(getMatchedPackagesSpec('@fake/angular', packages).proxy).toMatch('npmjs');
      expect(getMatchedPackagesSpec('vue', packages)).toBeUndefined();
      expect(getMatchedPackagesSpec('@scope/vue', packages)).toBeUndefined();
    });
  });
});
