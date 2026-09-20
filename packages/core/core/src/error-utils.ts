import type { HttpError } from 'http-errors';
import createError from 'http-errors';

import { HTTP_STATUS } from './constants';

export const API_ERROR = {
  PASSWORD_SHORT: 'The provided password does not pass the validation',
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
  NOT_MODIFIED_NO_DATA: 'no data',
  CONTENT_MISMATCH: 'content length mismatch',
  NOT_FILE_UPLINK: "file doesn't exist on uplink",
  MAX_USERS_REACHED: 'maximum amount of users reached',
  VERSION_NOT_EXIST: "this version doesn't exist",
  NO_SUCH_FILE: 'no such file available',
  UNSUPORTED_REGISTRY_CALL: 'unsupported registry call',
  FILE_NOT_FOUND: 'File not found',
  REGISTRATION_DISABLED: 'user registration disabled',
  UNAUTHORIZED_ACCESS: 'unauthorized access',
  BAD_STATUS_CODE: 'bad status code',
  SERVER_TIME_OUT: 'looks like the server is taking to long to respond',
  PACKAGE_EXIST: 'this package is already present',
  BAD_AUTH_HEADER: 'bad authorization header',
  WEB_DISABLED: 'Web interface is disabled in the config file',
  DEPRECATED_BASIC_HEADER: 'basic authentication is deprecated, please use JWT instead',
  BAD_FORMAT_USER_GROUP: 'user groups is different than an array',
  RESOURCE_UNAVAILABLE: 'resource unavailable',
  BAD_PACKAGE_DATA: 'bad incoming package data',
  USERNAME_PASSWORD_REQUIRED: 'username and password is required',
  USERNAME_ALREADY_REGISTERED: 'username is already registered',
  USERNAME_MISMATCH: 'username does not match logged in user',
  NO_CREDENTIALS_PROVIDED: 'no credentials provided',
  CAN_NOT_USE_THIS_FILENAME: "can't use this filename",
  SESSION_ID_REQUIRED: 'session id is required',
  SESSION_ID_INVALID: 'session id is invalid',
  SESSION_TOKEN_EXPIRED: 'session token expired',
};

export const SUPPORT_ERRORS = {
  PLUGIN_MISSING_INTERFACE: 'the plugin does not provide implementation of the requested feature',
  TFA_DISABLED: 'the two-factor authentication is not yet supported',
  STORAGE_NOT_IMPLEMENT: 'the storage does not support token saving',
  PARAMETERS_NOT_VALID: 'the parameters are not valid',
};

export const APP_ERROR = {
  CONFIG_NOT_VALID: 'CONFIG: it does not look like a valid config file',
  PROFILE_ERROR: 'profile unexpected error',
  PASSWORD_VALIDATION: 'not valid password',
};

export type VerdaccioError = HttpError & { code: number };

function getError(code: number, message: string): VerdaccioError {
  const httpError = createError(code, message);

  httpError.code = code;

  return httpError as VerdaccioError;
}

/** 409 Conflict. Defaults to {@link API_ERROR.PACKAGE_EXIST}. */
export function getConflict(message = API_ERROR.PACKAGE_EXIST): VerdaccioError {
  return getError(HTTP_STATUS.CONFLICT, message);
}

/** 422 Unprocessable Entity. Defaults to {@link API_ERROR.BAD_DATA}. */
export function getBadData(message = API_ERROR.BAD_DATA): VerdaccioError {
  return getError(HTTP_STATUS.BAD_DATA, message);
}

/** 400 Bad Request. */
export function getBadRequest(message: string): VerdaccioError {
  return getError(HTTP_STATUS.BAD_REQUEST, message);
}

/** 500 Internal Server Error. Defaults to {@link API_ERROR.UNKNOWN_ERROR}. */
export function getInternalError(message = API_ERROR.UNKNOWN_ERROR): VerdaccioError {
  return getError(HTTP_STATUS.INTERNAL_ERROR, message);
}

/** 401 Unauthorized. Defaults to {@link API_ERROR.NO_CREDENTIALS_PROVIDED}. */
export function getUnauthorized(message = API_ERROR.NO_CREDENTIALS_PROVIDED): VerdaccioError {
  return getError(HTTP_STATUS.UNAUTHORIZED, message);
}

/** 403 Forbidden. Defaults to {@link API_ERROR.CAN_NOT_USE_THIS_FILENAME}. */
export function getForbidden(message = API_ERROR.CAN_NOT_USE_THIS_FILENAME): VerdaccioError {
  return getError(HTTP_STATUS.FORBIDDEN, message);
}

/** 503 Service Unavailable. Defaults to {@link API_ERROR.RESOURCE_UNAVAILABLE}. */
export function getServiceUnavailable(message = API_ERROR.RESOURCE_UNAVAILABLE): VerdaccioError {
  return getError(HTTP_STATUS.SERVICE_UNAVAILABLE, message);
}

/** 404 Not Found. Defaults to {@link API_ERROR.NO_PACKAGE}. */
export function getNotFound(message = API_ERROR.NO_PACKAGE): VerdaccioError {
  return getError(HTTP_STATUS.NOT_FOUND, message);
}

/** Returns an error with a custom HTTP status code. */
export function getCode(statusCode: number, message: string): VerdaccioError {
  return getError(statusCode, message);
}
