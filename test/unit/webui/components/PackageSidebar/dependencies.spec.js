/**
 * Dependencies component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Dependencies from '../../../../../src/webui/components/PackageSidebar/modules/Dependencies/index';


describe('<PackageSidebar /> : <Dependencies />', () => {
  it('should load dependencies', () => {
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
    const wrapper = shallow(<Dependencies dependencies={dependencies} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load the package without dependecnies', () => {
    const wrapper = shallow(<Dependencies />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
