/** Node.js Crypt(3) Library
  Inspired by (and intended to be compatible with) sendanor/crypt3
  see https://github.com/sendanor/node-crypt3
  The key difference is the removal of the dependency on the unix crypt(3) function
  which is not platform independent, and requires compilation. Instead, a pure
  javascript version is used.
*/

import crypto from 'crypto';

import crypt from 'unix-crypt-td-js';

export enum EncryptionMethod {
  md5 = 'md5',
  sha1 = 'sha1',
  crypt = 'crypt',
  blowfish = 'blowfish',
  sha256 = 'sha256',
  sha512 = 'sha512',
}

/**
 * Create salt
 * @param {EncryptionMethod} type The type of salt: md5, blowfish (only some linux
 * distros), sha256 or sha512. Default is sha512.
 * @returns {string} Generated salt string
 */
export function createSalt(type: EncryptionMethod = EncryptionMethod.crypt): string {
  switch (type) {
    case EncryptionMethod.crypt:
      // Legacy crypt salt with no prefix (only the first 2 bytes will be used).
      return crypto.randomBytes(2).toString('base64');

    case EncryptionMethod.md5:
      return '$1$' + crypto.randomBytes(10).toString('base64');

    case EncryptionMethod.blowfish:
      return '$2a$' + crypto.randomBytes(10).toString('base64');

    case EncryptionMethod.sha256:
      return '$5$' + crypto.randomBytes(10).toString('base64');

    case EncryptionMethod.sha512:
      return '$6$' + crypto.randomBytes(10).toString('base64');

    default:
      throw new TypeError(`Unknown salt type at crypt3.createSalt: ${type}`);
  }
}

/**
 * Crypt(3) password and data encryption.
 * @param {string} key user's typed password
 * @param {string} salt Optional salt, for example SHA-512 use "$6$salt$".
 * @returns {string} A generated hash in format $id$salt$encrypted
 * @see https://en.wikipedia.org/wiki/Crypt_(C)
 */

export default function crypt3(key: string, salt: string = createSalt()): string {
  return crypt(key, salt);
}
