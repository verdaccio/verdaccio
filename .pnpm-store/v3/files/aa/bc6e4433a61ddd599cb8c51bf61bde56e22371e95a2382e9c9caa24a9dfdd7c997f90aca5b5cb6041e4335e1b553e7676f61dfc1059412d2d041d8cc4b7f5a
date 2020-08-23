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
function createSalt(type = 'crypt') {
  switch (type) {
    case 'crypt':
      // Legacy crypt salt with no prefix (only the first 2 bytes will be used).
      return _crypto.default.randomBytes(2).toString('base64');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jcnlwdDMudHMiXSwibmFtZXMiOlsiY3JlYXRlU2FsdCIsInR5cGUiLCJjcnlwdG8iLCJyYW5kb21CeXRlcyIsInRvU3RyaW5nIiwiVHlwZUVycm9yIiwiY3J5cHQzIiwia2V5Iiwic2FsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRQTs7QUFFQTs7OztBQVZBOzs7Ozs7OztBQVlBOzs7Ozs7QUFNTyxTQUFTQSxVQUFULENBQW9CQyxJQUFJLEdBQUcsT0FBM0IsRUFBNEM7QUFDakQsVUFBUUEsSUFBUjtBQUNFLFNBQUssT0FBTDtBQUNFO0FBQ0EsYUFBT0MsZ0JBQU9DLFdBQVAsQ0FBbUIsQ0FBbkIsRUFBc0JDLFFBQXRCLENBQStCLFFBQS9CLENBQVA7O0FBRUYsU0FBSyxLQUFMO0FBQ0UsYUFBTyxRQUFRRixnQkFBT0MsV0FBUCxDQUFtQixFQUFuQixFQUF1QkMsUUFBdkIsQ0FBZ0MsUUFBaEMsQ0FBZjs7QUFFRixTQUFLLFVBQUw7QUFDRSxhQUFPLFNBQVNGLGdCQUFPQyxXQUFQLENBQW1CLEVBQW5CLEVBQXVCQyxRQUF2QixDQUFnQyxRQUFoQyxDQUFoQjs7QUFFRixTQUFLLFFBQUw7QUFDRSxhQUFPLFFBQVFGLGdCQUFPQyxXQUFQLENBQW1CLEVBQW5CLEVBQXVCQyxRQUF2QixDQUFnQyxRQUFoQyxDQUFmOztBQUVGLFNBQUssUUFBTDtBQUNFLGFBQU8sUUFBUUYsZ0JBQU9DLFdBQVAsQ0FBbUIsRUFBbkIsRUFBdUJDLFFBQXZCLENBQWdDLFFBQWhDLENBQWY7O0FBRUY7QUFDRSxZQUFNLElBQUlDLFNBQUosQ0FBZSwyQ0FBMENKLElBQUssRUFBOUQsQ0FBTjtBQWxCSjtBQW9CRDtBQUVEOzs7Ozs7Ozs7QUFRZSxTQUFTSyxNQUFULENBQWdCQyxHQUFoQixFQUE2QkMsSUFBWSxHQUFHUixVQUFVLEVBQXRELEVBQWtFO0FBQy9FLFNBQU8sNEJBQU1PLEdBQU4sRUFBV0MsSUFBWCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogTm9kZS5qcyBDcnlwdCgzKSBMaWJyYXJ5XG4gIEluc3BpcmVkIGJ5IChhbmQgaW50ZW5kZWQgdG8gYmUgY29tcGF0aWJsZSB3aXRoKSBzZW5kYW5vci9jcnlwdDNcbiAgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zZW5kYW5vci9ub2RlLWNyeXB0M1xuICBUaGUga2V5IGRpZmZlcmVuY2UgaXMgdGhlIHJlbW92YWwgb2YgdGhlIGRlcGVuZGVuY3kgb24gdGhlIHVuaXggY3J5cHQoMykgZnVuY3Rpb25cbiAgd2hpY2ggaXMgbm90IHBsYXRmb3JtIGluZGVwZW5kZW50LCBhbmQgcmVxdWlyZXMgY29tcGlsYXRpb24uIEluc3RlYWQsIGEgcHVyZVxuICBqYXZhc2NyaXB0IHZlcnNpb24gaXMgdXNlZC5cbiovXG5cbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuaW1wb3J0IGNyeXB0IGZyb20gJ3VuaXgtY3J5cHQtdGQtanMnO1xuXG4vKipcbiAqIENyZWF0ZSBzYWx0XG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBvZiBzYWx0OiBtZDUsIGJsb3dmaXNoIChvbmx5IHNvbWUgbGludXhcbiAqIGRpc3Ryb3MpLCBzaGEyNTYgb3Igc2hhNTEyLiBEZWZhdWx0IGlzIHNoYTUxMi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBzYWx0IHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2FsdCh0eXBlID0gJ2NyeXB0Jyk6IHN0cmluZyB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2NyeXB0JzpcbiAgICAgIC8vIExlZ2FjeSBjcnlwdCBzYWx0IHdpdGggbm8gcHJlZml4IChvbmx5IHRoZSBmaXJzdCAyIGJ5dGVzIHdpbGwgYmUgdXNlZCkuXG4gICAgICByZXR1cm4gY3J5cHRvLnJhbmRvbUJ5dGVzKDIpLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICAgIGNhc2UgJ21kNSc6XG4gICAgICByZXR1cm4gJyQxJCcgKyBjcnlwdG8ucmFuZG9tQnl0ZXMoMTApLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICAgIGNhc2UgJ2Jsb3dmaXNoJzpcbiAgICAgIHJldHVybiAnJDJhJCcgKyBjcnlwdG8ucmFuZG9tQnl0ZXMoMTApLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICAgIGNhc2UgJ3NoYTI1Nic6XG4gICAgICByZXR1cm4gJyQ1JCcgKyBjcnlwdG8ucmFuZG9tQnl0ZXMoMTApLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICAgIGNhc2UgJ3NoYTUxMic6XG4gICAgICByZXR1cm4gJyQ2JCcgKyBjcnlwdG8ucmFuZG9tQnl0ZXMoMTApLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbmtub3duIHNhbHQgdHlwZSBhdCBjcnlwdDMuY3JlYXRlU2FsdDogJHt0eXBlfWApO1xuICB9XG59XG5cbi8qKlxuICogQ3J5cHQoMykgcGFzc3dvcmQgYW5kIGRhdGEgZW5jcnlwdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdXNlcidzIHR5cGVkIHBhc3N3b3JkXG4gKiBAcGFyYW0ge3N0cmluZ30gc2FsdCBPcHRpb25hbCBzYWx0LCBmb3IgZXhhbXBsZSBTSEEtNTEyIHVzZSBcIiQ2JHNhbHQkXCIuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIGdlbmVyYXRlZCBoYXNoIGluIGZvcm1hdCAkaWQkc2FsdCRlbmNyeXB0ZWRcbiAqIEBzZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ3J5cHRfKEMpXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3J5cHQzKGtleTogc3RyaW5nLCBzYWx0OiBzdHJpbmcgPSBjcmVhdGVTYWx0KCkpOiBzdHJpbmcge1xuICByZXR1cm4gY3J5cHQoa2V5LCBzYWx0KTtcbn1cbiJdfQ==