/**
 * NotFound component
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import NotFound from '../../../../src/webui/components/NotFound/index';

console.error = jest.fn();

describe('<NotFound /> component', () => {
  test('should load the component in default state', () => {
    const wrapper = mount(<NotFound pkg='test' />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should set html from props', () => {
    const props = {
      pkg: 'verdaccio'
    };
    const wrapper = shallow(<NotFound {...props} />);
    expect(wrapper.find('h1').text()).toEqual('Error 404 - verdaccio');
    expect(wrapper.find('p').text()).toEqual(
      'Oops, The package you are trying to access does not exist.'
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
