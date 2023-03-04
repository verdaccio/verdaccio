import { aesDecrypt, aesEncrypt } from '../src';

describe('test crypto utils', () => {
  test('decrypt payload flow', () => {
    const secret = 'f5bb945cc57fea2f25961e1bd6fb3c89';
    const payload = 'juan:password';
    const token = aesEncrypt(payload, secret) as string;
    const data = aesDecrypt(token, secret);

    expect(payload).toEqual(data);
  });

  test('crypt fails if secret is incorrect', () => {
    const secret = 'f5bb945cc57fea2f25961e1bd6fb3c89_TO_LONG';
    const payload = 'juan';
    const token = aesEncrypt(payload, secret) as string;
    expect(token).toBeUndefined();
  });
});
