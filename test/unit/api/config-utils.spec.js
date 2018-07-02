// @flow
import path from 'path';
import {spliceURL}  from '../../../src/utils/string';
import {parseConfigFile} from '../../../src/lib/utils';
import {normalisePackageAccess} from '../../../src/lib/config-utils';
import {PACKAGE_ACCESS, ROLES} from '../../../src/lib/constants';

describe('Config Utilities', () => {

  const parsePartial = (name) => {
    return path.join(__dirname, `../partials/config/yaml/${name}.yaml`);
  };

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
      const all = access[`${PACKAGE_ACCESS.ALL}`];

      expect(all).toBeDefined();
      expect(all.access).toBeUndefined();
      expect(all.publish).toBeUndefined();

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
