import { afterEach, describe, expect, test } from 'vitest';

import { defaultSecurity } from '@verdaccio/config';

import { getSecurity } from '../../../../src/lib/auth-utils';

describe('getSecurity', () => {
  const originalExpires = defaultSecurity.web.sign.expiresIn;
  const originalLegacy = defaultSecurity.api.legacy;
  afterEach(() => {
    defaultSecurity.web.sign.expiresIn = originalExpires;
    defaultSecurity.api.legacy = originalLegacy;
  });

  test('returns defaults when config.security is nil', () => {
    const security = getSecurity({} as any);
    expect(security.web.sign.expiresIn).toBe(originalExpires);
    expect(security.api.legacy).toBe(originalLegacy);
  });

  test('merges config.security on top of defaults', () => {
    const security = getSecurity({
      security: { web: { sign: { expiresIn: '24h' } } },
    } as any);
    expect(security.web.sign.expiresIn).toBe('24h');
    expect(security.api.legacy).toBe(originalLegacy);
  });

  test('does not mutate the shared defaultSecurity', () => {
    getSecurity({
      security: { web: { sign: { expiresIn: '24h' } } },
    } as any);
    expect(defaultSecurity.web.sign.expiresIn).toBe(originalExpires);
  });

  test('returned object does not alias defaultSecurity', () => {
    const withConfig = getSecurity({
      security: { web: { sign: { expiresIn: '24h' } } },
    } as any);
    const withoutConfig = getSecurity({} as any);

    expect(withConfig).not.toBe(defaultSecurity);
    expect(withConfig.web).not.toBe(defaultSecurity.web);
    expect(withConfig.web.sign).not.toBe(defaultSecurity.web.sign);

    expect(withoutConfig).not.toBe(defaultSecurity);
    expect(withoutConfig.web).not.toBe(defaultSecurity.web);
  });

  test('successive calls do not leak state between configs', () => {
    getSecurity({
      security: { web: { sign: { expiresIn: '7d' } } },
    } as any);
    const laterCall = getSecurity({} as any);
    expect(laterCall.web.sign.expiresIn).toBe(originalExpires);
  });
});
