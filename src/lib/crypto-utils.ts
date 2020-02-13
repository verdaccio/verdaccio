import { createDecipher, createCipher, createHash, pseudoRandomBytes, Hash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

import { JWTSignOptions, RemoteUser } from '@verdaccio/types';

export const defaultAlgorithm = 'aes192';
export const defaultTarballHashAlgorithm = 'sha1';

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

export function createTarballHash(): Hash {
  return createHash(defaultTarballHashAlgorithm);
}

/**
 * Express doesn't do ETAGS with requests <= 1024b
 * we use md5 here, it works well on 1k+ bytes, but sucks with fewer data
 * could improve performance using crc32 after benchmarks.
 * @param {Object} data
 * @return {String}
 */
export function stringToMD5(data: Buffer | string): string {
  return createHash('md5')
    .update(data)
    .digest('hex');
}

export function generateRandomHexString(length = 8): string {
  return pseudoRandomBytes(length).toString('hex');
}

export async function signPayload(payload: RemoteUser, secretOrPrivateKey: string, options: JWTSignOptions&{jwtid?:boolean}): Promise<string> {
  return new Promise(function(resolve, reject): Promise<string> {
    return jwt.sign(
      payload,
      secretOrPrivateKey,
      {
        notBefore: '1', // Make sure the time will not rollback :)
        ...options,
        ...(options.jwtid ? {jwtid: generateRandomUUID()} : {}), // replace jwtid boolean with unique UUID
      },
      (error, token) => (error ? reject(error) : resolve(token))
    );
  });
}

export function verifyPayload(token: string, secretOrPrivateKey: string, options?: {ignoreNotBefore: boolean}): RemoteUser {
  return jwt.verify(token, secretOrPrivateKey, options);
}

export function generateRandomUUID(a?: number | string): string {
  // https://gist.github.com/jed/982883
  return a           // if the placeholder was passed, return
    ? (              // a random number from 0 to 15
      Number(a) ^    // unless b is 8,
      randomBytes(1)[0]  // in which case
      % 16           // a random number from
      >> Number(a)/4 // 8 to 11
      ).toString(16) // in hexadecimal
    : (              // or otherwise a concatenated string:
      "" +           // make string
      1e7 +          // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 +         // -80000000 +
      -1e11          // -100000000000,
      ).replace(     // replacing
        /[018]/g,    // zeroes, ones, and eights with
        generateRandomUUID // random hex digits
      )
}

export function isUUID(token: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(token);
}