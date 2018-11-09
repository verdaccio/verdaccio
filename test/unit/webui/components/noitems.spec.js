/**
 * NoItems component
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import NoItems from '../../../../src/webui/components/NoItems/index';

console.error = jest.fn();

describe('<NoItem /> component', () => {
  it('should load the component in default state', () => {
    const wrapper = mount(<NoItems />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should set html from props', () => {
    const props = {
      text: 'This is a test string'
    };
    const wrapper = shallow(<NoItems {...props} />);
    expect(wrapper.find('h2').text()).toEqual('This is a test string');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
