import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { saveAuth } from '../../store/storage';
import { act, fireEvent, renderWithRouter, screen } from '../../test/test-react-testing-library';
import { generateTokenWithTimeRange } from '../../utils/token-generate';
import { useAuth } from './index';

const Probe: React.FC = () => {
  const { userState, logOutUser } = useAuth();
  return (
    <div>
      <div data-testid="state">{userState?.username ?? 'anonymous'}</div>
      <button data-testid="logout" onClick={() => logOutUser?.()} type="button" />
    </div>
  );
};

describe('<AuthProvider />', () => {
  beforeEach(() => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
    // the shared setup replaces window.location with a URL object, which has no reload
    (window.location as any).reload = vi.fn();
  });

  test('should hydrate the session from a valid stored token', async () => {
    saveAuth('jdoe', generateTokenWithTimeRange(24));
    await act(async () => {
      renderWithRouter(<Probe />, '/', ['/']);
    });
    expect(screen.getByTestId('state').textContent).toBe('jdoe');
  });

  test('should boot logged out and purge storage when the stored token expired', async () => {
    saveAuth('jdoe', generateTokenWithTimeRange(0));
    await act(async () => {
      renderWithRouter(<Probe />, '/', ['/']);
    });
    expect(screen.getByTestId('state').textContent).toBe('anonymous');
    // clearExpiredAuth on mount must also drop the stale token from storage
    expect(window.localStorage.getItem('token')).toBeNull();
  });

  test('logout must clear storage and state even with a still-valid token', async () => {
    saveAuth('jdoe', generateTokenWithTimeRange(24));
    await act(async () => {
      renderWithRouter(<Probe />, '/', ['/']);
    });
    expect(screen.getByTestId('state').textContent).toBe('jdoe');

    await act(async () => {
      fireEvent.click(screen.getByTestId('logout'));
    });

    // the old order read storage before clearing it, re-hydrating the session
    expect(window.localStorage.getItem('token')).toBeNull();
    expect(window.localStorage.getItem('username')).toBeNull();
    expect(screen.getByTestId('state').textContent).toBe('anonymous');
    expect((window.location as any).reload).toHaveBeenCalled();
  });
});
