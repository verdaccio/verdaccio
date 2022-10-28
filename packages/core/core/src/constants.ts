import httpCodes from 'http-status-codes';

export const DEFAULT_PASSWORD_VALIDATION = /.{3}$/;
export const TIME_EXPIRATION_24H = '24h';
export const TIME_EXPIRATION_1H = '1h';
export const DIST_TAGS = 'dist-tags';
export const LATEST = 'latest';
export const USERS = 'users';
export const DEFAULT_USER = 'Anonymous';

export const HEADER_TYPE = {
  CONTENT_ENCODING: 'content-encoding',
  CONTENT_TYPE: 'content-type',
  CONTENT_LENGTH: 'content-length',
  ACCEPT_ENCODING: 'accept-encoding',
};

export const CHARACTER_ENCODING = {
  UTF8: 'utf8',
};

// @deprecated use Bearer instead
export const TOKEN_BASIC = 'Basic';
export const TOKEN_BEARER = 'Bearer';

export const HEADERS = {
  ACCEPT: 'Accept',
  ACCEPT_ENCODING: 'Accept-Encoding',
  USER_AGENT: 'User-Agent',
  JSON: 'application/json',
  CONTENT_TYPE: 'Content-type',
  CONTENT_LENGTH: 'content-length',
  TEXT_PLAIN: 'text/plain',
  TEXT_PLAIN_UTF8: 'text/plain; charset=utf-8',
  TEXT_HTML_UTF8: 'text/html; charset=utf-8',
  TEXT_HTML: 'text/html',
  AUTHORIZATION: 'authorization',
  CACHE_CONTROL: 'Cache-Control',
  // only set with proxy that setup HTTPS
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
  FORWARDED_PROTO: 'X-Forwarded-Proto',
  FORWARDED_FOR: 'X-Forwarded-For',
  FRAMES_OPTIONS: 'X-Frame-Options',
  CSP: 'Content-Security-Policy',
  CTO: 'X-Content-Type-Options',
  XSS: 'X-XSS-Protection',
  NONE_MATCH: 'If-None-Match',
  ETAG: 'ETag',
  JSON_CHARSET: 'application/json; charset=utf-8',
  JSON_INSTALL_CHARSET: 'application/vnd.npm.install-v1+json; charset=utf-8',
  OCTET_STREAM: 'application/octet-stream; charset=utf-8',
  TEXT_CHARSET: 'text/plain; charset=utf-8',
  WWW_AUTH: 'WWW-Authenticate',
  GZIP: 'gzip',
};

export const HTTP_STATUS = {
  OK: httpCodes.OK,
  CREATED: httpCodes.CREATED,
  MULTIPLE_CHOICES: httpCodes.MULTIPLE_CHOICES,
  NOT_MODIFIED: httpCodes.NOT_MODIFIED,
  BAD_REQUEST: httpCodes.BAD_REQUEST,
  UNAUTHORIZED: httpCodes.UNAUTHORIZED,
  FORBIDDEN: httpCodes.FORBIDDEN,
  NOT_FOUND: httpCodes.NOT_FOUND,
  CONFLICT: httpCodes.CONFLICT,
  NOT_IMPLEMENTED: httpCodes.NOT_IMPLEMENTED,
  UNSUPPORTED_MEDIA: httpCodes.UNSUPPORTED_MEDIA_TYPE,
  BAD_DATA: httpCodes.UNPROCESSABLE_ENTITY,
  INTERNAL_ERROR: httpCodes.INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE: httpCodes.SERVICE_UNAVAILABLE,
  LOOP_DETECTED: 508,
};

export const ERROR_CODE = {
  token_required: 'token is required',
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
  OK: 'ok',
  LOGGED_OUT: 'Logged out',
};

export const LOG_STATUS_MESSAGE =
  "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}'";
export const LOG_VERDACCIO_ERROR = `${LOG_STATUS_MESSAGE}, error: @{!error}`;
export const LOG_VERDACCIO_BYTES = `${LOG_STATUS_MESSAGE}, bytes: @{bytes.in}/@{bytes.out}`;

export const ROLES = {
  $ALL: '$all',
  ALL: 'all',
  $AUTH: '$authenticated',
  $ANONYMOUS: '$anonymous',
  DEPRECATED_ALL: '@all',
  DEPRECATED_AUTH: '@authenticated',
  DEPRECATED_ANONYMOUS: '@anonymous',
};

export const PACKAGE_ACCESS = {
  SCOPE: '@*/*',
  ALL: '**',
};
