// @flow

import {
  createDecipher,
  createCipher,
  createHash,
  pseudoRandomBytes,
} from 'crypto';
import jwt from 'jsonwebtoken';

import type {JWTSignOptions, RemoteUser} from '@verdaccio/types';

export const defaultAlgorithm = 'aes192';
export const defaultTarballHashAlgorithm = 'sha1';

export function aesEncrypt(buf: Buffer, secret: string): Buffer {
  const c = createCipher(defaultAlgorithm, secret);
  const b1 = c.update(buf);
  const b2 = c.final();
  return Buffer.concat([b1, b2]);
}


export function aesDecrypt(buf: Buffer, secret: string) {
  try {
    const c = createDecipher(defaultAlgorithm, secret);
    const b1 = c.update(buf);
    const b2 = c.final();
    return Buffer.concat([b1, b2]);
  } catch (_) {
    return new Buffer(0);
  }
}

export function createTarballHash() {
  return createHash(defaultTarballHashAlgorithm);
}

/**
 * Express doesn't do etags with requests <= 1024b
 * we use md5 here, it works well on 1k+ bytes, but sucks with fewer data
 * could improve performance using crc32 after benchmarks.
 * @param {Object} data
 * @return {String}
 */
export function stringToMD5(data: Buffer | string) {
  return createHash('md5').update(data).digest('hex');
}

export function generateRandomHexString(length: number = 8) {
  return pseudoRandomBytes(length).toString('hex');
}

export function signPayload(payload: RemoteUser, secretOrPrivateKey: string, options: JWTSignOptions) {
  return jwt.sign(payload, secretOrPrivateKey, {
    notBefore: '1000', // Make sure the time will not rollback :)
    ...options,
  });
}

export function verifyPayload(token: string, secretOrPrivateKey: string) {
  return jwt.verify(token, secretOrPrivateKey);
}
