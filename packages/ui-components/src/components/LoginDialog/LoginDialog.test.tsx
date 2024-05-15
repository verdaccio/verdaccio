import React from 'react';

import { api, store } from '../../';
import {
  act,
  cleanup,
  fireEvent,
  renderWithStore,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import LoginDialog from './LoginDialog';

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
    const { container } = renderWithStore(<LoginDialog onClose={props.onClose} />, store);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should load the component with the open prop', async () => {
    const props = {
      open: true,
      onClose: jest.fn(),
    };

    const { findByTestId } = renderWithStore(
      <LoginDialog onClose={props.onClose} open={props.open} />,
      store
    );

    const loginDialogHeading = await waitFor(() => findByTestId('login-dialog-form-login-button'));
    expect(loginDialogHeading).toBeTruthy();
  });

  test('onClose: should close the login modal', async () => {
    const props = {
      open: true,
      onClose: jest.fn(),
    };

    const { findByTestId } = renderWithStore(
      <LoginDialog onClose={props.onClose} open={props.open} />,
      store
    );

    const loginDialogButton = await waitFor(() => findByTestId('close-login-dialog-button'));
    expect(loginDialogButton).toBeTruthy();

    await act(() => {
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

    await act(async () => {
      renderWithStore(<LoginDialog onClose={props.onClose} open={props.open} />, store);
    });

    const userNameInput = screen.getByPlaceholderText('form-placeholder.username');
    expect(userNameInput).toBeInTheDocument();

    fireEvent.focus(userNameInput);

    fireEvent.change(userNameInput, { target: { value: 'xyz' } });

    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');
    expect(userNameInput).toBeInTheDocument();
    fireEvent.focus(passwordInput);

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: '1234' } });
    });
    const signInButton = screen.getByTestId('login-dialog-form-login-button');
    expect(signInButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(signInButton);
    });
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  test.todo('validateCredentials: should validate credentials');

  test.todo('submitCredentials: should submit credentials');
});
