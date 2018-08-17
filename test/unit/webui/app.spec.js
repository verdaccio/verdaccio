import React from 'react';
import { mount } from 'enzyme';
import storage from '../../../src/webui/utils/storage';
import App from '../../../src/webui/app';
import { API_ERROR } from '../../../src/lib/constants';

import {generateTokenWithTimeRange} from './components/__mocks__/token';

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

jest.mock('element-theme-default', () => ({}));

jest.mock('element-react/src/locale/lang/en', () => ({}));

jest.mock('../../../src/webui/utils/api', () => ({
  request: require('./components/__mocks__/api').default.request
}));

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<App />);
  });
  it('loadLogo: set logo url in state', async () => {
    const { loadLogo } = wrapper.instance();
    await loadLogo();
    expect(wrapper.state().logoUrl).toEqual(
      'http://localhost/-/static/logo.png'
    );
  });

  it('toggleLoginModal: should toggle the value in state', () => {
    const { toggleLoginModal } = wrapper.instance();
    expect(wrapper.state().showLoginModal).toBeFalsy();
    toggleLoginModal();
    expect(wrapper.state('showLoginModal')).toBeTruthy();
    expect(wrapper.state('error')).toEqual({});
  });

  it('isUserAlreadyLoggedIn: token already available in storage', async () => {
    
    storage.setItem('username', 'verdaccio');
    storage.setItem('token', generateTokenWithTimeRange(24));
    const { isUserAlreadyLoggedIn } = wrapper.instance();

    isUserAlreadyLoggedIn();

    expect(wrapper.state('user').username).toEqual('verdaccio');
  });

  it('handleLogout - logouts the user and clear localstorage', () => {
    const { handleLogout } = wrapper.instance();
    storage.setItem('username', 'verdaccio');
    storage.setItem('token', 'xxxx.TOKEN.xxxx');

    handleLogout();
    expect(handleLogout()).toBeUndefined();
    expect(wrapper.state('user')).toEqual({});
    expect(wrapper.state('isLoggedIn')).toBeFalsy();
  });

  it('doLogin - login the user successfully', async () => {
    const { doLogin } = wrapper.instance();
    await doLogin('sam', '1234');
    const result = {
      username: 'sam',
      token: 'TEST_TOKEN'
    };
    expect(wrapper.state('user')).toEqual(result);
    expect(wrapper.state('isUserLoggedIn')).toBeTruthy();
    expect(wrapper.state('showLoginModal')).toBeFalsy();
    expect(storage.getItem('username')).toEqual('sam');
    expect(storage.getItem('token')).toEqual('TEST_TOKEN');
  });

  it('doLogin - authentication failure', async () => {
    const { doLogin } = wrapper.instance();
    await doLogin('sam', '12345');
    const result = {
      description: API_ERROR.BAD_USERNAME_PASSWORD,
      title: 'Unable to login',
      type: 'error'
    };
    expect(wrapper.state('user')).toEqual({});
    expect(wrapper.state('error')).toEqual(result);
  });
});
