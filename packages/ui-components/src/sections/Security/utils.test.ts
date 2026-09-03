import { vi } from 'vitest';

import { getSecurityUrlParams, validateCredentials } from './utils';

const VALID_NEXT = '/-/v1/login_cli/12345678-1234-1234-1234-123456789abc';

describe('getSecurityUrlParams', () => {
  test('should accept a valid next parameter', () => {
    const { next } = getSecurityUrlParams({ search: `?next=${encodeURIComponent(VALID_NEXT)}` });
    expect(next).toBe(VALID_NEXT);
  });

  test('should reject a next parameter outside the login_cli namespace', () => {
    const { next } = getSecurityUrlParams({
      search: `?next=${encodeURIComponent('https://evil.example.com/phish')}`,
    });
    expect(next).toBe('');
  });

  test('should reject a next parameter without a trailing uuid', () => {
    const { next } = getSecurityUrlParams({
      search: `?next=${encodeURIComponent('/-/v1/login_cli/not-a-uuid')}`,
    });
    expect(next).toBe('');
  });

  test('should accept a well-formed user parameter', () => {
    const { user } = getSecurityUrlParams({ search: '?user=jdoe-42' });
    expect(user).toBe('jdoe-42');
  });

  test('should drop a user parameter with unexpected characters', () => {
    const { user } = getSecurityUrlParams({ search: '?user=<script>alert(1)</script>' });
    expect(user).toBe('');
  });

  test('should return empty values without query parameters', () => {
    expect(getSecurityUrlParams({ search: '' })).toEqual({ next: '', user: '' });
  });
});

describe('validateCredentials', () => {
  const t = (key: string) => key;

  test('should reject empty username or password', () => {
    const dispatch = vi.fn();
    expect(validateCredentials('', 'secret', t, dispatch)).toBe(false);
    expect(validateCredentials('jdoe', '', t, dispatch)).toBe(false);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'error',
      description: 'security.error.username-or-password-cant-be-empty',
    });
  });

  test('should reject a username shorter than the minimum length', () => {
    const dispatch = vi.fn();
    expect(validateCredentials('j', 'secret', t, dispatch)).toBe(false);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'error',
      description: 'security.error.username-min-length',
    });
  });

  test('should reject a username with characters that are not url-safe', () => {
    const dispatch = vi.fn();
    expect(validateCredentials('user name', 'secret', t, dispatch)).toBe(false);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'error',
      description: 'security.error.username-must-be-url-safe',
    });
  });

  test('should accept valid credentials without dispatching', () => {
    const dispatch = vi.fn();
    expect(validateCredentials("jdoe.!~*'()@", 'secret', t, dispatch)).toBe(true);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
