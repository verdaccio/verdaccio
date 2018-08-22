import React from 'react';
import { mount } from 'enzyme';
import LoginModal from '../../../../src/webui/components/Login';

describe('<LoginModal />', () => {
  it('should load the component in default state', () => {
    const wrapper = mount(<LoginModal />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load the component with props', () => {
    const props = {
      visibility: true,
      error: {
        type: 'error',
        title: 'Error Title',
        description: 'Error Description'
      },
      onCancel: () => { },
      onSubmit: () => { }
    };
    const wrapper = mount(<LoginModal {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('onCancel: should close the login modal', () => {
    const props = {
      visibility: true,
      error: {
        type: 'error',
        title: 'Error Title',
        description: 'Error Description'
      },
      onCancel: jest.fn(),
      onSubmit: () => { }
    };
    const wrapper = mount(<LoginModal {...props} />);
    wrapper.find('.dialog-footer > .cancel-login-button').simulate('click');
    expect(props.onCancel).toHaveBeenCalled();
    wrapper.find('.dialog-footer > .login-button').simulate('click');
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('setCredentials - should set username and password in state', () => {
    const props = {
      visibility: true,
      error: {},
      onCancel: () => {},
      onSubmit: () => {}
    };
    const wrapper = mount(<LoginModal {...props} />);
    const { setCredentials } = wrapper.instance();

    const eventUsername = {
      target: {
        value: 'xyz'
      }
    }

    const eventPassword = {
      target: {
        value: '1234'
      }
    }
    expect(setCredentials('username', eventUsername)).toBeUndefined();
    expect(wrapper.state('username')).toEqual('xyz');

    expect(setCredentials('password', eventPassword)).toBeUndefined();
    expect(wrapper.state('password')).toEqual('1234');
  });

  it('submitCredential: should call the onSubmit', () => {
    const props = {
      visibility: true,
      error: {},
      onCancel: () => {},
      onSubmit: jest.fn()
    };

    const event = {
      preventDefault: jest.fn()
    };
    const wrapper = mount(<LoginModal {...props} />);
    const { submitCredentials } = wrapper.instance();
    wrapper.setState({ username: 'sam', password: 1234 })
    await submitCredentials(event);
    expect(props.onSubmit).toHaveBeenCalledWith('sam', 1234);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onSubmit).toHaveBeenCalledWith('sam', '1234');
  });
});
