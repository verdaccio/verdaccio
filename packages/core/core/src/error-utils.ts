import createError, { HttpError } from 'http-errors';

import { HTTP_STATUS } from './constants';

export const API_ERROR = {
  PASSWORD_SHORT: `The provided password does not pass the validation`,
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
  return customMessage
    ? getError(HTTP_STATUS.INTERNAL_ERROR, customMessage)
    : getError(HTTP_STATUS.INTERNAL_ERROR, API_ERROR.UNKNOWN_ERROR);
}

export function getUnauthorized(message = 'no credentials provided'): VerdaccioError {
  return getError(HTTP_STATUS.UNAUTHORIZED, message);
}

export function getForbidden(message = "can't use this filename"): VerdaccioError {
  return getError(HTTP_STATUS.FORBIDDEN, message);
}

export function getServiceUnavailable(
  message: string = API_ERROR.RESOURCE_UNAVAILABLE
): VerdaccioError {
  return getError(HTTP_STATUS.SERVICE_UNAVAILABLE, message);
}

export function getNotFound(customMessage?: string): VerdaccioError {
  return getError(HTTP_STATUS.NOT_FOUND, customMessage || API_ERROR.NO_PACKAGE);
}

export function getCode(statusCode: number, customMessage: string): VerdaccioError {
  return getError(statusCode, customMessage);
}
