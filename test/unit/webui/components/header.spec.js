/**
 * Header component
 */
import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../../../src/webui/components/Header';

console.error = jest.fn();

describe('<Header /> component shallow', () => {

  it('should give error for required props', () => {
    shallow(<Header />);
    expect(console.error).toHaveBeenCalled();
  });

  it('should load header component in login state', () => {
    const props = {
      username: 'verdaccio',
      logo: 'logo.png',
      scope: 'scope:',
      handleLogout: jest.fn(),
      toggleLoginModal: () => {}
    }
    const wrapper = shallow(<Header {...props} />);
    wrapper.find('.header-button-logout').simulate('click');
    expect(props.handleLogout).toHaveBeenCalled();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load header component in logout state', () => {
    const props = {
      username: undefined,
      logo: 'logo.png',
      scope: 'scope:',
      handleLogout: () => {},
      toggleLoginModal: jest.fn()
    }
    const wrapper = shallow(<Header {...props} />);
    wrapper.find('.header-button-login').simulate('click');
    expect(props.toggleLoginModal).toHaveBeenCalled();
    expect(wrapper.html()).toMatchSnapshot();
  });
})
