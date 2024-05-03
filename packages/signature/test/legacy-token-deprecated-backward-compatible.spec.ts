import {
  aesDecryptDeprecatedBackwardCompatible,
  aesEncryptDeprecatedBackwardCompatible,
  generateRandomSecretKeyDeprecated,
} from '../src';

describe('test deprecated crypto utils', () => {
  test('decrypt payload flow', () => {
    const secret = generateRandomSecretKeyDeprecated();
    const payload = 'juan:password';
    const token = aesEncryptDeprecatedBackwardCompatible(Buffer.from(payload), secret);
    const data = aesDecryptDeprecatedBackwardCompatible(token, secret);

    expect(data.toString()).toEqual(payload.toString());
  });

  test('crypt fails if secret is incorrect', () => {
    const payload = 'juan:password';
    expect(
      aesEncryptDeprecatedBackwardCompatible(Buffer.from(payload), 'fake_token').toString()
    ).not.toEqual(Buffer.from(payload));
  });
});
