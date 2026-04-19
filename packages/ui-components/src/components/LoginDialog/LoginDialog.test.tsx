import React from 'react';
import { vi } from 'vitest';

import storage from '../../store/storage';
import {
  act,
  cleanup,
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import LoginDialog from './LoginDialog';

describe('<LoginDialog /> component', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    cleanup();
    storage.removeItem('token');
    storage.removeItem('username');
  });

  test('should render the component in default state', () => {
    const props = {
      onClose: vi.fn(),
    };
    const { container } = renderWithRouter(<LoginDialog onClose={props.onClose} />, '/login', [
      '/login',
    ]);
    // Dialog is closed by default (open=false), so content is not visible
    expect(container.querySelector('[data-testid="dialogContentLogin"]')).toBeNull();
  });

  test('should load the component with the open prop', async () => {
    const props = {
      open: true,
      onClose: vi.fn(),
    };

    const { getByTestId } = renderWithRouter(
      <LoginDialog onClose={props.onClose} open={props.open} />,
      '/login',
      ['/login']
    );

    const loginDialogHeading = await waitFor(() => getByTestId('login-dialog-form-login-button'));
    expect(loginDialogHeading).toBeTruthy();
  });

  test('onClose: should close the login modal', async () => {
    const props = {
      open: true,
      onClose: vi.fn(),
    };

    const { getByTestId } = renderWithRouter(
      <LoginDialog onClose={props.onClose} open={props.open} />,
      '/login',
      ['/login']
    );

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

    await act(async () => {
      renderWithRouter(<LoginDialog onClose={props.onClose} open={props.open} />, '/login', [
        '/login',
      ]);
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

  test('should save auth token after successful login', async () => {
    const props = {
      open: true,
      onClose: vi.fn(),
    };

    await act(async () => {
      renderWithRouter(<LoginDialog onClose={props.onClose} open={props.open} />, '/login', [
        '/login',
      ]);
    });

    const usernameInput = screen.getByPlaceholderText('form-placeholder.username');
    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    });

    const signInButton = screen.getByTestId('login-dialog-form-login-button');
    await act(async () => {
      fireEvent.click(signInButton);
    });

    await waitFor(() => {
      expect(storage.getItem('token')).toBe('valid-mock-token');
      expect(storage.getItem('username')).toBe('testuser');
    });
  });

  test.todo('validateCredentials: should validate credentials');

  test.todo('submitCredentials: should submit credentials');
});
