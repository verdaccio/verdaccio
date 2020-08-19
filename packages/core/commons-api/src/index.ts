import createError, { HttpError } from 'http-errors';
import httpCodes from 'http-status-codes';

export const DEFAULT_MIN_LIMIT_PASSWORD = 3;

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
  UNSUPPORTED_MEDIA: httpCodes.UNSUPPORTED_MEDIA_TYPE,
  BAD_DATA: httpCodes.UNPROCESSABLE_ENTITY,
  INTERNAL_ERROR: httpCodes.INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE: httpCodes.SERVICE_UNAVAILABLE,
  LOOP_DETECTED: 508,
};

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

export const API_ERROR = {
  PASSWORD_SHORT: (passLength = DEFAULT_MIN_LIMIT_PASSWORD): string =>
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
  BAD_STATUS_CODE: 'bad status code',
  PACKAGE_EXIST: 'this package is already present',
  BAD_AUTH_HEADER: 'bad authorization header',
  WEB_DISABLED: 'Web interface is disabled in the config file',
  DEPRECATED_BASIC_HEADER: 'basic authentication is deprecated, please use JWT instead',
  BAD_FORMAT_USER_GROUP: 'user groups is different than an array',
  RESOURCE_UNAVAILABLE: 'resource unavailable',
  BAD_PACKAGE_DATA: 'bad incoming package data',
  USERNAME_PASSWORD_REQUIRED: 'username and password is required',
  USERNAME_ALREADY_REGISTERED: 'username is already registered',
};

export type VerdaccioError = HttpError & { code: number };

function getError(code: number, message: string): VerdaccioError {
  const httpError = createError(code, message);

  httpError.code = code;

  return httpError as VerdaccioError;
}

export function getConflict(message: string = API_ERROR.PACKAGE_EXIST): VerdaccioError {
  return getError(HTTP_STATUS.CONFLICT, message);
}

export function getBadData(customMessage?: string): VerdaccioError {
  return getError(HTTP_STATUS.BAD_DATA, customMessage || API_ERROR.BAD_DATA);
}

export function getBadRequest(customMessage: string): VerdaccioError {
  return getError(HTTP_STATUS.BAD_REQUEST, customMessage);
}

export function getInternalError(customMessage?: string): VerdaccioError {
  return customMessage ? getError(HTTP_STATUS.INTERNAL_ERROR, customMessage) : getError(HTTP_STATUS.INTERNAL_ERROR, API_ERROR.UNKNOWN_ERROR);
}

export function getUnauthorized(message = 'no credentials provided'): VerdaccioError {
  return getError(HTTP_STATUS.UNAUTHORIZED, message);
}

export function getForbidden(message = "can't use this filename"): VerdaccioError {
  return getError(HTTP_STATUS.FORBIDDEN, message);
}

export function getServiceUnavailable(message: string = API_ERROR.RESOURCE_UNAVAILABLE): VerdaccioError {
  return getError(HTTP_STATUS.SERVICE_UNAVAILABLE, message);
}

export function getNotFound(customMessage?: string): VerdaccioError {
  return getError(HTTP_STATUS.NOT_FOUND, customMessage || API_ERROR.NO_PACKAGE);
}

export function getCode(statusCode: number, customMessage: string): VerdaccioError {
  return getError(statusCode, customMessage);
}
