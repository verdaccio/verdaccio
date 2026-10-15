import { HttpResponse, http } from 'msw';
import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { server } from '../../../vitest/server';
import { clearAuth, saveAuth } from '../../store/storage';
import {
  MemoryRouter,
  RouterRoute,
  Routes,
  act,
  cleanup,
  fireEvent,
  renderWith,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import { Route } from '../../utils';
import Header from '../Header/Header';
import ChangePassword from './ChangePassword';

const originalLocation = window.location;
const originalConfig = window.__VERDACCIO_BASENAME_UI_OPTIONS;
const reload = vi.fn();

function renderPasswordPage() {
  return renderWith(
    <MemoryRouter basename="/registry" initialEntries={[`/registry${Route.CHANGE_PASSWORD}`]}>
      <Routes>
        <RouterRoute
          element={
            <>
              <Header isPlainHeader={true} />
              <ChangePassword />
            </>
          }
          path={Route.CHANGE_PASSWORD}
        />
        <RouterRoute element={<h1>Registry home</h1>} path={Route.ROOT} />
      </Routes>
    </MemoryRouter>
  );
}

describe('change password session routing', () => {
  beforeEach(() => {
    clearAuth();
    reload.mockClear();
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      ...originalConfig,
      flags: { changePassword: true },
    };
    Object.defineProperty(window, 'location', {
      value: Object.assign(new URL('http://localhost:9000/registry/'), { reload }),
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    clearAuth();
    window.__VERDACCIO_BASENAME_UI_OPTIONS = originalConfig;
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
  });

  test('cancelling required sign-in stays inside the registry basename', () => {
    renderPasswordPage();
    fireEvent.click(screen.getByTestId('close-login-dialog-button'));

    expect(screen.getByRole('heading', { name: 'Registry home' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/security.changePassword.oldPassword/)).not.toBeInTheDocument();
  });

  test('sign-in at a prefixed URL reveals the form without navigating home', async () => {
    server.use(
      http.post('http://localhost:9000/-/verdaccio/sec/login', () =>
        HttpResponse.json({
          username: 'testuser',
          token: `header.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))}.signature`,
        })
      )
    );
    renderPasswordPage();
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
    expect(screen.queryByRole('heading', { name: 'Registry home' })).not.toBeInTheDocument();
  });

  test('expiry while editing removes the password form and requests sign-in', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-15T12:00:00Z'));
    saveAuth(
      'testuser',
      `header.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 31 }))}.signature`
    );
    renderPasswordPage();
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/security.changePassword.oldPassword/), {
        target: { value: 'private-old-password' },
      });
      fireEvent.change(screen.getByLabelText(/security.changePassword.newPassword/), {
        target: { value: 'private-new-password' },
      });
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(reload).toHaveBeenCalledOnce();
    expect(screen.getByText('security.changePassword.loginRequired')).toBeInTheDocument();
    expect(screen.queryByLabelText(/security.changePassword.oldPassword/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/security.changePassword.newPassword/)).not.toBeInTheDocument();
  });
});
