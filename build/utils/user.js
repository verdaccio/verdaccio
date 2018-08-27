'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GRAVATAR_DEFAULT = undefined;
exports.generateGravatarUrl = generateGravatarUrl;

var _cryptoUtils = require('../lib/crypto-utils');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GRAVATAR_DEFAULT = exports.GRAVATAR_DEFAULT = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm';
/**
 * Generate gravatar url from email address
 */
function generateGravatarUrl(email = '') {
  let emailCopy = email;
  if (_lodash2.default.isString(email) && _lodash2.default.size(email) > 0) {
    emailCopy = email.trim().toLocaleLowerCase();
    const emailMD5 = (0, _cryptoUtils.stringToMD5)(emailCopy);
    return `https://www.gravatar.com/avatar/${emailMD5}`;
  }
  return GRAVATAR_DEFAULT;
}