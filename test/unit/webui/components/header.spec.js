/**
 * @prettier
 * @flow
 */

import React from 'react';
import {mount} from 'enzyme';
import Header from '../../../../src/webui/components/Header';

describe('<Header /> component with logged in state', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      username: 'test user',
      handleLogout: jest.fn(),
      toggleLoginModal: jest.fn(),
      scope: 'test scope',
    };
    wrapper = mount(<Header {...props} />);
  });

  test('should load the component in logged in state', () => {
    const state = {openInfoDialog: false, registryUrl: 'http://localhost'};
    expect(wrapper.state()).toEqual(state);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('handleLoggedInMenu: set anchorEl to html element value in state', () => {
    const {handleLoggedInMenu} = wrapper.instance();

    // creates a sample menu
    const div = document.createElement('div');
    const text = document.createTextNode('sample menu');
    div.appendChild(text);

    const event = {
      currentTarget: div,
    };

    handleLoggedInMenu(event);
    expect(wrapper.state('anchorEl')).toEqual(div);
  });
});

describe('<Header /> component with logged out state', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      handleLogout: jest.fn(),
      toggleLoginModal: jest.fn(),
      scope: 'test scope',
    };
    wrapper = mount(<Header {...props} />);
  });

  test('should load the component in logged out state', () => {
    const state = {openInfoDialog: false, registryUrl: 'http://localhost'};
    expect(wrapper.state()).toEqual(state);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('handleLoggedInMenuClose: set anchorEl value to null in state', () => {
    const {handleLoggedInMenuClose} = wrapper.instance();
    handleLoggedInMenuClose();
    expect(wrapper.state('anchorEl')).toBeNull();
  });

  test('handleOpenRegistryInfoDialog: set openInfoDialog to be truthy in state', () => {
    const {handleOpenRegistryInfoDialog} = wrapper.instance();
    handleOpenRegistryInfoDialog();
    expect(wrapper.state('openInfoDialog')).toBeTruthy();
  });

  test('handleCloseRegistryInfoDialog: set openInfoDialog to be falsy in state', () => {
    const {handleCloseRegistryInfoDialog} = wrapper.instance();
    handleCloseRegistryInfoDialog();
    expect(wrapper.state('openInfoDialog')).toBeFalsy();
  });

  test('handleToggleLogin: close/open popover menu', () => {
    const {handleToggleLogin} = wrapper.instance();
    handleToggleLogin();
    expect(wrapper.state('anchorEl')).toBeNull();
    expect(props.toggleLoginModal).toHaveBeenCalled();
  });
});
