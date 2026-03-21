import type { Hash } from 'node:crypto';
import { createHash, randomBytes } from 'node:crypto';

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
  // @ts-ignore update method accepts Buffer or string
  return createHash('md5').update(data).digest('hex');
}

export function generateRandomHexString(length = 8): string {
  return randomBytes(length).toString('hex');
}

/**
 * return a masquerade string with its first and last {charNum} and three dots in between.
 * @param {String} str
 * @param {Number} charNum
 * @returns {String}
 */
export function mask(str: string, charNum = 3): string {
  return `${str.slice(0, charNum)}...${str.slice(-charNum)}`;
}
