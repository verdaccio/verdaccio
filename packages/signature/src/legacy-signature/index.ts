import { createCipher, createDecipher } from 'crypto';

import { generateRandomHexString } from '../utils';

export const defaultAlgorithm = 'aes192';
export const defaultTarballHashAlgorithm = 'sha1';

/**
 *
 * @param buf
 * @param secret
 * @returns
 */
export function aesEncryptDeprecated(buf: Buffer, secret: string): Buffer {
  // deprecated (it will be removed in Verdaccio 6), it is a breaking change
  // https://nodejs.org/api/crypto.html#crypto_crypto_createcipher_algorithm_password_options
  // https://www.grainger.xyz/changing-from-cipher-to-cipheriv/
  const c = createCipher(defaultAlgorithm, secret);
  const b1 = c.update(buf);
  const b2 = c.final();
  return Buffer.concat([b1, b2]);
}

/**
 *
 * @param buf
 * @param secret
 * @returns
 */
export function aesDecryptDeprecated(buf: Buffer, secret: string): Buffer {
  try {
    // https://nodejs.org/api/crypto.html#crypto_crypto_createdecipher_algorithm_password_options
    // https://www.grainger.xyz/changing-from-cipher-to-cipheriv/
    const c = createDecipher(defaultAlgorithm, secret);
    const b1 = c.update(buf);
    const b2 = c.final();
    return Buffer.concat([b1, b2]);
  } catch (_) {
    return Buffer.alloc(0);
  }
}

export const TOKEN_VALID_LENGTH_DEPRECATED = 64;

/**
 * Generate a secret key of 64 characters.
 */
export function generateRandomSecretKeyDeprecated(): string {
  return generateRandomHexString(6);
}
