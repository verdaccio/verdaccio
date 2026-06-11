import { constants as coreConstants } from '@verdaccio/core';

export {
  API_ERROR,
  API_MESSAGE,
  HTTP_STATUS,
  HEADERS,
  HEADER_TYPE,
  TOKEN_BASIC,
  TOKEN_BEARER,
  SUPPORT_ERRORS,
  DIST_TAGS,
  LATEST,
} from '@verdaccio/core';

export const ROLES = coreConstants.ROLES;

// verdaccio-specific values not provided by @verdaccio/core
export const ERROR_CODE = {
  token_required: 'token is required',
};
export const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
export const DEFAULT_UPLINK = 'npmjs';
export const WEB_TITLE = 'Verdaccio';
