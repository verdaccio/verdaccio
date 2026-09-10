import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

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
  });

  afterEach(() => {
    // @ts-ignore
    delete window.__VERDACCIO_BASENAME_UI_OPTIONS.flags;
  });

  test('should redirect to home when changePassword flag is disabled', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { changePassword: false },
    };

    await act(async () => {
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(screen.queryByText('security.changePassword.title')).not.toBeInTheDocument();
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

  test('should show error message on failed submission', async () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
      flags: { changePassword: true },
    };

    await act(async () => {
      renderWithRouter(<ChangePassword />, Route.CHANGE_PASSWORD, [Route.CHANGE_PASSWORD]);
    });

    // Use "fail" as old password to trigger mock error
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
      expect(screen.getByText('invalid credentials')).toBeInTheDocument();
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

    test('double-clicking submit sends a single request', async () => {
      let requests = 0;
      server.use(
        http.put('http://localhost:9000/-/verdaccio/sec/reset_password', async () => {
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
