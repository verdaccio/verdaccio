import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { server } from '../../../vitest/server';
import storage, { clearAuth, saveAuth } from '../../store/storage';
import {
  act,
  cleanup,
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import { Route } from '../../utils';
import ChangePassword from './ChangePassword';

const mockNavigate = vi.fn();

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('<ChangePassword /> component', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    mockNavigate.mockClear();
    cleanup();
    saveAuth(
      'testuser',
      `header.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))}.signature`
    );
  });

  afterEach(() => {
    clearAuth();
    // @ts-ignore
    delete window.__VERDACCIO_BASENAME_UI_OPTIONS.flags;
  });

  test.each([false, undefined])(
    'redirects home without offering login when the flag is %s',
    async (enabled) => {
      clearAuth();
      window.__VERDACCIO_BASENAME_UI_OPTIONS = {
        ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
        flags: { changePassword: enabled },
      };

      await act(async () => {
        renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText('security.changePassword.title')).not.toBeInTheDocument();
    }
  );

  test.each(['anonymous', 'expired', 'malformed'])(
    'requires sign-in for an %s session',
    async (session) => {
      clearAuth();
      if (session === 'expired') {
        saveAuth('testuser', `header.${btoa(JSON.stringify({ exp: 1 }))}.signature`);
      } else if (session === 'malformed') {
        saveAuth('testuser', 'not-a-jwt');
      }
      window.__VERDACCIO_BASENAME_UI_OPTIONS.flags = { changePassword: true };
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);

      expect(await screen.findByText('security.changePassword.loginRequired')).toBeInTheDocument();
      expect(
        screen.queryByLabelText(/security.changePassword.oldPassword/)
      ).not.toBeInTheDocument();
      expect(storage.getItem('token')).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    }
  );

  test('returns to the password form after signing in at the same URL', async () => {
    clearAuth();
    window.__VERDACCIO_BASENAME_UI_OPTIONS.flags = { changePassword: true };
    renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    fireEvent.change(screen.getByPlaceholderText('form-placeholder.username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('form-placeholder.password'), {
      target: { value: 'testpass' },
    });
    const submit = screen.getByTestId('login-dialog-form-login-button');
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);

    expect(await screen.findByLabelText(/security.changePassword.oldPassword/)).toBeInTheDocument();
    expect(screen.queryByText('security.changePassword.loginRequired')).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('failed sign-in keeps the password form hidden and allows retrying', async () => {
    clearAuth();
    server.use(
      http.post('http://localhost:9000/-/verdaccio/sec/login', () =>
        HttpResponse.json({ error: 'bad credentials' }, { status: 401 })
      )
    );
    window.__VERDACCIO_BASENAME_UI_OPTIONS.flags = { changePassword: true };
    renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    fireEvent.change(screen.getByPlaceholderText('form-placeholder.username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('form-placeholder.password'), {
      target: { value: 'wrongpass' },
    });
    const submit = screen.getByTestId('login-dialog-form-login-button');
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);

    expect(await screen.findByText('security.error.invalid-credentials')).toBeInTheDocument();
    expect(screen.queryByLabelText(/security.changePassword.oldPassword/)).not.toBeInTheDocument();
    expect(storage.getItem('token')).toBeNull();
    fireEvent.change(screen.getByPlaceholderText('form-placeholder.password'), {
      target: { value: 'corrected-password' },
    });
    await waitFor(() => expect(submit).not.toBeDisabled());
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('cancelling sign-in returns home without exposing the password form', async () => {
    clearAuth();
    window.__VERDACCIO_BASENAME_UI_OPTIONS.flags = { changePassword: true };
    renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    fireEvent.keyDown(await screen.findByRole('dialog'), { key: 'Escape', code: 'Escape' });
    expect(mockNavigate).toHaveBeenCalledWith(Route.ROOT);
    expect(screen.queryByLabelText(/security.changePassword.oldPassword/)).not.toBeInTheDocument();
  });

  test('should render the form when changePassword flag is enabled', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { changePassword: true },
    };

    await act(async () => {
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    });

    expect(screen.getByText('security.changePassword.title')).toBeInTheDocument();
  });

  test('should render all form fields', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { changePassword: true },
    };

    await act(async () => {
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    });

    expect(screen.getByLabelText(/security.changePassword.username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/security.changePassword.oldPassword/)).toBeInTheDocument();
    expect(screen.getByLabelText(/security.changePassword.newPassword/)).toBeInTheDocument();
    expect(screen.getByLabelText(/security.changePassword.confirmPassword/)).toBeInTheDocument();
  });

  test('submit button should be disabled when form is empty', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { changePassword: true },
    };

    await act(async () => {
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    });

    const submitButton = screen.getByRole('button', { name: 'security.changePassword.submit' });
    expect(submitButton).toBeDisabled();
  });

  test('submit button should be enabled when form is valid', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { changePassword: true },
    };

    await act(async () => {
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/security.changePassword.username/), {
        target: { value: 'testuser' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.oldPassword/), {
        target: { value: 'oldpass' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.newPassword/), {
        target: { value: 'newpass' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.confirmPassword/), {
        target: { value: 'newpass' },
      });
    });

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'security.changePassword.submit' });
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('submit button should stay disabled when passwords do not match', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { changePassword: true },
    };

    await act(async () => {
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/security.changePassword.username/), {
        target: { value: 'testuser' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.oldPassword/), {
        target: { value: 'oldpass' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.newPassword/), {
        target: { value: 'newpass' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.confirmPassword/), {
        target: { value: 'different' },
      });
    });

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'security.changePassword.submit' });
      expect(submitButton).toBeDisabled();
    });
  });

  test('should preserve the form and show the error on a non-session failure', async () => {
    server.use(
      http.put('http://localhost:9000/-/verdaccio/sec/reset_password', () =>
        HttpResponse.json({ error: 'password change failed' }, { status: 500 })
      )
    );
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { changePassword: true },
    };

    await act(async () => {
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/security.changePassword.username/), {
        target: { value: 'testuser' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.oldPassword/), {
        target: { value: 'fail' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.newPassword/), {
        target: { value: 'newpass' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.confirmPassword/), {
        target: { value: 'newpass' },
      });
    });

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'security.changePassword.submit' });
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByRole('button', { name: 'security.changePassword.submit' });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('password change failed')).toBeInTheDocument();
      expect(screen.getByLabelText(/security.changePassword.oldPassword/)).toBeInTheDocument();
    });
  });

  describe('hostile input and failure modes', () => {
    const enableFlag = () => {
      window.__VERDACCIO_BASENAME_UI_OPTIONS = {
        ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
        flags: { changePassword: true },
      };
    };

    const fillField = async (label: RegExp, value: string) => {
      await act(async () => {
        fireEvent.change(screen.getByLabelText(label), { target: { value } });
      });
    };

    test('a password mismatch shows a visible, translated message', async () => {
      enableFlag();
      await act(async () => {
        renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
      });

      await fillField(/security.changePassword.username/, 'testuser');
      await fillField(/security.changePassword.oldPassword/, 'oldpass');
      await fillField(/security.changePassword.newPassword/, 'newpass');
      await fillField(/security.changePassword.confirmPassword/, 'different');

      await waitFor(() => {
        expect(screen.getByText('security.error.password-mismatch')).toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: 'security.changePassword.submit' })).toBeDisabled();
    });

    test('a one-character password shows the min-length message', async () => {
      enableFlag();
      await act(async () => {
        renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
      });

      await fillField(/security.changePassword.newPassword/, 'x');

      await waitFor(() => {
        expect(screen.getByText('form-validation.required-min-length')).toBeInTheDocument();
      });
    });

    test('a rejected session clears credentials and the password fields before signing in again', async () => {
      server.use(
        http.put('http://localhost:9000/-/verdaccio/sec/reset_password', () =>
          HttpResponse.json({ message: 'session expired' }, { status: 401 })
        )
      );
      enableFlag();
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
      await fillField(/security.changePassword.username/, 'testuser');
      await fillField(/security.changePassword.oldPassword/, 'oldpass');
      await fillField(/security.changePassword.newPassword/, 'newpass');
      await fillField(/security.changePassword.confirmPassword/, 'newpass');
      const submit = screen.getByRole('button', { name: 'security.changePassword.submit' });
      await waitFor(() => expect(submit).not.toBeDisabled());
      fireEvent.click(submit);

      expect(await screen.findByText('security.changePassword.loginRequired')).toBeInTheDocument();
      expect(storage.getItem('token')).toBeNull();
      expect(storage.getItem('username')).toBeNull();
      expect(
        screen.queryByLabelText(/security.changePassword.oldPassword/)
      ).not.toBeInTheDocument();
      fireEvent.change(screen.getByPlaceholderText('form-placeholder.username'), {
        target: { value: 'testuser' },
      });
      fireEvent.change(screen.getByPlaceholderText('form-placeholder.password'), {
        target: { value: 'testpass' },
      });
      const login = screen.getByTestId('login-dialog-form-login-button');
      await waitFor(() => expect(login).not.toBeDisabled());
      fireEvent.click(login);
      expect(await screen.findByLabelText(/security.changePassword.oldPassword/)).toHaveValue('');
      expect(screen.getByLabelText(/security.changePassword.newPassword/)).toHaveValue('');
      expect(screen.getByLabelText(/security.changePassword.confirmPassword/)).toHaveValue('');
    });

    test('double-clicking submit sends a single request', async () => {
      let requests = 0;
      server.use(
        http.put('http://localhost:9000/-/verdaccio/sec/reset_password', async ({ request }) => {
          expect(request.headers.get('authorization')).toBe(`Bearer ${storage.getItem('token')}`);
          expect(await request.json()).toEqual({ password: { old: 'oldpass', new: 'newpass' } });
          requests += 1;
          await delay(200);
          return HttpResponse.json({ ok: 'password changed' });
        })
      );
      enableFlag();
      await act(async () => {
        renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
      });

      await fillField(/security.changePassword.username/, 'testuser');
      await fillField(/security.changePassword.oldPassword/, 'oldpass');
      await fillField(/security.changePassword.newPassword/, 'newpass');
      await fillField(/security.changePassword.confirmPassword/, 'newpass');

      const submitButton = screen.getByRole('button', { name: 'security.changePassword.submit' });
      await waitFor(() => expect(submitButton).not.toBeDisabled());

      await act(async () => {
        fireEvent.click(submitButton);
        fireEvent.click(submitButton);
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining(Route.SUCCESS));
      });
      expect(requests).toBe(1);
    });
  });
});
