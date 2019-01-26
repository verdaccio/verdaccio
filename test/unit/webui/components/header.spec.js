/**
 * @prettier
 * @flow
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import Header from '../../../../src/webui/components/Header';

describe('<Header /> component with logged in state', () => {
  let wrapper;
  let routerWrapper;
  let instance;
  let props;

  beforeEach(() => {
    props = {
      username: 'test user',
      handleLogout: jest.fn(),
      logo: '',
      onToggleLoginModal: jest.fn(),
      scope: 'test scope',
      withoutSearch: true,
    };
    routerWrapper = shallow(
      <Router>
        <Header {...props} />
      </Router>
    );
    wrapper = routerWrapper.find(Header).dive();
    instance = wrapper.instance();
  });

  test('should load the component in logged in state', () => {
    const state = {
      openInfoDialog: false,
      packages: undefined,
      registryUrl: 'http://localhost',
      showMobileNavBar: false,
    };

    expect(wrapper.state()).toEqual(state);
    expect(routerWrapper.html()).toMatchSnapshot();
  });

  test('handleLoggedInMenu: set anchorEl to html element value in state', () => {
    // creates a sample menu
    const div = document.createElement('div');
    const text = document.createTextNode('sample menu');
    div.appendChild(text);

    const event = {
      currentTarget: div,
    };

    instance.handleLoggedInMenu(event);
    expect(wrapper.state('anchorEl')).toEqual(div);
  });
});

describe('<Header /> component with logged out state', () => {
  let wrapper;
  let routerWrapper;
  let instance;
  let props;

  beforeEach(() => {
    props = {
      handleLogout: jest.fn(),
      onToggleLoginModal: jest.fn(),
      scope: 'test scope',
      logo: '',
      withoutSearch: true,
    };
    routerWrapper = shallow(
      <Router>
        <Header {...props} />
      </Router>
    );
    wrapper = routerWrapper.find(Header).dive();
    instance = wrapper.instance();
  });

  test('should load the component in logged out state', () => {
    const state = {
      openInfoDialog: false,
      packages: undefined,
      registryUrl: 'http://localhost',
      showMobileNavBar: false,
    };
    expect(wrapper.state()).toEqual(state);
    expect(routerWrapper.html()).toMatchSnapshot();
  });

  test('handleLoggedInMenuClose: set anchorEl value to null in state', () => {
    instance.handleLoggedInMenuClose();
    expect(wrapper.state('anchorEl')).toBeNull();
  });

  test('handleOpenRegistryInfoDialog: set openInfoDialog to be truthy in state', () => {
    instance.handleOpenRegistryInfoDialog();
    expect(wrapper.state('openInfoDialog')).toBeTruthy();
  });

  test('handleCloseRegistryInfoDialog: set openInfoDialog to be falsy in state', () => {
    instance.handleCloseRegistryInfoDialog();
    expect(wrapper.state('openInfoDialog')).toBeFalsy();
  });

  test('handleToggleLogin: close/open popover menu', () => {
    instance.handleToggleLogin();
    expect(wrapper.state('anchorEl')).toBeNull();
    expect(props.onToggleLoginModal).toHaveBeenCalled();
  });
});
