import path from 'path';
import _ from 'lodash';
import {spliceURL}  from '../../../../src/utils/string';
import {parseConfigFile} from '../../../../src/lib/utils';
import {
  getMatchedPackagesSpec,
  hasProxyTo,
  normalisePackageAccess, sanityCheckUplinksProps,
  uplinkSanityCheck
} from '../../../../src/lib/config-utils';
import {PACKAGE_ACCESS, ROLES} from '../../../../src/lib/constants';

describe('Config Utilities', () => {

  const parseConfigurationFile = (conf) => {
    const { name, ext } = path.parse(conf);
    const format = ext.startsWith('.') ? ext.substring(1) : 'yaml';

    return path.join(__dirname, `../../partials/config/${format}/${name}.${format}`);
  };

  describe('uplinkSanityCheck', () => {
    test('should test basic conversion', ()=> {
      const uplinks = uplinkSanityCheck(parseConfigFile(parseConfigurationFile('uplink-basic')).uplinks);
      expect(Object.keys(uplinks)).toContain('server1');
      expect(Object.keys(uplinks)).toContain('server2');
    });

    test('should throw error on blacklisted uplink name', ()=> {
      const {uplinks} = parseConfigFile(parseConfigurationFile('uplink-wrong'));

      expect(() => {
        uplinkSanityCheck(uplinks)
      }).toThrow('CONFIG: reserved uplink name: anonymous');
    });
  });

  describe('sanityCheckUplinksProps', () => {
    test('should fails if url prop is missing', ()=> {
      const {uplinks} = parseConfigFile(parseConfigurationFile('uplink-wrong'));
      expect(() => {
        sanityCheckUplinksProps(uplinks)
      }).toThrow('CONFIG: no url for uplink: none-url');
    });

    test('should bypass an empty uplink list', ()=> {
      // @ts-ignore
      expect(sanityCheckUplinksProps([])).toHaveLength(0);
    });
  });

  describe('normalisePackageAccess', () => {
    test('should test basic conversion', ()=> {
      const {packages} = parseConfigFile(parseConfigurationFile('pkgs-basic'));
      const access = normalisePackageAccess(packages);

      expect(access).toBeDefined();
      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];

      expect(scoped).toBeDefined();
      expect(all).toBeDefined();
    });

    test('should define an empty publish array even if is not defined in packages', ()=> {
      const {packages} = parseConfigFile(parseConfigurationFile('pkgs-basic-no-publish'));
      const access = normalisePackageAccess(packages);

      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      // publish must defined
      expect(scoped.publish).toBeDefined();
      expect(scoped.publish).toHaveLength(0);
      expect(all.publish).toBeDefined();
      expect(all.publish).toHaveLength(0);
    });

    test('should define an empty access array even if is not defined in packages', ()=> {
      const {packages} = parseConfigFile(parseConfigurationFile('pkgs-basic-no-access'));
      const access = normalisePackageAccess(packages);

      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      // publish must defined
      expect(scoped.access).toBeDefined();
      expect(scoped.access).toHaveLength(0);
      expect(all.access).toBeDefined();
      expect(all.access).toHaveLength(0);
    });

    test('should define an empty proxy array even if is not defined in package', ()=> {
      const {packages} = parseConfigFile(parseConfigurationFile('pkgs-basic-no-proxy'));
      const access = normalisePackageAccess(packages);

      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      // publish must defined
      expect(scoped.proxy).toBeDefined();
      expect(scoped.proxy).toHaveLength(0);
      expect(all.proxy).toBeDefined();
      expect(all.proxy).toHaveLength(0);
    });

    test('should test multi user group definition', ()=> {
      const {packages} = parseConfigFile(parseConfigurationFile('pkgs-multi-group'));
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


    test('should normalize deprecated packages into the new ones (backward props compatible)', ()=> {
      const {packages} = parseConfigFile(parseConfigurationFile('deprecated-pkgs-basic'));
      const access = normalisePackageAccess(packages);

      expect(access).toBeDefined();
      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      const react = access['react-*'];

      expect(react).toBeDefined();
      expect(react.access).toBeDefined();

      // Intended checks, Typescript shoold catch this, we test the runtime part
      // @ts-ignore
      expect(react.access[0]).toBe(ROLES.$ALL);
      expect(react.publish).toBeDefined();
      // @ts-ignore
      expect(react.publish[0]).toBe('admin');
      expect(react.proxy).toBeDefined();
      // @ts-ignore
      expect(react.proxy[0]).toBe('uplink2');
      expect(react.storage).toBeDefined();

      expect(react.storage).toBe('react-storage');
      expect(scoped).toBeDefined();
      expect(scoped.storage).not.toBeDefined();
      expect(all).toBeDefined();
      expect(all.access).toBeDefined();
      expect(all.storage).not.toBeDefined();
      expect(all.publish).toBeDefined();
      expect(all.proxy).toBeDefined();
      expect(all.allow_access).toBeUndefined();
      expect(all.allow_publish).toBeUndefined();
      expect(all.proxy_access).toBeUndefined();
    });

    test('should check not default packages access', ()=> {
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
      const {packages} = parseConfigFile(parseConfigurationFile('pkgs-custom'));
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
      const {packages} = parseConfigFile(parseConfigurationFile('pkgs-nosuper-wildcard-custom'));
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

  describe('hasProxyTo', () => {
    test('should test basic config', () => {
      const packages = normalisePackageAccess(parseConfigFile(parseConfigurationFile('pkgs-basic')).packages);
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
      const packages = normalisePackageAccess(parseConfigFile(parseConfigurationFile('pkgs-custom')).packages);
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
      const packages = normalisePackageAccess(parseConfigFile(parseConfigurationFile('pkgs-empty')).packages);
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

  describe('spliceURL', () => {
    test('should splice two strings and generate a url', () => {
      const url: string = spliceURL('http://domain.com', '/-/static/logo.png');

      expect(url).toMatch('http://domain.com/-/static/logo.png');
    });

    test('should splice a empty strings and generate a url', () => {
      const url: string = spliceURL('', '/-/static/logo.png');

      expect(url).toMatch('/-/static/logo.png');
    });
  });

  describe('JSON', () => {
    test('parse default.json', () => {
      const config = parseConfigFile(parseConfigurationFile('default.json'));

      expect(config.storage).toBeDefined();
    });

    test('parse invalid.json', () => {
      expect(function ( ) {
        parseConfigFile(parseConfigurationFile('invalid.json'));
      }).toThrow(/Error/);
    });

    test('parse not-exists.json', () => {
      expect(function ( ) {
        parseConfigFile(parseConfigurationFile('not-exists.json'));
      }).toThrow(/Error/);
    });
  });

  describe('JavaScript', () => {
    test('parse default.js', () => {
      const config = parseConfigFile(parseConfigurationFile('default.js'));

      expect(config.storage).toBeDefined();
    });

    test('parse invalid.js', () => {
      expect(function ( ) {
        parseConfigFile(parseConfigurationFile('invalid.js'));
      }).toThrow(/Error/);
    });

    test('parse not-exists.js', () => {
      expect(function ( ) {
        parseConfigFile(parseConfigurationFile('not-exists.js'));
      }).toThrow(/Error/);
    });
  });
});
