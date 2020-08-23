"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSalt = createSalt;
exports.default = crypt3;

var _crypto = _interopRequireDefault(require("crypto"));

var _unixCryptTdJs = _interopRequireDefault(require("unix-crypt-td-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function createSalt(type = 'sha512') {
  switch (type) {
    case 'md5':
      return '$1$' + _crypto.default.randomBytes(10).toString('base64');

    case 'blowfish':
      return '$2a$' + _crypto.default.randomBytes(10).toString('base64');

    case 'sha256':
      return '$5$' + _crypto.default.randomBytes(10).toString('base64');

    case 'sha512':
      return '$6$' + _crypto.default.randomBytes(10).toString('base64');

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


function crypt3(key, salt = createSalt()) {
  return (0, _unixCryptTdJs.default)(key, salt);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jcnlwdDMudHMiXSwibmFtZXMiOlsiY3JlYXRlU2FsdCIsInR5cGUiLCJjcnlwdG8iLCJyYW5kb21CeXRlcyIsInRvU3RyaW5nIiwiVHlwZUVycm9yIiwiY3J5cHQzIiwia2V5Iiwic2FsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRQTs7QUFFQTs7OztBQVZBOzs7Ozs7OztBQVlBOzs7Ozs7QUFNTyxTQUFTQSxVQUFULENBQW9CQyxJQUFJLEdBQUcsUUFBM0IsRUFBNkM7QUFDbEQsVUFBUUEsSUFBUjtBQUNFLFNBQUssS0FBTDtBQUNFLGFBQU8sUUFBUUMsZ0JBQU9DLFdBQVAsQ0FBbUIsRUFBbkIsRUFBdUJDLFFBQXZCLENBQWdDLFFBQWhDLENBQWY7O0FBRUYsU0FBSyxVQUFMO0FBQ0UsYUFBTyxTQUFTRixnQkFBT0MsV0FBUCxDQUFtQixFQUFuQixFQUF1QkMsUUFBdkIsQ0FBZ0MsUUFBaEMsQ0FBaEI7O0FBRUYsU0FBSyxRQUFMO0FBQ0UsYUFBTyxRQUFRRixnQkFBT0MsV0FBUCxDQUFtQixFQUFuQixFQUF1QkMsUUFBdkIsQ0FBZ0MsUUFBaEMsQ0FBZjs7QUFFRixTQUFLLFFBQUw7QUFDRSxhQUFPLFFBQVFGLGdCQUFPQyxXQUFQLENBQW1CLEVBQW5CLEVBQXVCQyxRQUF2QixDQUFnQyxRQUFoQyxDQUFmOztBQUVGO0FBQ0UsWUFBTSxJQUFJQyxTQUFKLENBQWUsMkNBQTBDSixJQUFLLEVBQTlELENBQU47QUFkSjtBQWdCRDtBQUVEOzs7Ozs7Ozs7QUFRZSxTQUFTSyxNQUFULENBQWdCQyxHQUFoQixFQUE2QkMsSUFBWSxHQUFHUixVQUFVLEVBQXRELEVBQWtFO0FBQy9FLFNBQU8sNEJBQU1PLEdBQU4sRUFBV0MsSUFBWCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogTm9kZS5qcyBDcnlwdCgzKSBMaWJyYXJ5XG4gIEluc3BpcmVkIGJ5IChhbmQgaW50ZW5kZWQgdG8gYmUgY29tcGF0aWJsZSB3aXRoKSBzZW5kYW5vci9jcnlwdDNcbiAgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zZW5kYW5vci9ub2RlLWNyeXB0M1xuICBUaGUga2V5IGRpZmZlcmVuY2UgaXMgdGhlIHJlbW92YWwgb2YgdGhlIGRlcGVuZGVuY3kgb24gdGhlIHVuaXggY3J5cHQoMykgZnVuY3Rpb25cbiAgd2hpY2ggaXMgbm90IHBsYXRmb3JtIGluZGVwZW5kZW50LCBhbmQgcmVxdWlyZXMgY29tcGlsYXRpb24uIEluc3RlYWQsIGEgcHVyZVxuICBqYXZhc2NyaXB0IHZlcnNpb24gaXMgdXNlZC5cbiovXG5cbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuaW1wb3J0IGNyeXB0IGZyb20gJ3VuaXgtY3J5cHQtdGQtanMnO1xuXG4vKipcbiAqIENyZWF0ZSBzYWx0XG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBvZiBzYWx0OiBtZDUsIGJsb3dmaXNoIChvbmx5IHNvbWUgbGludXhcbiAqIGRpc3Ryb3MpLCBzaGEyNTYgb3Igc2hhNTEyLiBEZWZhdWx0IGlzIHNoYTUxMi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBzYWx0IHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2FsdCh0eXBlID0gJ3NoYTUxMicpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdtZDUnOlxuICAgICAgcmV0dXJuICckMSQnICsgY3J5cHRvLnJhbmRvbUJ5dGVzKDEwKS50b1N0cmluZygnYmFzZTY0Jyk7XG5cbiAgICBjYXNlICdibG93ZmlzaCc6XG4gICAgICByZXR1cm4gJyQyYSQnICsgY3J5cHRvLnJhbmRvbUJ5dGVzKDEwKS50b1N0cmluZygnYmFzZTY0Jyk7XG5cbiAgICBjYXNlICdzaGEyNTYnOlxuICAgICAgcmV0dXJuICckNSQnICsgY3J5cHRvLnJhbmRvbUJ5dGVzKDEwKS50b1N0cmluZygnYmFzZTY0Jyk7XG5cbiAgICBjYXNlICdzaGE1MTInOlxuICAgICAgcmV0dXJuICckNiQnICsgY3J5cHRvLnJhbmRvbUJ5dGVzKDEwKS50b1N0cmluZygnYmFzZTY0Jyk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5rbm93biBzYWx0IHR5cGUgYXQgY3J5cHQzLmNyZWF0ZVNhbHQ6ICR7dHlwZX1gKTtcbiAgfVxufVxuXG4vKipcbiAqIENyeXB0KDMpIHBhc3N3b3JkIGFuZCBkYXRhIGVuY3J5cHRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IHVzZXIncyB0eXBlZCBwYXNzd29yZFxuICogQHBhcmFtIHtzdHJpbmd9IHNhbHQgT3B0aW9uYWwgc2FsdCwgZm9yIGV4YW1wbGUgU0hBLTUxMiB1c2UgXCIkNiRzYWx0JFwiLlxuICogQHJldHVybnMge3N0cmluZ30gQSBnZW5lcmF0ZWQgaGFzaCBpbiBmb3JtYXQgJGlkJHNhbHQkZW5jcnlwdGVkXG4gKiBAc2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NyeXB0XyhDKVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyeXB0MyhrZXk6IHN0cmluZywgc2FsdDogc3RyaW5nID0gY3JlYXRlU2FsdCgpKTogc3RyaW5nIHtcbiAgcmV0dXJuIGNyeXB0KGtleSwgc2FsdCk7XG59XG4iXX0=