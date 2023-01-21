export {
  API_ERROR,
  API_MESSAGE,
  HTTP_STATUS,
  HEADERS,
  HEADER_TYPE,
  CHARACTER_ENCODING,
  TOKEN_BASIC,
  TOKEN_BEARER,
  SUPPORT_ERRORS,
  APP_ERROR,
} from '@verdaccio/core';
export { ROLES, PACKAGE_ACCESS } from '@verdaccio/utils';

export const DEFAULT_PORT = '4873';
export const DEFAULT_PROTOCOL = 'http';
export const DEFAULT_DOMAIN = 'localhost';
export const TIME_EXPIRATION_24H = '24h';
export const TIME_EXPIRATION_1H = '1h';
export const DIST_TAGS = 'dist-tags';
export const LATEST = 'latest';
export const USERS = 'users';
export const DEFAULT_MIN_LIMIT_PASSWORD = 3;
export const DEFAULT_USER = 'Anonymous';

export const keyPem = 'verdaccio-key.pem';
export const certPem = 'verdaccio-cert.pem';
export const csrPem = 'verdaccio-csr.pem';

export const ERROR_CODE = {
  token_required: 'token is required',
};
export const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
export const DEFAULT_UPLINK = 'npmjs';
export const DEFAULT_NO_README = 'ERROR: No README data found!';
export const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';
export const WEB_TITLE = 'Verdaccio';
export const STORAGE = {
  PACKAGE_FILE_NAME: 'package.json',
  FILE_EXIST_ERROR: 'EEXISTS',
  NO_SUCH_FILE_ERROR: 'ENOENT',
  DEFAULT_REVISION: '0-0000000000000000',
};
