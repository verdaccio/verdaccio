import React from 'react';
import { vi } from 'vitest';

import { mockAddUser } from '../../../vitest/msw-utils';
import { server } from '../../../vitest/server';
import {
  act,
  cleanup,
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import { Route } from '../../utils';
import AddUser from './AddUser';

const mockNavigate = vi.fn();

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('<AddUser /> component', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    mockNavigate.mockClear();
    cleanup();
  });

  afterEach(() => {
    // @ts-ignore
    delete window.__VERDACCIO_BASENAME_UI_OPTIONS.flags;
  });

  test('should redirect to home when createUser flag is disabled', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { createUser: false },
    };

    await act(async () => {
      renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(screen.queryByText('security.addUser.title')).not.toBeInTheDocument();
  });

  test('should render the form when createUser flag is enabled', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { createUser: true },
    };

    await act(async () => {
      renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
    });

    expect(screen.getByText('security.addUser.title')).toBeInTheDocument();
  });

  test('should render username, password and email fields', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { createUser: true },
    };

    await act(async () => {
      renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
    });

    expect(screen.getByPlaceholderText('form-placeholder.username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('form-placeholder.password')).toBeInTheDocument();
    expect(screen.getByLabelText('security.addUser.email')).toBeInTheDocument();
  });

  test('submit button should be disabled when form is empty', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { createUser: true },
    };

    await act(async () => {
      renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
    });

    const submitButton = screen.getByRole('button', { name: 'security.addUser.submit' });
    expect(submitButton).toBeDisabled();
  });

  test('submit button should be enabled when form is valid', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { createUser: true },
    };

    await act(async () => {
      renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
    });

    const usernameInput = screen.getByPlaceholderText('form-placeholder.username');
    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');
    const emailInput = screen.getByLabelText('security.addUser.email');

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    });

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'security.addUser.submit' });
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('should show link to login page', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { createUser: true },
    };

    await act(async () => {
      renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
    });

    expect(screen.getByText('security.addUser.login')).toBeInTheDocument();
  });

  test('should show error message on failed submission', async () => {
    // Override the default handler with a 409 error response
    server.use(mockAddUser(409, { error: 'user already exists' }));

    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { createUser: true },
    };

    await act(async () => {
      renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
    });

    const usernameInput = screen.getByPlaceholderText('form-placeholder.username');
    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');
    const emailInput = screen.getByLabelText('security.addUser.email');

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    });

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'security.addUser.submit' });
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByRole('button', { name: 'security.addUser.submit' });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to create user')).toBeInTheDocument();
    });
  });
});
