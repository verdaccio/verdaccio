import { convertPayloadToBase64 } from '@verdaccio/utils';
import { aesDecrypt, aesEncrypt } from '../src/crypto-utils';

describe('test crypto utils', () => {
  describe('default encryption', () => {
    test('decrypt payload flow', () => {
      const payload = 'juan';
      const token = aesEncrypt(Buffer.from(payload), '12345').toString('base64');

      const data = aesDecrypt(convertPayloadToBase64(token), '12345').toString('utf8');

      expect(payload).toEqual(data);
    });
  });
});
