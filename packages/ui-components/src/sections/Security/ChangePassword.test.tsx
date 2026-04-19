import React from 'react';
import { vi } from 'vitest';

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
      expect(screen.getByText('Failed to change password')).toBeInTheDocument();
    });
  });
});
