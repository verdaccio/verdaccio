/** Node.js Crypt(3) Library

  Inspired by (and intended to be compatible with) sendanor/crypt3

  see https://github.com/sendanor/node-crypt3

  The key difference is the removal of the dependency on the unix crypt(3) function
  which is not platform independent, and requires compilation. Instead, a pure
  javascript version is used.

*/

var crypt = require('unix-crypt-td-js'),
  crypto = require('crypto');

function createSalt(type) {
  type = type || 'sha512';

  switch (type) {

    case 'md5':
      return '$1$' + crypto.randomBytes(10).toString('base64');

    case 'blowfish':
      return '$2a$' + crypto.randomBytes(10).toString('base64');

    case 'sha256':
      return '$5$' + crypto.randomBytes(10).toString('base64');

    case 'sha512':
      return '$6$' + crypto.randomBytes(10).toString('base64');

    default:
      throw new TypeError('Unknown salt type at crypt3.createSalt: ' + type);
  }

}

function crypt3(key, salt) {
  salt = salt || createSalt();
  return crypt(key, salt);
}

/** Crypt(3) password and data encryption.
 * @param {string} key user's typed password
 * @param {string} salt Optional salt, for example SHA-512 use "$6$salt$".
 * @returns {string} A generated hash in format $id$salt$encrypted
 * @see https://en.wikipedia.org/wiki/Crypt_(C)
 */
module.exports = crypt3;

/** Create salt
 * @param {string} type The type of salt: md5, blowfish (only some linux distros), sha256 or sha512. Default is sha512.
 * @returns {string} Generated salt string
 */
module.exports.createSalt = createSalt;
