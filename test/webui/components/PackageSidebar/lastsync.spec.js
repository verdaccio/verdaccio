/**
 * LastSync component
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import LastSync from '../../../../src/webui/src/components/PackageSidebar/modules/LastSync';
import { packageMeta } from '../store/packageMeta';

jest.mock(
  '../../../../src/webui/utils/datetime',
  () => require('../__mocks__/datetime').default
);
 
console.error = jest.fn();

describe('<PackageSidebar /> : <LastSync />', () => {
  it('should load the component and check getters: lastUpdate, recentReleases with package data', () => {
    const wrapper = mount(<LastSync packageMeta={packageMeta} />);
    const instance = wrapper.instance();
    const result = [
      { time: 'Dec 14, 2017, 3:43 PM', version: '2.7.1' },
      { time: 'Dec 5, 2017, 11:25 PM', version: '2.7.0' },
      { time: 'Nov 8, 2017, 10:47 PM', version: '2.6.6' }
    ];
    expect(instance.lastUpdate).toEqual('Dec 14, 2017, 3:43 PM');
    expect(instance.recentReleases).toEqual(result);
  });

  it('should load the LastSync component and match snapshot', () => {
    const wrapper = shallow(<LastSync packageMeta={packageMeta} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
