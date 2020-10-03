export const DEFAULT_PORT = '4873';
export const DEFAULT_PROTOCOL = 'http';
export const DEFAULT_DOMAIN = 'localhost';
export const TIME_EXPIRATION_24H = '24h';
export const TIME_EXPIRATION_7D = '7d';
export const DIST_TAGS = 'dist-tags';
export const LATEST = 'latest';
export const USERS = 'users';
export const DEFAULT_MIN_LIMIT_PASSWORD = 3;
export const DEFAULT_USER = 'Anonymous';

export const keyPem = 'verdaccio-key.pem';
export const certPem = 'verdaccio-cert.pem';
export const csrPem = 'verdaccio-csr.pem';

export const HEADERS = {
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
  GZIP: 'gzip',
};

export const CHARACTER_ENCODING = {
  UTF8: 'utf8',
};

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
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
  LOOP_DETECTED: 508,
};

export const API_MESSAGE = {
  PKG_CREATED: 'created new package',
  PKG_CHANGED: 'package changed',
  PKG_REMOVED: 'package removed',
  PKG_PUBLISHED: 'package published',
  TARBALL_UPLOADED: 'tarball uploaded successfully',
  TARBALL_REMOVED: 'tarball removed',
  TAG_UPDATED: 'tags updated',
  TAG_REMOVED: 'tag removed',
  TAG_ADDED: 'package tagged',
  LOGGED_OUT: 'Logged out',
};

export const SUPPORT_ERRORS = {
  PLUGIN_MISSING_INTERFACE: 'the plugin does not provide implementation of the requested feature',
  TFA_DISABLED: 'the two-factor authentication is not yet supported',
  STORAGE_NOT_IMPLEMENT: 'the storage does not support token saving',
  PARAMETERS_NOT_VALID: 'the parameters are not valid',
};

export const API_ERROR = {
  PASSWORD_SHORT: (passLength: number = DEFAULT_MIN_LIMIT_PASSWORD) =>
    `The provided password is too short. Please pick a password longer than ${passLength} characters.`,
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
  UNSUPORTED_REGISTRY_CALL: 'unsupported registry call',
  BAD_STATUS_CODE: 'bad status code',
  PACKAGE_EXIST: 'this package is already present',
  BAD_AUTH_HEADER: 'bad authorization header',
  WEB_DISABLED: 'Web interface is disabled in the config file',
  DEPRECATED_BASIC_HEADER: 'basic authentication is disabled, please use Bearer tokens instead',
  BAD_FORMAT_USER_GROUP: 'user groups is different than an array',
  RESOURCE_UNAVAILABLE: 'resource unavailable',
  BAD_PACKAGE_DATA: 'bad incoming package data',
  USERNAME_PASSWORD_REQUIRED: 'username and password is required',
  USERNAME_ALREADY_REGISTERED: 'username is already registered',
};

export const APP_ERROR = {
  CONFIG_NOT_VALID: 'CONFIG: it does not look like a valid config file',
  PROFILE_ERROR: 'profile unexpected error',
  PASSWORD_VALIDATION: 'not valid password',
};

export const DEFAULT_NO_README = 'ERROR: No README data found!';
export const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

export const WEB_TITLE = 'Verdaccio';

export const PACKAGE_ACCESS = {
  SCOPE: '@*/*',
  ALL: '**',
};

export const STORAGE = {
  PACKAGE_FILE_NAME: 'package.json',
  FILE_EXIST_ERROR: 'EEXISTS',
  NO_SUCH_FILE_ERROR: 'ENOENT',
  DEFAULT_REVISION: '0-0000000000000000',
};

export const LOG_STATUS_MESSAGE =
  "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}'";
export const LOG_VERDACCIO_ERROR = `${LOG_STATUS_MESSAGE}, error: @{!error}`;
export const LOG_VERDACCIO_BYTES = `${LOG_STATUS_MESSAGE}, bytes: @{bytes.in}/@{bytes.out}`;
