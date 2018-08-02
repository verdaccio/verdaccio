/**
 * Infos component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Infos from '../../../../../src/webui/components/PackageSidebar/modules/Infos/index';

describe('<PackageSidebar /> : <Infos />', () => {
  it('should load the component without props', () => {
    const wrapper = shallow(<Infos/>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load the Info component with props', () => {
    const props = {
      homepage: 'https://www.verdaccio.org',
      license: 'MIT',
      repository: 'https://github.com/verdaccio/verdaccio'
    }
    const wrapper = shallow(<Infos {...props}/>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load the Info component with homepage only', () => {
    const props = {
      homepage: 'https://www.verdaccio.org'
    }
    const wrapper = shallow(<Infos {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load the Info component with license only', () => {
    const props = {
      license: 'MIT',
    }
    const wrapper = shallow(<Infos {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load the Info component with repository only', () => {
    const props = { repository: 'https://github.com/verdaccio/verdaccio' };
    const wrapper = shallow(<Infos {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
