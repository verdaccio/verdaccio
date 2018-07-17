/**
 * Infos component
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import Infos from '../../../../../src/webui/components/PackageSidebar/modules/Infos/index';
import { packageMeta } from '../store/packageMeta';
 
console.error = jest.fn();

describe('<PackageSidebar /> : <Infos />', () => {
  it('should load the component and check getter: info with package data', () => {
    const wrapper = mount(<Infos packageMeta={packageMeta} />);
    const instance = wrapper.instance();
    const result = {
      repo: { type: 'git', url: 'git://github.com/verdaccio/verdaccio.git' },
      homepage: { url: 'https://github.com/verdaccio/verdaccio#readme' },
      license: 'WTFPL'
    };

    expect(instance.infos).toEqual(result);
  });

  it('should load the Info component and match snapshot', () => {
    const wrapper = shallow(<Infos packageMeta={packageMeta} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
