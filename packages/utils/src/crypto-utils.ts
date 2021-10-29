import { Hash, createHash, pseudoRandomBytes } from 'crypto';

export const defaultTarballHashAlgorithm = 'sha1';

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
  return createHash('md5').update(data).digest('hex');
}

export function generateRandomHexString(length = 8): string {
  return pseudoRandomBytes(length).toString('hex');
}
