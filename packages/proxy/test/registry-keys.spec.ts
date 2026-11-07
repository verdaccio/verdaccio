import { describe, expect, test } from 'vitest';

import { type RegistryKey, isRegistryKey } from '../src/registry-keys';

const key: RegistryKey = {
  expires: null,
  keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
  keytype: 'ecdsa-sha2-nistp256',
  scheme: 'ecdsa-sha2-nistp256',
  key: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==',
};

describe('isRegistryKey', () => {
  test('accepts the npm key shape with and without an expiry', () => {
    expect(isRegistryKey(key)).toBe(true);
    expect(isRegistryKey({ ...key, expires: '2027-01-01T00:00:00.000Z' })).toBe(true);
  });

  test('accepts extra fields', () => {
    expect(isRegistryKey({ ...key, extra: true })).toBe(true);
  });

  test.each([
    ['undefined', undefined],
    ['null', null],
    ['a string', 'SHA256:abc'],
    ['a number', 42],
    ['an array', [key]],
    ['an empty object', {}],
  ])('rejects %s', (_label, item) => {
    expect(isRegistryKey(item)).toBe(false);
  });

  test.each([
    ['missing keyid', { ...key, keyid: undefined }],
    ['empty keyid', { ...key, keyid: '' }],
    ['numeric keyid', { ...key, keyid: 42 }],
    ['missing key', { ...key, key: undefined }],
    ['non-string key', { ...key, key: Buffer.from('x') }],
    ['missing keytype', { ...key, keytype: undefined }],
    ['non-string keytype', { ...key, keytype: 1 }],
    ['missing scheme', { ...key, scheme: undefined }],
    ['non-string scheme', { ...key, scheme: {} }],
    ['missing expires', { ...key, expires: undefined }],
    ['numeric expires', { ...key, expires: 42 }],
    ['boolean expires', { ...key, expires: false }],
    ['object expires', { ...key, expires: new Date() }],
  ])('rejects an entry with %s', (_label, item) => {
    expect(isRegistryKey(item)).toBe(false);
  });
});
