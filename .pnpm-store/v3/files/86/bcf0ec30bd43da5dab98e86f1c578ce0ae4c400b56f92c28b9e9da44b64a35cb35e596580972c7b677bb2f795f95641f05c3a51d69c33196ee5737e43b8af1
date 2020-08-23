"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConflict = getConflict;
exports.getBadData = getBadData;
exports.getBadRequest = getBadRequest;
exports.getInternalError = getInternalError;
exports.getUnauthorized = getUnauthorized;
exports.getForbidden = getForbidden;
exports.getServiceUnavailable = getServiceUnavailable;
exports.getNotFound = getNotFound;
exports.getCode = getCode;
exports.API_ERROR = exports.API_MESSAGE = exports.HEADERS = exports.HTTP_STATUS = exports.DEFAULT_MIN_LIMIT_PASSWORD = void 0;

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _httpStatusCodes = _interopRequireDefault(require("http-status-codes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_MIN_LIMIT_PASSWORD = 3;
exports.DEFAULT_MIN_LIMIT_PASSWORD = DEFAULT_MIN_LIMIT_PASSWORD;
const HTTP_STATUS = {
  OK: _httpStatusCodes.default.OK,
  CREATED: _httpStatusCodes.default.CREATED,
  MULTIPLE_CHOICES: _httpStatusCodes.default.MULTIPLE_CHOICES,
  NOT_MODIFIED: _httpStatusCodes.default.NOT_MODIFIED,
  BAD_REQUEST: _httpStatusCodes.default.BAD_REQUEST,
  UNAUTHORIZED: _httpStatusCodes.default.UNAUTHORIZED,
  FORBIDDEN: _httpStatusCodes.default.FORBIDDEN,
  NOT_FOUND: _httpStatusCodes.default.NOT_FOUND,
  CONFLICT: _httpStatusCodes.default.CONFLICT,
  UNSUPPORTED_MEDIA: _httpStatusCodes.default.UNSUPPORTED_MEDIA_TYPE,
  BAD_DATA: _httpStatusCodes.default.UNPROCESSABLE_ENTITY,
  INTERNAL_ERROR: _httpStatusCodes.default.INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE: _httpStatusCodes.default.SERVICE_UNAVAILABLE,
  LOOP_DETECTED: 508
};
exports.HTTP_STATUS = HTTP_STATUS;
const HEADERS = {
  ACCEPT: 'Accept',
  ACCEPT_ENCODING: 'Accept-Encoding',
  USER_AGENT: 'User-Agent',
  JSON: 'application/json',
  CONTENT_TYPE: 'Content-type',
  CONTENT_LENGTH: 'content-length',
  TEXT_PLAIN: 'text/plain',
  TEXT_HTML: 'text/html',
  AUTHORIZATION: 'authorization',
  FORWARDED_PROTO: 'X-Forwarded-Proto',
  FRAMES_OPTIONS: 'X-Frame-Options',
  CSP: 'Content-Security-Policy',
  CTO: 'X-Content-Type-Options',
  XSS: 'X-XSS-Protection',
  ETAG: 'ETag',
  JSON_CHARSET: 'application/json; charset=utf-8',
  OCTET_STREAM: 'application/octet-stream; charset=utf-8',
  TEXT_CHARSET: 'text/plain; charset=utf-8',
  WWW_AUTH: 'WWW-Authenticate',
  GZIP: 'gzip'
};
exports.HEADERS = HEADERS;
const API_MESSAGE = {
  PKG_CREATED: 'created new package',
  PKG_CHANGED: 'package changed',
  PKG_REMOVED: 'package removed',
  PKG_PUBLISHED: 'package published',
  TARBALL_UPLOADED: 'tarball uploaded successfully',
  TARBALL_REMOVED: 'tarball removed',
  TAG_UPDATED: 'tags updated',
  TAG_REMOVED: 'tag removed',
  TAG_ADDED: 'package tagged',
  LOGGED_OUT: 'Logged out'
};
exports.API_MESSAGE = API_MESSAGE;
const API_ERROR = {
  PASSWORD_SHORT: (passLength = DEFAULT_MIN_LIMIT_PASSWORD) => `The provided password is too short. Please pick a password longer than ${passLength} characters.`,
  MUST_BE_LOGGED: 'You must be logged in to publish packages.',
  PLUGIN_ERROR: 'bug in the auth plugin system',
  CONFIG_BAD_FORMAT: 'config file must be an object',
  BAD_USERNAME_PASSWORD: 'bad username/password, access denied',
  NO_PACKAGE: 'no such package available',
  PACKAGE_CANNOT_BE_ADDED: 'this package cannot be added',
  BAD_DATA: 'bad data',
  NOT_ALLOWED: 'not allowed to access package',
  NOT_ALLOWED_PUBLISH: 'not allowed to publish package',
  INTERNAL_SERVER_ERROR: 'internal server error',
  UNKNOWN_ERROR: 'unknown error',
  NOT_PACKAGE_UPLINK: 'package does not exist on uplink',
  UPLINK_OFFLINE_PUBLISH: 'one of the uplinks is down, refuse to publish',
  UPLINK_OFFLINE: 'uplink is offline',
  CONTENT_MISMATCH: 'content length mismatch',
  NOT_FILE_UPLINK: "file doesn't exist on uplink",
  MAX_USERS_REACHED: 'maximum amount of users reached',
  VERSION_NOT_EXIST: "this version doesn't exist",
  FILE_NOT_FOUND: 'File not found',
  BAD_STATUS_CODE: 'bad status code',
  PACKAGE_EXIST: 'this package is already present',
  BAD_AUTH_HEADER: 'bad authorization header',
  WEB_DISABLED: 'Web interface is disabled in the config file',
  DEPRECATED_BASIC_HEADER: 'basic authentication is deprecated, please use JWT instead',
  BAD_FORMAT_USER_GROUP: 'user groups is different than an array',
  RESOURCE_UNAVAILABLE: 'resource unavailable',
  BAD_PACKAGE_DATA: 'bad incoming package data',
  USERNAME_PASSWORD_REQUIRED: 'username and password is required',
  USERNAME_ALREADY_REGISTERED: 'username is already registered'
};
exports.API_ERROR = API_ERROR;

function getError(code, message) {
  const httpError = (0, _httpErrors.default)(code, message);
  httpError.code = code;
  return httpError;
}

function getConflict(message = API_ERROR.PACKAGE_EXIST) {
  return getError(HTTP_STATUS.CONFLICT, message);
}

function getBadData(customMessage) {
  return getError(HTTP_STATUS.BAD_DATA, customMessage || API_ERROR.BAD_DATA);
}

function getBadRequest(customMessage) {
  return getError(HTTP_STATUS.BAD_REQUEST, customMessage);
}

function getInternalError(customMessage) {
  return customMessage ? getError(HTTP_STATUS.INTERNAL_ERROR, customMessage) : getError(HTTP_STATUS.INTERNAL_ERROR, API_ERROR.UNKNOWN_ERROR);
}

function getUnauthorized(message = 'no credentials provided') {
  return getError(HTTP_STATUS.UNAUTHORIZED, message);
}

function getForbidden(message = "can't use this filename") {
  return getError(HTTP_STATUS.FORBIDDEN, message);
}

function getServiceUnavailable(message = API_ERROR.RESOURCE_UNAVAILABLE) {
  return getError(HTTP_STATUS.SERVICE_UNAVAILABLE, message);
}

function getNotFound(customMessage) {
  return getError(HTTP_STATUS.NOT_FOUND, customMessage || API_ERROR.NO_PACKAGE);
}

function getCode(statusCode, customMessage) {
  return getError(statusCode, customMessage);
}