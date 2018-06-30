/**
 * Header component
 */
import React from 'react';
import { shallow, mount } from 'enzyme';
import Header from '../../../../src/webui/src/components/Header';
import { BrowserRouter } from 'react-router-dom';
import storage from '../../../../src/webui/utils/storage';

jest.mock('../../../../src/webui/utils/api', () => ({
  request: require('./__mocks__/api').default.request,
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
