import {
  aesDecryptDeprecated,
  aesEncryptDeprecated,
  generateRandomSecretKeyDeprecated,
} from '../src';

describe('test deprecated crypto utils', () => {
  test('decrypt payload flow', () => {
    const secret = generateRandomSecretKeyDeprecated();
    const payload = 'juan:password';
    const token = aesEncryptDeprecated(Buffer.from(payload), secret);
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
