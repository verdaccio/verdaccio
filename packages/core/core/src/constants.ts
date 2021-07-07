export const DEFAULT_MIN_LIMIT_PASSWORD = 3;
export const TIME_EXPIRATION_24H = '24h';
export const TIME_EXPIRATION_7D = '7d';
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
  // only set with proxy that setup HTTPS
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
  FORWARDED_PROTO: 'X-Forwarded-Proto',
  FORWARDED_FOR: 'X-Forwarded-For',
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
