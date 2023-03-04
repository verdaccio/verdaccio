import { Hash, createHash, pseudoRandomBytes, randomBytes } from 'crypto';

export const defaultTarballHashAlgorithm = 'sha1';

/**
 *
 * @returns
 */
export function createTarballHash(algorithm = defaultTarballHashAlgorithm): Hash {
  return createHash(algorithm);
}

/**
 * Express doesn't do ETAGS with requests <= 1024b
 * we use md5 here, it works well on 1k+ bytes, but with fewer data
 * could improve performance using crc32 after benchmarks.
 * @param {Object} data
 * @return {String}
 */
export function stringToMD5(data: Buffer | string): string {
  return createHash('md5').update(data).digest('hex');
}

/**
 *
 * @param length
 * @returns
 */
export function generateRandomHexString(length = 8): string {
  return pseudoRandomBytes(length).toString('hex');
}

export const TOKEN_VALID_LENGTH = 32;

/**
 * Generate a secret of 32 characters.
 */
export function generateRandomSecretKey(): string {
  return randomBytes(TOKEN_VALID_LENGTH).toString('base64').substring(0, TOKEN_VALID_LENGTH);
}
