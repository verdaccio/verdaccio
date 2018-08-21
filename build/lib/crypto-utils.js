'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultAlgorithm = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.aesEncrypt = aesEncrypt;
exports.aesDecrypt = aesDecrypt;
exports.createTarballHash = createTarballHash;
exports.stringToMD5 = stringToMD5;
exports.generateRandomHexString = generateRandomHexString;
exports.signPayload = signPayload;
exports.verifyPayload = verifyPayload;

var _crypto = require('crypto');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultAlgorithm = exports.defaultAlgorithm = 'aes192';

function aesEncrypt(buf, secret) {
  const c = (0, _crypto.createCipher)(defaultAlgorithm, secret);
  const b1 = c.update(buf);
  const b2 = c.final();
  return Buffer.concat([b1, b2]);
}

function aesDecrypt(buf, secret) {
  try {
    const c = (0, _crypto.createDecipher)(defaultAlgorithm, secret);
    const b1 = c.update(buf);
    const b2 = c.final();
    return Buffer.concat([b1, b2]);
  } catch (_) {
    return new Buffer(0);
  }
}

function createTarballHash() {
  return (0, _crypto.createHash)('sha1');
}

/**
 * Express doesn't do etags with requests <= 1024b
 * we use md5 here, it works well on 1k+ bytes, but sucks with fewer data
 * could improve performance using crc32 after benchmarks.
 * @param {Object} data
 * @return {String}
 */
function stringToMD5(data) {
  return (0, _crypto.createHash)('md5').update(data).digest('hex');
}

function generateRandomHexString(length = 8) {
  return (0, _crypto.pseudoRandomBytes)(length).toString('hex');
}

function signPayload(payload, secret, options) {
  return _jsonwebtoken2.default.sign(payload, secret, _extends({
    notBefore: '1000' }, options));
}

function verifyPayload(token, secret) {
  return _jsonwebtoken2.default.verify(token, secret);
}