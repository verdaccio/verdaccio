// @flow

import path from 'path';
import _ from 'lodash';
import {spliceURL}  from '../../../src/utils/string';
import {parseConfigFile} from '../../../src/lib/utils';
import {
  getMatchedPackagesSpec,
  hasProxyTo,
  normalisePackageAccess, sanityCheckUplinksProps,
  uplinkSanityCheck
} from '../../../src/lib/config-utils';
import {PACKAGE_ACCESS, ROLES} from '../../../src/lib/constants';

describe('Config Utilities', () => {

  const parsePartial = (name) => {
    return path.join(__dirname, `../partials/config/yaml/${name}.yaml`);
  };

  describe('uplinkSanityCheck', () => {
    test('should test basic conversion', ()=> {
      const uplinks = uplinkSanityCheck(parseConfigFile(parsePartial('uplink-basic')).uplinks);
        expect(Object.keys(uplinks)).toContain('server1');
        expect(Object.keys(uplinks)).toContain('server2');
    });

    test('should throw error on blacklisted uplink name', ()=> {
      const {uplinks} = parseConfigFile(parsePartial('uplink-wrong'));

      expect(() => {
        uplinkSanityCheck(uplinks)
      }).toThrow('CONFIG: reserved uplink name: anonymous');
    });
  });

  describe('sanityCheckUplinksProps', () => {
    test('should fails if url prop is missing', ()=> {
      const {uplinks} = parseConfigFile(parsePartial('uplink-wrong'));
        expect(() => {
          sanityCheckUplinksProps(uplinks)
        }).toThrow('CONFIG: no url for uplink: none-url');
    });

    test('should bypass an empty uplink list', ()=> {
      expect(sanityCheckUplinksProps([])).toHaveLength(0);
    });
  });

  describe('normalisePackageAccess', () => {
    test('should test basic conversion', ()=> {
      const {packages} = parseConfigFile(parsePartial('pkgs-basic'));
      const access = normalisePackageAccess(packages);

      expect(access).toBeDefined();
      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];

      expect(scoped).toBeDefined();
      expect(all).toBeDefined();
    });

    test('should test multi group', ()=> {
      const {packages} = parseConfigFile(parsePartial('pkgs-multi-group'));
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


    test('should deprecated packages props', ()=> {
      const {packages} = parseConfigFile(parsePartial('deprecated-pkgs-basic'));
      const access = normalisePackageAccess(packages);

      expect(access).toBeDefined();
      const scoped = access[`${PACKAGE_ACCESS.SCOPE}`];
      const all = access[`${PACKAGE_ACCESS.ALL}`];
      const react = access['react-*'];

      expect(react).toBeDefined();
      expect(react.access).toBeDefined();
      // $FlowFixMe
      expect(react.access[0]).toBe(ROLES.$ALL);
      expect(react.publish).toBeDefined();
      // $FlowFixMe);
      expect(react.publish[0]).toBe('admin');
      expect(react.proxy).toBeDefined();
      // $FlowFixMe
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
      const {packages} = parseConfigFile(parsePartial('pkgs-empty'));
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
      const {packages} = parseConfigFile(parsePartial('pkgs-custom'));
      // $FlowFixMe
      expect(getMatchedPackagesSpec('react', packages).proxy).toMatch('facebook');
      // $FlowFixMe
      expect(getMatchedPackagesSpec('angular', packages).proxy).toMatch('google');
      // $FlowFixMe
      expect(getMatchedPackagesSpec('vue', packages).proxy).toMatch('npmjs');
      // $FlowFixMe
      expect(getMatchedPackagesSpec('@scope/vue', packages).proxy).toMatch('npmjs');
    });

    test('should test no ** wildcard on config', () => {
      const {packages} = parseConfigFile(parsePartial('pkgs-nosuper-wildcard-custom'));
      // $FlowFixMe
      expect(getMatchedPackagesSpec('react', packages).proxy).toMatch('facebook');
      // $FlowFixMe
      expect(getMatchedPackagesSpec('angular', packages).proxy).toMatch('google');
      // $FlowFixMe
      expect(getMatchedPackagesSpec('@fake/angular', packages).proxy).toMatch('npmjs');
      expect(getMatchedPackagesSpec('vue', packages)).toBeUndefined();
      expect(getMatchedPackagesSpec('@scope/vue', packages)).toBeUndefined();
    });
  });

  describe('hasProxyTo', () => {
    test('should test basic config', () => {
      const packages = normalisePackageAccess(parseConfigFile(parsePartial('pkgs-basic')).packages);
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
      const packages = normalisePackageAccess(parseConfigFile(parsePartial('pkgs-custom')).packages);
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
      const packages = normalisePackageAccess(parseConfigFile(parsePartial('pkgs-empty')).packages);
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
});
