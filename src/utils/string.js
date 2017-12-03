// @flow
import crypto from 'crypto';

export function spliceURL(...args: Array<string>): string {
  return Array.from(args).reduce((lastResult, current) => lastResult + current).replace(/([^:])(\/)+(.)/g, `$1/$3`);
}

/**
 * Get MD5 from string
 */
export function stringToMD5(string: string): string {
  return crypto.createHash('md5').update(string).digest('hex');
}
