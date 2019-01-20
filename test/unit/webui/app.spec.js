import React from 'react';
import { mount } from 'enzyme';
import storage from '../../../src/webui/utils/storage';
import App from '../../../src/webui/app';
import { API_ERROR } from '../../../src/lib/constants';

import { generateTokenWithTimeRange } from './components/__mocks__/token';

jest.mock('../../../src/webui/utils/storage', () => {
  class LocalStorageMock {
    constructor() {
      this.store = {};
    }
    clear() {
      this.store = {};
    }
    getItem(key) {
      return this.store[key] || null;
    }
    setItem(key, value) {
      this.store[key] = value.toString();
    }
    removeItem(key) {
      delete this.store[key];
    }
  }
  return new LocalStorageMock();
});

jest.mock('../../../src/webui/utils/api', () => ({
  request: require('./components/__mocks__/api').default.request
}));

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<App />);
  });

  test('toggleLoginModal: should toggle the value in state', () => {
    const { handleToggleLoginModal } = wrapper.instance();
    expect(wrapper.state().showLoginModal).toBeFalsy();
    handleToggleLoginModal();
    expect(wrapper.state('showLoginModal')).toBeTruthy();
    expect(wrapper.state('error')).toEqual({});
  });

  test('isUserAlreadyLoggedIn: token already available in storage', async () => {

    storage.setItem('username', 'verdaccio');
    storage.setItem('token', generateTokenWithTimeRange(24));
    const { isUserAlreadyLoggedIn } = wrapper.instance();

    isUserAlreadyLoggedIn();

    expect(wrapper.state('user').username).toEqual('verdaccio');
  });

  test('handleLogout - logouts the user and clear localstorage', async () => {
    const { handleLogout } = wrapper.instance();
    storage.setItem('username', 'verdaccio');
    storage.setItem('token', 'xxxx.TOKEN.xxxx');

    await handleLogout();
    expect(wrapper.state('user')).toEqual({});
    expect(wrapper.state('isUserLoggedIn')).toBeFalsy();
  });

  test('handleDoLogin - login the user successfully', async () => {
    const { handleDoLogin } = wrapper.instance();
    await handleDoLogin('sam', '1234');
    const result = {
      username: 'sam',
      token: 'TEST_TOKEN'
    };
    expect(wrapper.state('isUserLoggedIn')).toBeTruthy();
    expect(wrapper.state('showLoginModal')).toBeFalsy();
    expect(storage.getItem('username')).toEqual('sam');
    expect(storage.getItem('token')).toEqual('TEST_TOKEN');
    expect(wrapper.state('user')).toEqual(result);
  });

  test('handleDoLogin - authentication failure', async () => {
    const { handleDoLogin } = wrapper.instance();
    await handleDoLogin('sam', '12345');
    console.log(API_ERROR.BAD_USERNAME_PASSWORD);
    const result = {
      description: 'bad username/password, access denied',
      title: 'Unable to login',
      type: 'error'
    };
    expect(wrapper.state('user')).toEqual({});
    expect(wrapper.state('error')).toEqual(result);
  });
});
