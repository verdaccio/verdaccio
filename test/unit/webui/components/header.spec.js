/**
 * Header component
 */
import React from 'react';
import { shallow, mount } from 'enzyme';
import { Base64 } from 'js-base64';
import addHours from 'date-fns/add_hours'
import Header from '../../../../src/webui/components/Header';
import { BrowserRouter } from 'react-router-dom';
import storage from '../../../../src/webui/utils/storage';

jest.mock('../../../../src/webui/utils/storage', () => {
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

jest.mock('../../../../src/webui/utils/api', () => ({
  request: require('./__mocks__/api').default.request,
}));

console.error = jest.fn();

const generateTokenWithTimeRange = (limit = 0) => {
  const payload = {
    username: 'verdaccio',
    exp: Number.parseInt((addHours(new Date(), limit).getTime() / 1000), 10)
  }
  return `xxxxxx.${Base64.encode(JSON.stringify(payload))}.xxxxxx`;
}

describe('<Header /> component shallow', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  });

  it('should check the initial state', () => {
    const state = {
      showLogin: false,
      username: '',
      password: '',
      logo: '',
      scope: '',
      loginError: null
    };
    const HeaderWrapper = wrapper.find(Header).dive();
    expect(HeaderWrapper.state()).toEqual(state);
  });

  it('loadLogo - should load verdaccio logo', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const { loadLogo } = HeaderWrapper.instance();

    loadLogo().then(() => {
      expect(HeaderWrapper.state('logo'))
        .toEqual('http://localhost/-/static/logo.png');
    });
  });

  it('toggleLoginModal - should toggle login modal', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const { toggleLoginModal } = HeaderWrapper.instance();
   
    expect(toggleLoginModal()).toBeUndefined();
    expect(HeaderWrapper.state('showLogin')).toBeTruthy();
  });

  it('toggleLoginModal - click on login button and cancel button in login dialog', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const spy = jest.spyOn(HeaderWrapper.instance(), 'toggleLoginModal');
    HeaderWrapper.find('.header-button-login').simulate('click');
    HeaderWrapper.find('.cancel-login-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  })

  it('handleInput - should set username and password in state', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const handleInput = HeaderWrapper.instance().handleInput;

    expect(handleInput('username', 'xyz')).toBeUndefined();
    expect(HeaderWrapper.state('username')).toEqual('xyz');

    expect(handleInput('password', '1234')).toBeUndefined();
    expect(HeaderWrapper.state('password')).toEqual('1234');
  });

  it('handleSubmit - should give error for blank username and password', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const {handleSubmit} = HeaderWrapper.instance();
    const error = {
      description: "Username or password can't be empty!",
      title: 'Unable to login',
      type: 'error'
    };
    expect(handleSubmit({ preventDefault: () => {} })).toBeDefined();
    expect(HeaderWrapper.state('loginError')).toEqual(error);
  });

  it('handleSubmit - should login successfully', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const {handleSubmit} = HeaderWrapper.instance();
    const event = {preventDefault: () => {}}
    const spy = jest.spyOn(event, 'preventDefault');
    
    HeaderWrapper.setState({ username: 'sam', password: '1234' });

    handleSubmit(event).then(() => {
      expect(spy).toHaveBeenCalled();
      expect(storage.getItem('token')).toEqual('TEST_TOKEN');
      expect(storage.getItem('username')).toEqual('sam');
    });
  });

  it('handleSubmit - login should failed with 401', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const {handleSubmit} = HeaderWrapper.instance();
    const errorObject = {
      title: 'Unable to login',
      type: 'error',
      description: 'bad username/password, access denied'
    };
    const event = { preventDefault: () => { } }
    const spy = jest.spyOn(event, 'preventDefault');
    HeaderWrapper.setState({ username: 'sam', password: '12345' });

    handleSubmit(event).then(() => {
      expect(spy).toHaveBeenCalled();
      expect(HeaderWrapper.state('loginError')).toEqual(errorObject);
    });
  });

  it('handleSubmit - login should failed with when no data is sent', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const {handleSubmit} = HeaderWrapper.instance();
    const error = {
      title: 'Unable to login',
      type: 'error',
      description: "Username or password can't be empty!"
    };
    const event = { preventDefault: () => { } }
    const spy = jest.spyOn(event, 'preventDefault');

    HeaderWrapper.setState({});

    handleSubmit(event).then(() => {
      expect(spy).toHaveBeenCalled();
      expect(HeaderWrapper.state('loginError')).toEqual(error);
    });
  });

  it('renderUserActionButton - should show login button', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const { renderUserActionButton } = HeaderWrapper.instance();
    expect(renderUserActionButton()).toMatchSnapshot();
  });

  it('renderUserActionButton - should show users as loggedin', () => {
    class MockedHeader extends Header {
      get isTokenExpire() {
        return false;
      }
    }
    wrapper = shallow(
      <BrowserRouter>
        <MockedHeader />
      </BrowserRouter>);
    const HeaderWrapper = wrapper.find(MockedHeader).dive();
    const { renderUserActionButton } = HeaderWrapper.instance();
    expect(renderUserActionButton()).toMatchSnapshot();
  });

  it('isTokenExpire - token is not availabe in storage', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const { isTokenExpire } = HeaderWrapper.instance();
    expect(isTokenExpire).toBeTruthy();
  });

  it('isTokenExpire - token is not a valid payload', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const { isTokenExpire } = HeaderWrapper.instance();
    storage.setItem('token', 'not_a_valid_token');
    expect(isTokenExpire).toBeTruthy();
  });

  it('isTokenExpire - token should not expire in 24 hrs range', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    storage.setItem('token', generateTokenWithTimeRange(24));
    expect(HeaderWrapper.instance().isTokenExpire).toBeFalsy();
    storage.removeItem('token');
  });

  it('isTokenExpire - token should expire for present', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    storage.setItem('token', generateTokenWithTimeRange());
    expect(HeaderWrapper.instance().isTokenExpire).toBeTruthy();
    storage.removeItem('token');
  });

  it('isTokenExpire - token expiration is not available', () => {
    const generateTokenWithOutExpiration = () => {
      const payload = {
        username: 'verdaccio'
      }
      return `xxxxxx.${Base64.encode(JSON.stringify(payload))}.xxxxxx`;
    }
    const HeaderWrapper = wrapper.find(Header).dive();
    storage.setItem('token', generateTokenWithOutExpiration());
    expect(HeaderWrapper.instance().isTokenExpire).toBeTruthy();
    storage.removeItem('token');
  })

  it('isTokenExpire - token expiration is not a number', () => {
    const generateTokenWithExpirationAsString = () => {
      const payload = {
        username: 'verdaccio',
        exp: 'I am not a number'
      };
      return `xxxxxx.${Base64.encode(JSON.stringify(payload))}.xxxxxx`;
    };
    const HeaderWrapper = wrapper.find(Header).dive();
    storage.setItem('token', generateTokenWithExpirationAsString());
    expect(HeaderWrapper.instance().isTokenExpire).toBeTruthy();
    storage.removeItem('token');
  });

  it('isTokenExpire - token is not a valid json token', () => {
    const generateTokenWithExpirationAsString = () => {
      const payload = { username: 'verdaccio', exp: 'I am not a number' };
      return `xxxxxx.${Base64.encode(payload)}.xxxxxx`;
    };
    const result = [
      'Invalid token:',
      SyntaxError('Unexpected token o in JSON at position 1'),
      'xxxxxx.W29iamVjdCBPYmplY3Rd.xxxxxx'
    ]
    storage.setItem('token', generateTokenWithExpirationAsString());
    wrapper.find(Header).dive().isTokenExpire;
    expect(console.error).toBeCalledWith(...result);
    storage.removeItem('token');
  });

  it('handleLogout - should clear the local stoage', () => {
    const storageSpy = jest.spyOn(storage, 'clear');
    const locationSpy = jest.spyOn(window.location, 'reload');
    const HeaderWrapper = wrapper.find(Header).dive();
    const { handleLogout } = HeaderWrapper.instance();
    handleLogout();
    expect(storageSpy).toHaveBeenCalled();
    expect(locationSpy).toHaveBeenCalled()
  });
});


describe('<Header /> snapshot test', () => {
  it('shoud match snapshot', () => {
    const wrapper = mount(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('<Header /> snapshot for loggedin user', () => {
  beforeAll(() => {
    storage.setItem('token', generateTokenWithTimeRange(24));
    storage.setItem('username', 'verdaccio');
  })
  afterAll(() => {
    storage.removeItem('token');
  })
  it('should match snapshot', () => {
    const wrapper = mount(
      <BrowserRouter>
        <Header />
      </BrowserRouter>);
    expect(wrapper.html()).toMatchSnapshot();
  });
})
