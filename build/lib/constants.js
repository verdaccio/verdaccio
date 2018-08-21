'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const DEFAULT_PORT = exports.DEFAULT_PORT = '4873';
const DEFAULT_DOMAIN = exports.DEFAULT_DOMAIN = 'localhost';

const HEADERS = exports.HEADERS = {
  JSON: 'application/json',
  JSON_CHARSET: 'application/json; charset=utf-8',
  OCTET_STREAM: 'application/octet-stream; charset=utf-8',
  TEXT_CHARSET: 'text/plain; charset=utf-8',
  GZIP: 'gzip'
};

const HEADER_TYPE = exports.HEADER_TYPE = {
  CONTENT_ENCODING: 'content-encoding',
  CONTENT_TYPE: 'content-type',
  CONTENT_LENGTH: 'content-length',
  ACCEPT_ENCODING: 'accept-encoding'
};

const ERROR_CODE = exports.ERROR_CODE = {
  token_required: 'token is required'
};

const TOKEN_BASIC = exports.TOKEN_BASIC = 'Basic';
const TOKEN_BEARER = exports.TOKEN_BEARER = 'Bearer';
const DEFAULT_REGISTRY = exports.DEFAULT_REGISTRY = 'https://registry.npmjs.org';
const DEFAULT_UPLINK = exports.DEFAULT_UPLINK = 'npmjs';

const ROLES = exports.ROLES = {
  $ALL: '$all',
  ALL: 'all',
  $AUTH: '$authenticated',
  $ANONYMOUS: '$anonymous',
  DEPRECATED_ALL: '@all',
  DEPRECATED_AUTH: '@authenticated',
  DEPRECATED_ANONUMOUS: '@anonymous'
};

const HTTP_STATUS = exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  MULTIPLE_CHOICES: 300,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNSUPORTED_MEDIA: 415,
  BAD_DATA: 422,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  LOOP_DETECTED: 508
};

const API_MESSAGE = exports.API_MESSAGE = {
  PKG_CREATED: 'created new package',
  PKG_CHANGED: 'package changed',
  PKG_REMOVED: 'package removed',
  PKG_PUBLISHED: 'package published',
  TARBALL_REMOVED: 'tarball removed',
  TAG_UPDATED: 'tags updated',
  TAG_REMOVED: 'tag removed',
  TAG_ADDED: 'package tagged'
};

const API_ERROR = exports.API_ERROR = {
  BAD_USERNAME_PASSWORD: 'bad username/password, access denied',
  NO_PACKAGE: 'no such package available',
  NOT_ALLOWED: 'not allowed to access package',
  INTERNAL_SERVER_ERROR: 'internal server error',
  UNKNOWN_ERROR: 'unknown error',
  NOT_PACKAGE_UPLINK: 'package does not exist on uplink',
  UPLINK_OFFLINE_PUBLISH: 'one of the uplinks is down, refuse to publish',
  UPLINK_OFFLINE: 'uplink is offline',
  CONTENT_MISMATCH: 'content length mismatch',
  NOT_FILE_UPLINK: 'file doesn\'t exist on uplink',
  MAX_USERS_REACHED: 'maximum amount of users reached',
  VERSION_NOT_EXIST: 'this version doesn\'t exist',
  FILE_NOT_FOUND: 'File not found',
  BAD_STATUS_CODE: 'bad status code',
  PACKAGE_EXIST: 'this package is already present',
  BAD_AUTH_HEADER: 'bad authorization header',
  WEB_DISABLED: 'Web interface is disabled in the config file',
  DEPRECATED_BASIC_HEADER: 'basic authentication is deprecated, please use JWT instead',
  BAD_FORMAT_USER_GROUP: 'user groups is different than an array',
  RESOURCE_UNAVAILABLE: 'resource unavailable'
};

const APP_ERROR = exports.APP_ERROR = {
  CONFIG_NOT_VALID: 'CONFIG: it does not look like a valid config file'
};

const DEFAULT_NO_README = exports.DEFAULT_NO_README = 'ERROR: No README data found!';
const MODULE_NOT_FOUND = exports.MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

const WEB_TITLE = exports.WEB_TITLE = 'Verdaccio';

const PACKAGE_ACCESS = exports.PACKAGE_ACCESS = {
  SCOPE: '@*/*',
  ALL: '**'
};