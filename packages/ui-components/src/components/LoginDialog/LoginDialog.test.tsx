import React from 'react';
import { vi } from 'vitest';

import { api } from '../../';
import {
  act,
  cleanup,
  fireEvent,
  renderWith,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import LoginDialog from './LoginDialog';

describe('<LoginDialog /> component', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    cleanup();
  });

  test('should render the component in default state', () => {
    const props = {
      onClose: vi.fn(),
    };
    const { container } = renderWith(<LoginDialog onClose={props.onClose} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should load the component with the open prop', async () => {
    const props = {
      open: true,
      onClose: vi.fn(),
    };

    const { getByTestId } = renderWith(<LoginDialog onClose={props.onClose} open={props.open} />);

    const loginDialogHeading = await waitFor(() => getByTestId('login-dialog-form-login-button'));
    expect(loginDialogHeading).toBeTruthy();
  });

  test('onClose: should close the login modal', async () => {
    const props = {
      open: true,
      onClose: vi.fn(),
    };

    const { getByTestId } = renderWith(<LoginDialog onClose={props.onClose} open={props.open} />);

    const loginDialogButton = await waitFor(() => getByTestId('close-login-dialog-button'));
    expect(loginDialogButton).toBeTruthy();

    await act(() => {
      fireEvent.click(loginDialogButton, { open: false });
    });

    expect(props.onClose).toHaveBeenCalled();
  });

  test('setCredentials - should set username and password in state', async () => {
    const props = {
      open: true,
      onClose: vi.fn(),
    };

    vi.spyOn(api, 'request').mockImplementation(() =>
      Promise.resolve({
        username: 'xyz',
        token: 'djsadaskljd',
      })
    );

    await act(async () => {
      renderWith(<LoginDialog onClose={props.onClose} open={props.open} />);
    });

    const userNameInput = screen.getByPlaceholderText('form-placeholder.username');
    expect(userNameInput).toBeInTheDocument();

    fireEvent.focus(userNameInput);

    fireEvent.change(userNameInput, { target: { value: 'xyz' } });

    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');
    expect(passwordInput).toBeInTheDocument();
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
