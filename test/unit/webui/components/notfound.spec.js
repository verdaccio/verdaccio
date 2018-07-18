/**
 * NotFound component
 */

import React from 'react';
import { shallow } from 'enzyme';
import NotFound from '../../../../src/webui/components/NotFound/index';

console.error = jest.fn();

describe('<NotFound /> component', () => {
  it('should give error for the required fields', () => {
    shallow(<NotFound />);
    expect(console.error).toBeCalled();
  });

  it('should set html from props', () => {
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
