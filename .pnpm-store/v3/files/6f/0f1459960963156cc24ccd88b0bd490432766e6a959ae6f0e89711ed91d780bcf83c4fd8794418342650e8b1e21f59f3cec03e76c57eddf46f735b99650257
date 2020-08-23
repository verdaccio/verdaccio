/** Node.js Crypt(3) Library
  Inspired by (and intended to be compatible with) sendanor/crypt3
  see https://github.com/sendanor/node-crypt3
  The key difference is the removal of the dependency on the unix crypt(3) function
  which is not platform independent, and requires compilation. Instead, a pure
  javascript version is used.
*/
/**
 * Create salt
 * @param {string} type The type of salt: md5, blowfish (only some linux
 * distros), sha256 or sha512. Default is sha512.
 * @returns {string} Generated salt string
 */
export declare function createSalt(type?: string): string;
/**
 * Crypt(3) password and data encryption.
 * @param {string} key user's typed password
 * @param {string} salt Optional salt, for example SHA-512 use "$6$salt$".
 * @returns {string} A generated hash in format $id$salt$encrypted
 * @see https://en.wikipedia.org/wiki/Crypt_(C)
 */
export default function crypt3(key: string, salt?: string): string;
