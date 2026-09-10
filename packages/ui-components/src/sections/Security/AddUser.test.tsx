import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

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

  test('should create the user against the signup endpoint and navigate to success', async () => {
    // the default mockAddUser handler rejects any request that is not a
    // PUT /-/verdaccio/sec/signup carrying a 36-char sessionId, so reaching
    // the success page proves the form matches the server contract
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { createUser: true },
    };

    await act(async () => {
      renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('form-placeholder.username'), {
        target: { value: 'newuser' },
      });
      fireEvent.change(screen.getByPlaceholderText('form-placeholder.password'), {
        target: { value: 'testpass' },
      });
      fireEvent.change(screen.getByLabelText('security.addUser.email'), {
        target: { value: 'new@example.com' },
      });
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'security.addUser.submit' })).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'security.addUser.submit' }));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining(Route.SUCCESS));
    });
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
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
      // the server's own message is surfaced instead of a hardcoded generic one
      expect(screen.getByText('user already exists')).toBeInTheDocument();
    });
  });

  describe('hostile input and failure modes', () => {
    const enableCreateUser = () => {
      window.__VERDACCIO_BASENAME_UI_OPTIONS = {
        ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
        flags: { createUser: true },
      };
    };

    const fillForm = async (
      username = 'newuser',
      password = 'testpass',
      email = 'new@example.com'
    ) => {
      await act(async () => {
        fireEvent.change(screen.getByPlaceholderText('form-placeholder.username'), {
          target: { value: username },
        });
        fireEvent.change(screen.getByPlaceholderText('form-placeholder.password'), {
          target: { value: password },
        });
        fireEvent.change(screen.getByLabelText('security.addUser.email'), {
          target: { value: email },
        });
      });
    };

    const submitButton = () => screen.getByRole('button', { name: 'security.addUser.submit' });

    test('an invalid email shows a visible message instead of silently disabling submit', async () => {
      enableCreateUser();
      await act(async () => {
        renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
      });

      await fillForm('newuser', 'testpass', 'not-an-email');

      await waitFor(() => {
        expect(screen.getByText('form-validation.invalid-email')).toBeInTheDocument();
      });
      expect(submitButton()).toBeDisabled();
    });

    test('a username with spaces shows the url-safe message and blocks submit', async () => {
      enableCreateUser();
      await act(async () => {
        renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
      });

      await fillForm('user name', 'testpass', 'new@example.com');

      await waitFor(() => {
        expect(screen.getByText('security.error.username-must-be-url-safe')).toBeInTheDocument();
      });
      expect(submitButton()).toBeDisabled();
    });

    test('a network failure shows the translated fallback, not a fake conflict', async () => {
      server.use(
        http.put('http://localhost:9000/-/verdaccio/sec/signup', () => HttpResponse.error())
      );
      enableCreateUser();
      await act(async () => {
        renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
      });

      await fillForm();
      await waitFor(() => expect(submitButton()).not.toBeDisabled());
      await act(async () => {
        fireEvent.click(submitButton());
      });

      await waitFor(() => {
        expect(screen.getByText('security.error.unable-to-add-user')).toBeInTheDocument();
      });
      expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining(Route.SUCCESS));
    });

    test('double-clicking submit sends a single request', async () => {
      let requests = 0;
      server.use(
        http.put('http://localhost:9000/-/verdaccio/sec/signup', async () => {
          requests += 1;
          await delay(200);
          return HttpResponse.json({ username: 'newuser', token: 'valid-mock-token' });
        })
      );
      enableCreateUser();
      await act(async () => {
        renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
      });

      await fillForm();
      await waitFor(() => expect(submitButton()).not.toBeDisabled());

      await act(async () => {
        fireEvent.click(submitButton());
        fireEvent.click(submitButton());
        fireEvent.click(submitButton());
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining(Route.SUCCESS));
      });
      expect(requests).toBe(1);
    });

    test('a 2xx response without a token shows an error instead of a false success', async () => {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('username');
      server.use(
        http.put('http://localhost:9000/-/verdaccio/sec/signup', async ({ request }) => {
          const body = (await request.json()) as { sessionId?: string };
          if (typeof body.sessionId !== 'string' || body.sessionId.length !== 36) {
            return new HttpResponse(null, { status: 400 });
          }
          // the CLI web-login variant answers 202 with an empty body
          return HttpResponse.json({}, { status: 202 });
        })
      );
      enableCreateUser();
      await act(async () => {
        renderWithRouter(<AddUser />, Route.ADD_USER, [Route.ADD_USER]);
      });

      await fillForm();
      await waitFor(() => expect(submitButton()).not.toBeDisabled());
      await act(async () => {
        fireEvent.click(submitButton());
      });

      await waitFor(() => {
        expect(screen.getByText('security.error.unable-to-add-user')).toBeInTheDocument();
      });
      expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining(Route.SUCCESS));
      expect(window.localStorage.getItem('token')).toBeNull();
    });
  });
});
