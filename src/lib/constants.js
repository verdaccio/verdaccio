// @flow

export const DEFAULT_PORT: string = '4873';
export const DEFAULT_PROTOCOL: string = 'http';
export const DEFAULT_DOMAIN: string = 'localhost';
export const TIME_EXPIRATION_24H: string ='24h';
export const TIME_EXPIRATION_7D: string = '7d';
export const DIST_TAGS = 'dist-tags';

export const keyPem = 'verdaccio-key.pem';
export const certPem = 'verdaccio-cert.pem';
export const csrPem = 'verdaccio-csr.pem';

export const HEADERS = {
  JSON: 'application/json',
  CONTENT_TYPE: 'Content-type',
  ETAG: 'ETag',
  JSON_CHARSET: 'application/json; charset=utf-8',
  OCTET_STREAM: 'application/octet-stream; charset=utf-8',
  TEXT_CHARSET: 'text/plain; charset=utf-8',
  WWW_AUTH: 'WWW-Authenticate',
  GZIP: 'gzip',
};

export const CHARACTER_ENCODING = {
  UTF8: 'utf8'
}

export const HEADER_TYPE = {
  CONTENT_ENCODING: 'content-encoding',
  CONTENT_TYPE: 'content-type',
  CONTENT_LENGTH: 'content-length',
  ACCEPT_ENCODING: 'accept-encoding',
};

export const ERROR_CODE = {
  token_required: 'token is required',
};

export const TOKEN_BASIC = 'Basic';
export const TOKEN_BEARER = 'Bearer';
export const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
export const DEFAULT_UPLINK = 'npmjs';

export const ROLES = {
  $ALL: '$all',
  ALL: 'all',
  $AUTH: '$authenticated',
  $ANONYMOUS: '$anonymous',
  DEPRECATED_ALL: '@all',
  DEPRECATED_AUTH: '@authenticated',
  DEPRECATED_ANONYMOUS: '@anonymous',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  MULTIPLE_CHOICES: 300,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNSUPPORTED_MEDIA: 415,
  BAD_DATA: 422,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  LOOP_DETECTED: 508,
};

export const API_MESSAGE = {
  PKG_CREATED: 'created new package',
  PKG_CHANGED: 'package changed',
  PKG_REMOVED: 'package removed',
  PKG_PUBLISHED: 'package published',
  TARBALL_REMOVED: 'tarball removed',
  TAG_UPDATED: 'tags updated',
  TAG_REMOVED: 'tag removed',
  TAG_ADDED: 'package tagged',
  LOGGED_OUT: 'Logged out',
};

export const API_ERROR = {
  PLUGIN_ERROR: 'bug in the auth plugin system',
  CONFIG_BAD_FORMAT: 'config file must be an object',
  BAD_USERNAME_PASSWORD: 'bad username/password, access denied',
  NO_PACKAGE: 'no such package available',
  BAD_DATA: 'bad data',
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
  RESOURCE_UNAVAILABLE: 'resource unavailable',
};

export const APP_ERROR = {
  CONFIG_NOT_VALID: 'CONFIG: it does not look like a valid config file',
};

export const DEFAULT_NO_README = 'ERROR: No README data found!';
export const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

export const WEB_TITLE = 'Verdaccio';

export const PACKAGE_ACCESS = {
  SCOPE: '@*/*',
  ALL: '**',
};

export const UPDATE_BANNER = {
  CHANGELOG_URL: 'https://github.com/verdaccio/verdaccio/releases/tag/'
}