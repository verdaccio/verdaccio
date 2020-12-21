import React from 'react';

import api from 'verdaccio-ui/utils/api';
import { render, waitFor, fireEvent } from 'verdaccio-ui/utils/test-react-testing-library';

import AppContext, { AppContextProps } from '../../AppContext';

import LoginDialog from './LoginDialog';

const appContextValue: AppContextProps = {
  scope: '',
  setUser: jest.fn(),
};

describe('<LoginDialog /> component', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  test('should render the component in default state', () => {
    const props = {
      onClose: jest.fn(),
    };
    const { container } = render(
      <AppContext.Provider value={appContextValue}>
        <LoginDialog onClose={props.onClose} />
      </AppContext.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should load the component with the open prop', async () => {
    const props = {
      open: true,
      onClose: jest.fn(),
    };

    const { getByTestId } = render(
      <AppContext.Provider value={appContextValue}>
        <LoginDialog onClose={props.onClose} open={props.open} />
      </AppContext.Provider>
    );

    const loginDialogHeading = await waitFor(() => getByTestId('login-dialog-form-login-button'));
    expect(loginDialogHeading).toBeTruthy();
  });

  test('onClose: should close the login modal', async () => {
    const props = {
      open: true,
      onClose: jest.fn(),
    };

    const { getByTestId } = render(
      <AppContext.Provider value={appContextValue}>
        <LoginDialog onClose={props.onClose} open={props.open} />
      </AppContext.Provider>
    );

    const loginDialogButton = await waitFor(() => getByTestId('close-login-dialog-button'));
    expect(loginDialogButton).toBeTruthy();

    fireEvent.click(loginDialogButton, { open: false });
    expect(props.onClose).toHaveBeenCalled();
  });

  // TODO
  test.skip('setCredentials - should set username and password in state', async () => {
    const props = {
      open: true,
      onClose: jest.fn(),
    };

    jest.spyOn(api, 'request').mockImplementation(() =>
      Promise.resolve({
        username: 'xyz',
        token: 'djsadaskljd',
      })
    );

    const { getByPlaceholderText, getByText } = render(
      <AppContext.Provider value={appContextValue}>
        <LoginDialog onClose={props.onClose} open={props.open} />
      </AppContext.Provider>
    );

    // TODO: the input's value is not being updated in the DOM
    const userNameInput = getByPlaceholderText('Your username');
    fireEvent.focus(userNameInput);
    fireEvent.change(userNameInput, { target: { value: 'xyz' } });

    // TODO: the input's value is not being updated in the DOM
    const passwordInput = getByPlaceholderText('Your strong password');
    fireEvent.focus(passwordInput);
    fireEvent.change(passwordInput, { target: { value: '1234' } });

    // TODO: submitting form does not work
    const signInButton = getByText('Sign in');
    fireEvent.click(signInButton);
  });

  test.todo('validateCredentials: should validate credentials');

  test.todo('submitCredentials: should submit credentials');
});
