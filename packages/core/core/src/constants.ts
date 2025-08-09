import httpCodes from 'http-status-codes';

export const DEFAULT_PASSWORD_VALIDATION = /.{3}$/;
export const TIME_EXPIRATION_24H = '24h';
export const TIME_EXPIRATION_1H = '1h';
export const DIST_TAGS = 'dist-tags';
export const LATEST = 'latest';
export const USERS = 'users';
export const MAINTAINERS = 'maintainers';
export const DEFAULT_USER = 'Anonymous'; // for display purposes
export const ANONYMOUS_USER = 'anonymous'; // for username purposes

export const HEADER_TYPE = {
  CONTENT_ENCODING: 'content-encoding',
  CONTENT_TYPE: 'content-type',
  CONTENT_LENGTH: 'content-length',
  ACCEPT_ENCODING: 'accept-encoding',
  AUTHORIZATION: 'authorization',
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
  RETRY_AFTER: 'Retry-After',
  // only set with proxy that setup HTTPS
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
  FORWARDED_PROTO: 'X-Forwarded-Proto',
  FORWARDED_FOR: 'X-Forwarded-For',
  FRAMES_OPTIONS: 'X-Frame-Options',
  CSP: 'Content-Security-Policy',
  CTO: 'X-Content-Type-Options',
  XSS: 'X-XSS-Protection',
  CLIENT: 'X-Client',
  POWERED_BY: 'X-Powered-By',
  RATELIMIT_LIMIT: 'X-RateLimit-Limit',
  RATELIMIT_REMAINING: 'X-RateLimit-Remaining',
  NONE_MATCH: 'If-None-Match',
  ETAG: 'ETag',
  JSON_CHARSET: 'application/json; charset=utf-8',
  JSON_INSTALL_CHARSET: 'application/vnd.npm.install-v1+json; charset=utf-8',
  OCTET_STREAM: 'application/octet-stream; charset=utf-8',
  TEXT_CHARSET: 'text/plain; charset=utf-8',
  WWW_AUTH: 'WWW-Authenticate',
  GZIP: 'gzip',
  HOST: 'host',
};

/**
 * HTTP status codes used throughout Verdaccio.
 */
export const HTTP_STATUS = {
  /** 202: The request has been accepted for processing, but the processing is not yet complete. */
  ACCEPTED: httpCodes.ACCEPTED,
  /** 200: Standard response for successful HTTP requests. */
  OK: httpCodes.OK,
  /** 201: The request has been fulfilled and resulted in a new resource being created. */
  CREATED: httpCodes.CREATED,
  /** 300: Indicates multiple options for the resource from which the client may choose. */
  MULTIPLE_CHOICES: httpCodes.MULTIPLE_CHOICES,
  /** 304: Indicates that the resource has not been modified since the last request. */
  NOT_MODIFIED: httpCodes.NOT_MODIFIED,
  /** 400: The server could not understand the request due to invalid syntax. */
  BAD_REQUEST: httpCodes.BAD_REQUEST,
  /** 401: The client must authenticate itself to get the requested response. */
  UNAUTHORIZED: httpCodes.UNAUTHORIZED,
  /** 403: The client does not have access rights to the content. */
  FORBIDDEN: httpCodes.FORBIDDEN,
  /** 404: The server can not find the requested resource. */
  NOT_FOUND: httpCodes.NOT_FOUND,
  /** 408: The server timed out waiting for the request. */
  REQUEST_TIMEOUT: httpCodes.REQUEST_TIMEOUT,
  /** 409: The request could not be completed due to a conflict with the current state of the resource. */
  CONFLICT: httpCodes.CONFLICT,
  /** 415: The media format of the requested data is not supported by the server. */
  UNSUPPORTED_MEDIA: httpCodes.UNSUPPORTED_MEDIA_TYPE,
  /** 422: The request was well-formed but was unable to be followed due to semantic errors. */
  BAD_DATA: httpCodes.UNPROCESSABLE_ENTITY,
  /** 500: The server has encountered a situation it doesn't know how to handle. */
  INTERNAL_ERROR: httpCodes.INTERNAL_SERVER_ERROR,
  /** 501: The request method is not supported by the server and cannot be handled. */
  NOT_IMPLEMENTED: httpCodes.NOT_IMPLEMENTED,
  /** 502: The server, while acting as a gateway or proxy, received an invalid response from the upstream server. */
  BAD_GATEWAY: httpCodes.BAD_GATEWAY,
  /** 503: The server is not ready to handle the request. */
  SERVICE_UNAVAILABLE: httpCodes.SERVICE_UNAVAILABLE,
  /** 504: The server, while acting as a gateway or proxy, did not get a response in time from the upstream server. */
  GATEWAY_TIMEOUT: httpCodes.GATEWAY_TIMEOUT,
  /** 508: The server detected an infinite loop while processing the request. */
  LOOP_DETECTED: 508,
  /** 590: Custom Verdaccio code indicating the server cannot handle the request. */
  CANNOT_HANDLE: 590,
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

export enum HtpasswdHashAlgorithm {
  md5 = 'md5',
  sha1 = 'sha1',
  crypt = 'crypt',
  bcrypt = 'bcrypt',
}

export const PLUGIN_PREFIX = 'verdaccio';
export const PLUGIN_UI_PREFIX = 'verdaccio-theme';

export const PLUGIN_CATEGORY = {
  AUTHENTICATION: 'authentication',
  MIDDLEWARE: 'middleware',
  STORAGE: 'storage',
  FILTER: 'filter',
  THEME: 'theme',
};

export const DEFAULT_PORT = '4873';
export const DEFAULT_PROTOCOL = 'http';
export const DEFAULT_DOMAIN = 'localhost';
