import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
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
    wrapper = mount(
      <IntlProvider locale='en'>
        <App />
      </IntlProvider>
    );
  });
  
  it('loadLogo: set logo url in state', async () => {
    const { loadLogo } = wrapper.find('App').instance();
    await loadLogo();
    setTimeout(function() {
      expect(wrapper.state('logoUrl')).toEqual('http://localhost/-/static/logo.png');
    }, 100);
  });

  it('toggleLoginModal: should toggle the value in state', () => {
    const { toggleLoginModal } = wrapper.find('App').instance();
    expect(wrapper.state('showLoginModal')).toBeFalsy();
    toggleLoginModal();
    setTimeout(function() {
      expect(wrapper.state('showLoginModal')).toBeTruthy();
      expect(wrapper.state('error')).toEqual({});
    }, 100);
  });

  it('isUserAlreadyLoggedIn: token already available in storage', async () => {
    storage.setItem('username', 'verdaccio');
    storage.setItem('token', generateTokenWithTimeRange(24));
    const { isUserAlreadyLoggedIn } = wrapper.find('App').instance();

    isUserAlreadyLoggedIn();

    setTimeout(function() {
      expect(wrapper.state('user').username).toEqual('verdaccio');
    }, 100);
  });

  it('handleLogout - logouts the user and clear localstorage', async () => {
    const { handleLogout } = wrapper.find('App').instance();
    storage.setItem('username', 'verdaccio');
    storage.setItem('token', 'xxxx.TOKEN.xxxx');

    await handleLogout();
    setTimeout(function() {
      expect(wrapper.state('user')).toEqual({});
      expect(wrapper.state('isUserLoggedIn')).toBeFalsy();
    }, 100);
  });

  it('doLogin - login the user successfully', async () => {
    const { doLogin } = wrapper.find('App').instance();
    await doLogin('sam', '1234');
    const result = {
      username: 'sam',
      token: 'TEST_TOKEN'
    };
    setTimeout(function() {
      expect(wrapper.state('isUserLoggedIn')).toBeTruthy();
      expect(wrapper.state('showLoginModal')).toBeFalsy();
      expect(storage.getItem('username')).toEqual('sam');
      expect(storage.getItem('token')).toEqual('TEST_TOKEN');
      expect(wrapper.state('user')).toEqual(result);
    }, 100);
  });

  it('doLogin - authentication failure', async () => {
    const { doLogin } = wrapper.find('App').instance();
    await doLogin('sam', '12345');
    console.log(API_ERROR.BAD_USERNAME_PASSWORD);
    const result = {
      description: 'bad username/password, access denied',
      title: 'Unable to login',
      type: 'error'
    };
    setTimeout(function() {
      expect(wrapper.state('user')).toEqual({});
      expect(wrapper.state('error')).toEqual(result);
    }, 100);
  });
});
