import { describe, expect, test } from 'vitest';

import { isNodeVersionGreaterThan21 } from '@verdaccio/config';

import {
  aesDecryptDeprecated,
  aesEncryptDeprecated,
  generateRandomSecretKeyDeprecated,
} from '../src';

const itdescribe = (condition) => (condition ? describe : describe.skip);

itdescribe(isNodeVersionGreaterThan21() === false)('test deprecated crypto utils', () => {
  test('generateRandomSecretKeyDeprecated', () => {
    expect(generateRandomSecretKeyDeprecated()).toHaveLength(12);
  });

  test('decrypt payload flow', () => {
    const secret = '4b4512c6ce20';
    const payload = 'juan:password';
    const token = aesEncryptDeprecated(Buffer.from(payload), secret);

    expect(token.toString('base64')).toEqual('auizc1j3lSEd2wEB5CyGbQ==');
    const data = aesDecryptDeprecated(token, secret);

    expect(data.toString()).toEqual(payload.toString());
  });

  test('crypt fails if secret is incorrect', () => {
    const payload = 'juan:password';
    expect(aesEncryptDeprecated(Buffer.from(payload), 'fake_token').toString()).not.toEqual(
      Buffer.from(payload)
    );
  });
});
