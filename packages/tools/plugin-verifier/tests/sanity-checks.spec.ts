import { describe, expect, it, vi } from 'vitest';

import { authSanityCheck } from '../src/sanity-checks';

describe('auth registration contract', () => {
  const authenticate = () => {};

  it('accepts an auth plugin without optional registration methods', () => {
    expect(authSanityCheck({ authenticate })).toBe(true);
  });

  it.each(['adduser', 'add_user'])('accepts callback-based %s without invoking it', (method) => {
    const register = vi.fn((_user, _password, cb) => {
      queueMicrotask(() => cb(null, true));
    });
    expect(authSanityCheck({ authenticate, [method]: register })).toBe(true);
    expect(register).not.toHaveBeenCalled();
  });

  it.each(['adduser', 'add_user'])('rejects async %s, including bound functions', (method) => {
    const register = async () => {};
    expect(authSanityCheck({ authenticate, [method]: register })).toBe(false);
    expect(authSanityCheck({ authenticate, [method]: register.bind({}) })).toBe(false);
  });

  it('rejects a Promise used as the registration method', () => {
    expect(authSanityCheck({ authenticate, adduser: Promise.resolve() })).toBe(false);
  });
});
