/**
 * Help component
 */
import React from 'react';
import { shallow } from 'enzyme';
import Help from '../../../../src/webui/components/Help/index';

describe('<Help /> component', () => {

  it('should render the component in default state', () => {
    const wrapper = shallow(<Help />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
