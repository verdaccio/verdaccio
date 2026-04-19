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
import { Route } from '../../utils';
import Login from './Login';

// A valid `next` param: must start with Route.LOGIN_API and end with a UUID
const VALID_NEXT = '/-/v1/login_cli/12345678-1234-1234-1234-123456789abc';
const LOGIN_URL_WITH_NEXT = `${Route.LOGIN}?next=${encodeURIComponent(VALID_NEXT)}`;

describe('<Login /> component', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    cleanup();
    storage.removeItem('token');
    storage.removeItem('username');
  });

  afterEach(() => {
    // @ts-ignore
    delete window.__VERDACCIO_BASENAME_UI_OPTIONS.flags;
  });

  test('should render NotFound when next param is missing', async () => {
    await act(async () => {
      renderWithRouter(<Login />, Route.LOGIN, [Route.LOGIN]);
    });

    expect(screen.getByTestId('404')).toBeInTheDocument();
  });

  test('should render the login form when next param is valid', async () => {
    await act(async () => {
      renderWithRouter(<Login />, Route.LOGIN, [LOGIN_URL_WITH_NEXT]);
    });

    expect(screen.getByPlaceholderText('form-placeholder.username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('form-placeholder.password')).toBeInTheDocument();
  });

  test('should render login button disabled when form is empty', async () => {
    await act(async () => {
      renderWithRouter(<Login />, Route.LOGIN, [LOGIN_URL_WITH_NEXT]);
    });

    const submitButton = screen.getByTestId('login-dialog-form-login-button');
    expect(submitButton).toBeDisabled();
  });

  test('should enable login button when form is valid', async () => {
    await act(async () => {
      renderWithRouter(<Login />, Route.LOGIN, [LOGIN_URL_WITH_NEXT]);
    });

    const usernameInput = screen.getByPlaceholderText('form-placeholder.username');
    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    });

    await waitFor(() => {
      const submitButton = screen.getByTestId('login-dialog-form-login-button');
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('should show create user link when createUser flag is enabled', async () => {
    // Mutate the existing object since Login.tsx captures configuration at module level
    window.__VERDACCIO_BASENAME_UI_OPTIONS.flags = { createUser: true };

    await act(async () => {
      renderWithRouter(<Login />, Route.LOGIN, [LOGIN_URL_WITH_NEXT]);
    });

    expect(screen.getByText('security.login.createUser')).toBeInTheDocument();
  });

  test('should not show create user link when createUser flag is disabled', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.flags = { createUser: false };

    await act(async () => {
      renderWithRouter(<Login />, Route.LOGIN, [LOGIN_URL_WITH_NEXT]);
    });

    expect(screen.queryByText('security.login.createUser')).not.toBeInTheDocument();
  });

  test('should save auth token before navigating on successful login', async () => {
    await act(async () => {
      renderWithRouter(<Login />, Route.LOGIN, [LOGIN_URL_WITH_NEXT]);
    });

    const usernameInput = screen.getByPlaceholderText('form-placeholder.username');
    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('login-dialog-form-login-button')).not.toBeDisabled();
    });

    const submitButton = screen.getByTestId('login-dialog-form-login-button');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(storage.getItem('token')).toBe('valid-mock-token');
      expect(storage.getItem('username')).toBe('testuser');
    });
  });

  test('should show error message on failed login', async () => {
    await act(async () => {
      renderWithRouter(<Login />, Route.LOGIN, [LOGIN_URL_WITH_NEXT]);
    });

    const usernameInput = screen.getByPlaceholderText('form-placeholder.username');
    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');

    // Use "fail" username to trigger the mock error handler
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'fail' } });
      fireEvent.change(passwordInput, { target: { value: 'badpass' } });
    });

    await waitFor(() => {
      const submitButton = screen.getByTestId('login-dialog-form-login-button');
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByTestId('login-dialog-form-login-button');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });
});
