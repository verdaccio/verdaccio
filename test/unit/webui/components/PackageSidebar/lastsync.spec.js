/**
 * LastSync component
 */

import React from 'react';
import { shallow } from 'enzyme';
import LastSync from '../../../../../src/webui/components/PackageSidebar/modules/LastSync/index';

describe('<PackageSidebar /> : <LastSync />', () => {
  it('should check the default props condition', () => {
    const wrapper = shallow(<LastSync/>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load the LastSync component and match snapshot', () => {
    const props = {
      lastUpdated: '2017/12/14, 15:43:52',
      recentReleases: [
        { time: '2017/12/14, 15:43:27', version: '2.7.1' },
        { time: '2017/12/05, 23:25:06', version: '2.7.0' },
        { time: '2017/11/08, 22:47:16', version: '2.6.6' }
      ]
    };
    const wrapper = shallow(<LastSync {...props}/>);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
