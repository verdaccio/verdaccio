/**
 * Package Sidebar module
 */

import React from 'react';
import { mount } from 'enzyme';
import PackageSidebar from '../../../../../src/webui/components/PackageSidebar/index';
import { packageMeta } from '../store/packageMeta';

jest.mock('../../../../../src/webui/utils/api', () => ({
  request: require('../__mocks__/api').default.request,
}));

console.error = jest.fn();

describe('<PackageSidebar /> component', () => {
  test('should throw error for the required props', () => {
    const wrapper = mount(<PackageSidebar />);
    const { loadPackageData } = wrapper.instance();
    expect(console.error).toHaveBeenCalled();
    loadPackageData().catch(response => {
      expect(response).toBeUndefined();
      expect(wrapper.state()).toEqual({ failed: true });
    });
  });

  test('should load the packageMeta', () => {
    const wrapper = mount(<PackageSidebar packageName={'verdaccio'} />);
    const { loadPackageData } = wrapper.instance();
    loadPackageData('verdaccio').then(response => {
      expect(wrapper.state('packageMeta')).toEqual(packageMeta);
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
