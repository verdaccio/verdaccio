import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { server } from '../../../vitest/server';
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

  describe('hostile input and failure modes', () => {
    const LOGIN_URL = 'http://localhost:9000/-/verdaccio/sec/login';

    const renderOpenDialog = async () => {
      const onClose = vi.fn();
      await act(async () => {
        renderWithRouter(<LoginDialog onClose={onClose} open={true} />, '/login', ['/login']);
      });
      return onClose;
    };

    const fillAndGetSubmit = async () => {
      await act(async () => {
        fireEvent.change(screen.getByPlaceholderText('form-placeholder.username'), {
          target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByPlaceholderText('form-placeholder.password'), {
          target: { value: 'testpass' },
        });
      });
      const button = screen.getByTestId('login-dialog-form-login-button');
      await waitFor(() => expect(button).not.toBeDisabled());
      return button;
    };

    test('a 500 shows the server message, never "invalid credentials"', async () => {
      server.use(
        http.post(LOGIN_URL, () => HttpResponse.json({ error: 'server exploded' }, { status: 500 }))
      );
      await renderOpenDialog();
      const button = await fillAndGetSubmit();

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(screen.getByText('server exploded')).toBeInTheDocument();
      });
      expect(screen.queryByText('security.error.invalid-credentials')).not.toBeInTheDocument();
      expect(storage.getItem('token')).toBeNull();
    });

    test('a 429 rate limit shows the server message, never "invalid credentials"', async () => {
      server.use(
        http.post(LOGIN_URL, () =>
          HttpResponse.json({ error: 'too many requests' }, { status: 429 })
        )
      );
      await renderOpenDialog();
      const button = await fillAndGetSubmit();

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(screen.getByText('too many requests')).toBeInTheDocument();
      });
      expect(screen.queryByText('security.error.invalid-credentials')).not.toBeInTheDocument();
    });

    test('a network failure shows the translated fallback', async () => {
      server.use(http.post(LOGIN_URL, () => HttpResponse.error()));
      await renderOpenDialog();
      const button = await fillAndGetSubmit();

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(screen.getByText('security.error.unable-to-login')).toBeInTheDocument();
      });
    });

    test('a 2xx with an unexpected body must not pass as a login', async () => {
      // a proxy or auth plugin answering html/garbage with status 200
      server.use(http.post(LOGIN_URL, () => HttpResponse.json({ hello: 'world' })));
      const onClose = await renderOpenDialog();
      const button = await fillAndGetSubmit();

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
      expect(storage.getItem('token')).toBeNull();
      expect(onClose).not.toHaveBeenCalled();
    });

    test('double-clicking the login button sends a single request', async () => {
      let requests = 0;
      server.use(
        http.post(LOGIN_URL, async () => {
          requests += 1;
          await delay(200);
          return HttpResponse.json({ username: 'testuser', token: 'valid-mock-token' });
        })
      );
      await renderOpenDialog();
      const button = await fillAndGetSubmit();

      await act(async () => {
        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(storage.getItem('token')).toBe('valid-mock-token');
      });
      expect(requests).toBe(1);
    });
  });

  test.todo('validateCredentials: should validate credentials');

  test.todo('submitCredentials: should submit credentials');
});
