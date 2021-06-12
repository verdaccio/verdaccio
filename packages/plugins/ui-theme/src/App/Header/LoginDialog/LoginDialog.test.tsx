import React from 'react';

import api from 'verdaccio-ui/providers/API/api';
import {
  render,
  waitFor,
  fireEvent,
  cleanup,
  screen,
  act,
} from 'verdaccio-ui/utils/test-react-testing-library';

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
    cleanup();
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

    act(() => {
      fireEvent.click(loginDialogButton, { open: false });
    });
    expect(props.onClose).toHaveBeenCalled();
  });

  test('setCredentials - should set username and password in state', async () => {
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

    render(
      <AppContext.Provider value={appContextValue}>
        <LoginDialog onClose={props.onClose} open={props.open} />
      </AppContext.Provider>
    );

    const userNameInput = screen.getByPlaceholderText('Your username');
    expect(userNameInput).toBeInTheDocument();

    fireEvent.focus(userNameInput);

    fireEvent.change(userNameInput, { target: { value: 'xyz' } });

    const passwordInput = screen.getByPlaceholderText('Your strong password');
    expect(userNameInput).toBeInTheDocument();
    fireEvent.focus(passwordInput);
    fireEvent.change(passwordInput, { target: { value: '1234' } });

    act(async () => {
      const signInButton = await screen.getByTestId('login-dialog-form-login-button');
      expect(signInButton).not.toBeDisabled();
      fireEvent.click(signInButton);
    });
  });

  test.todo('validateCredentials: should validate credentials');

  test.todo('submitCredentials: should submit credentials');
});
