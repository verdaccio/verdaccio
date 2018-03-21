/**
 * LastSync component
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import LastSync from '../../../../src/webui/src/components/PackageSidebar/modules/LastSync';
import { packageMeta } from '../store/packageMeta';
 
console.error = jest.fn();

describe('<PackageSidebar /> : <LastSync />', () => {
  it('should load the component and check getters: lastUpdate, recentReleases with package data', () => {
    const wrapper = mount(<LastSync packageMeta={packageMeta} />);
    const instance = wrapper.instance();
    const result = [
      { time: '2017/12/14, 15:43:27', version: '2.7.1' },
      { time: '2017/12/05, 23:25:06', version: '2.7.0' },
      { time: '2017/11/08, 22:47:16', version: '2.6.6' }
    ];
    const lastUpdated = '2017/12/14, 15:43:52';
    expect(instance.lastUpdate).toEqual(lastUpdated);
    expect(instance.recentReleases).toEqual(result);
  });

  it('should load the LastSync component and match snapshot', () => {
    const wrapper = shallow(<LastSync packageMeta={packageMeta} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
