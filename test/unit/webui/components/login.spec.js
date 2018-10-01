/**
 * @prettier
 * @flow
 */

import React from 'react';
import { mount } from 'enzyme';

import LoginModal from '../../../../src/webui/components/Login';

const eventUsername = {
  target: {
    value: 'xyz',
  },
};

const eventPassword = {
  target: {
    value: '1234',
  },
};

const event = {
  preventDefault: jest.fn(),
};

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
        description: 'Error Description',
      },
      onCancel: () => {},
      onSubmit: () => {},
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
        description: 'Error Description',
      },
      onCancel: jest.fn(),
      onSubmit: () => {},
    };
    const wrapper = mount(<LoginModal {...props} />);
    wrapper.find('button[id="login--form-cancel"]').simulate('click');
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('setCredentials - should set username and password in state', () => {
    const props = {
      visibility: true,
      error: {},
      onCancel: () => {},
      onSubmit: () => {},
    };
    const wrapper = mount(<LoginModal {...props} />);
    const { setCredentials } = wrapper.instance();

    expect(setCredentials('username', eventUsername)).toBeUndefined();
    expect(wrapper.state('form').username.value).toEqual('xyz');

    expect(setCredentials('password', eventPassword)).toBeUndefined();
    expect(wrapper.state('form').password.value).toEqual('1234');
  });

  it('validateCredentials: should validate credentials', async () => {
    const props = {
      visibility: true,
      error: {},
      onCancel: () => {},
      onSubmit: jest.fn(),
    };

    const wrapper = mount(<LoginModal {...props} />);
    const instance = wrapper.instance();

    instance.submitCredentials = jest.fn();
    const { validateCredentials, setCredentials, submitCredentials } = instance;

    expect(setCredentials('username', eventUsername)).toBeUndefined();
    expect(wrapper.state('form').username.value).toEqual('xyz');

    expect(setCredentials('password', eventPassword)).toBeUndefined();
    expect(wrapper.state('form').password.value).toEqual('1234');

    validateCredentials(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(wrapper.state('form').username.pristine).toEqual(false);
    expect(wrapper.state('form').password.pristine).toEqual(false);

    expect(submitCredentials).toHaveBeenCalledTimes(1);
  });

  it('submitCredentials: should submit credentials', async () => {
    const props = {
      onSubmit: jest.fn(),
    };

    const wrapper = mount(<LoginModal {...props} />);
    const { setCredentials, submitCredentials } = wrapper.instance();
    expect(setCredentials('username', eventUsername)).toBeUndefined();
    expect(wrapper.state('form').username.value).toEqual('xyz');

    expect(setCredentials('password', eventPassword)).toBeUndefined();
    expect(wrapper.state('form').password.value).toEqual('1234');

    await submitCredentials();
    expect(props.onSubmit).toHaveBeenCalledWith('xyz', '1234');
    expect(wrapper.state('form').username.value).toEqual('');
    expect(wrapper.state('form').username.pristine).toEqual(true);
    expect(wrapper.state('form').password.value).toEqual('');
    expect(wrapper.state('form').password.pristine).toEqual(true);
  });
});
