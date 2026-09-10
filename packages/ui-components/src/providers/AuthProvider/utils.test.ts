import { afterEach, describe, expect, test, vi } from 'vitest';

import { clearAuth, saveAuth } from '../../store/storage';
import { generateInvalidToken, generateTokenWithTimeRange } from '../../utils/token-generate';
import { clearExpiredAuth, getDefaultUserState } from './utils';

describe('auth storage lifecycle', () => {
  afterEach(() => {
    clearAuth();
  });

  describe('getDefaultUserState', () => {
    test('should hydrate the session from a stored valid token', () => {
      const token = generateTokenWithTimeRange(24);
      saveAuth('jdoe', token);
      expect(getDefaultUserState()).toEqual({ username: 'jdoe', token });
    });

    test('should report logged out for an expired token', () => {
      saveAuth('jdoe', generateTokenWithTimeRange(0));
      expect(getDefaultUserState()).toEqual({ username: null, token: null });
    });

    test('should report logged out for a malformed token', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const token = generateInvalidToken();
      saveAuth('jdoe', token);
      expect(getDefaultUserState()).toEqual({ username: null, token: null });
      // the malformed token is reported but its value must not be logged
      expect(consoleError).toHaveBeenCalled();
      expect(JSON.stringify(consoleError.mock.calls)).not.toContain(token);
      consoleError.mockRestore();
    });

    test('should report logged out when nothing is stored', () => {
      expect(getDefaultUserState()).toEqual({ username: null, token: null });
    });
  });

  describe('clearExpiredAuth', () => {
    test('should drop an expired token from storage on boot', () => {
      // the api client attaches whatever is stored, so an expired token left
      // behind makes the server treat the user as anonymous while the header
      // still greets them
      saveAuth('jdoe', generateTokenWithTimeRange(0));
      clearExpiredAuth();
      expect(window.localStorage.getItem('token')).toBeNull();
      expect(window.localStorage.getItem('username')).toBeNull();
    });

    test('should keep a valid token untouched', () => {
      const token = generateTokenWithTimeRange(24);
      saveAuth('jdoe', token);
      clearExpiredAuth();
      expect(window.localStorage.getItem('token')).toBe(token);
      expect(window.localStorage.getItem('username')).toBe('jdoe');
    });

    test('should do nothing when storage is empty', () => {
      clearExpiredAuth();
      expect(window.localStorage.getItem('token')).toBeNull();
    });
  });
});
