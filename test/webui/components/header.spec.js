/**
 * Header component
 */
import React from 'react';
import { shallow, mount } from 'enzyme';
import Header from '../../../src/webui/src/components/Header';
import { BrowserRouter } from 'react-router-dom';
import storage from '../../../src/webui/utils/storage';

jest.mock('../../../src/webui/utils/api', () => ({
  get: require('./__mocks__/api').default.get,
  post: require('./__mocks__/api').default.post
}));

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
      loginError: null
    };
    const HeaderWrapper = wrapper.find(Header).dive();
    expect(HeaderWrapper.state()).toEqual(state);
  });

  it('should toggleLogin modal', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const toggleLoginModal = HeaderWrapper.instance().toggleLoginModal;

    expect(toggleLoginModal()).toBeUndefined();
    expect(HeaderWrapper.state('showLogin')).toBeTruthy();
  });

  it('should handleInput set state', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const handleInput = HeaderWrapper.instance().handleInput;

    expect(handleInput('username', 'xyz')).toBeUndefined();
    expect(HeaderWrapper.state('username')).toEqual('xyz');

    expect(handleInput('password', '1234')).toBeUndefined();
    expect(HeaderWrapper.state('password')).toEqual('1234');
  });

  it('handleSubmit - should give error for blank username and password', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const handleSubmit = HeaderWrapper.instance().handleSubmit;
    const error = {
      description: "Username or password can't be empty!",
      title: 'Unable to login',
      type: 'error'
    };
    expect(handleSubmit()).toBeDefined();
    expect(HeaderWrapper.state('loginError')).toEqual(error);
  });

  it('handleSubmit - should login successfully', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const handleSubmit = HeaderWrapper.instance().handleSubmit;

    HeaderWrapper.setState({ username: 'sam', password: '1234' });

    handleSubmit().then(() => {
      expect(storage.getItem('token')).toEqual('TEST_TOKEN');
      expect(storage.getItem('username')).toEqual('sam');
    });
  });

  it('handleSubmit - login should failed with 401', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const handleSubmit = HeaderWrapper.instance().handleSubmit;
    const error = {
      title: 'Unable to login',
      type: 'error',
      description: 'Unauthorized'
    };
    HeaderWrapper.setState({ username: 'sam', password: '12345' });

    handleSubmit().then(() => {
      expect(HeaderWrapper.state('loginError')).toEqual(error);
    });
  });

  it('handleSubmit - login should failed with when no data is sent', () => {
    const HeaderWrapper = wrapper.find(Header).dive();
    const handleSubmit = HeaderWrapper.instance().handleSubmit;
    const error = {
      title: 'Unable to login',
      type: 'error',
      description: "Username or password can't be empty!"
    };
    HeaderWrapper.setState({});

    handleSubmit().then(() => {
      expect(HeaderWrapper.state('loginError')).toEqual(error);
    });
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
