// @flow

export const HEADERS = {
  JSON: 'application/json',
  JSON_CHARSET: 'application/json; charset=utf-8',
  OCTET_STREAM: 'application/octet-stream',
  GZIP: 'gzip',
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
export const DEFAULT_REGISTRY = 'https://registry.npmjs.org/';


export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  MULTIPLE_CHOICES: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNSUPORTED_MEDIA: 415,
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
};

export const API_ERROR = {
  NO_PACKAGE: 'no such package available',
  NOT_ALLOWED: 'not allowed to access package',
  INTERNAL_SERVER_ERROR: 'internal server error',
  UNKNOWN_ERROR: 'unknown error',
  NOT_PACKAGE_UPLINK: 'package doesn\'t exist on uplink',
  CONTENT_MISMATCH: 'content length mismatch',
  NOT_FILE_UPLINK: 'file doesn\'t exist on uplink',
  MAX_USERS_REACHED: 'maximum amount of users reached',
  VERSION_NOT_EXIST: 'this version doesn\'t exist',
};

export const DEFAULT_NO_README = 'ERROR: No README data found!';
