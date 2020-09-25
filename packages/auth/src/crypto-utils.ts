import { createDecipher, createCipher } from 'crypto';
import jwt from 'jsonwebtoken';

import { JWTSignOptions, RemoteUser } from '@verdaccio/types';

export const defaultAlgorithm = 'aes192';

export function aesEncrypt(buf: Buffer, secret: string): Buffer {
  // deprecated (it will be migrated in Verdaccio 5), it is a breaking change
  // https://nodejs.org/api/crypto.html#crypto_crypto_createcipher_algorithm_password_options
  // https://www.grainger.xyz/changing-from-cipher-to-cipheriv/
  const c = createCipher(defaultAlgorithm, secret);
  const b1 = c.update(buf);
  const b2 = c.final();
  return Buffer.concat([b1, b2]);
}

export function aesDecrypt(buf: Buffer, secret: string): Buffer {
  try {
    // deprecated (it will be migrated in Verdaccio 5), it is a breaking change
    // https://nodejs.org/api/crypto.html#crypto_crypto_createdecipher_algorithm_password_options
    // https://www.grainger.xyz/changing-from-cipher-to-cipheriv/
    const c = createDecipher(defaultAlgorithm, secret);
    const b1 = c.update(buf);
    const b2 = c.final();
    return Buffer.concat([b1, b2]);
  } catch (_) {
    return new Buffer(0);
  }
}

/**
 * Sign the payload and return JWT
 * https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
 * @param payload
 * @param secretOrPrivateKey
 * @param options
 */
export async function signPayload(
  payload: RemoteUser,
  secretOrPrivateKey: string,
  options: JWTSignOptions = {}
): Promise<string> {
  return new Promise(function (resolve, reject): Promise<string> {
    return jwt.sign(
      payload,
      secretOrPrivateKey,
      {
        // 1 === 1ms (one millisecond)
        notBefore: '1', // Make sure the time will not rollback :)
        ...options,
      },
      (error, token) => (error ? reject(error) : resolve(token))
    );
  });
}

export function verifyPayload(token: string, secretOrPrivateKey: string): RemoteUser {
  return jwt.verify(token, secretOrPrivateKey);
}
