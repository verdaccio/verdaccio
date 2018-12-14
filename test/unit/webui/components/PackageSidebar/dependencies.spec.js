/**
 * Dependencies component
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import Dependencies, {
  NO_DEPENDENCIES,
  DEP_ITEM_CLASS
} from '../../../../../src/webui/components/PackageSidebar/modules/Dependencies/index';
import ModuleContentPlaceholder from '../../../../../src/webui/components/PackageSidebar/ModuleContentPlaceholder';


describe('<PackageSidebar /> : <Dependencies />', () => {
  test('should load dependencies', () => {
    const dependencies = {
      '@verdaccio/file-locking': '0.0.3',
      '@verdaccio/streams': '0.0.2',
      JSONStream: '^1.1.1',
      'apache-md5': '^1.1.2',
      async: '^2.0.1',
      'body-parser': '^1.15.0',
      bunyan: '^1.8.0',
      chalk: '^2.0.1',
      commander: '^2.11.0',
      compression: '1.6.2',
      cookies: '^0.7.0',
      cors: '^2.8.3',
      express: '4.15.3',
      global: '^4.3.2',
      handlebars: '4.0.5',
      'http-errors': '^1.4.0',
      'js-string-escape': '1.0.1',
      'js-yaml': '^3.6.0',
      jsonwebtoken: '^7.4.1',
      lockfile: '^1.0.1',
      lodash: '4.17.4',
      lunr: '^0.7.0',
      marked: '0.3.6',
      mime: '^1.3.6',
      minimatch: '^3.0.2',
      mkdirp: '^0.5.1',
      pkginfo: '^0.4.0',
      request: '^2.72.0',
      semver: '^5.1.0',
      'unix-crypt-td-js': '^1.0.0'
    };
    const wrapper = shallow(<Dependencies dependencies={ dependencies } />);

    expect(wrapper.find(`.${DEP_ITEM_CLASS}`)).toHaveLength(Object.keys(dependencies).length);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should load the package without dependencies', () => {
    const wrapper = shallow(<Dependencies />);

    expect(wrapper.find(ModuleContentPlaceholder).props().text).toBe(NO_DEPENDENCIES);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should permit overriding title', () => {
    const wrapper = mount(<Dependencies title={ "Package dependencies" } />);

    expect(wrapper.find('h2').text()).toEqual('Package dependencies');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
