import buildDebug from 'debug';
import _ from 'lodash';

import { TOKEN_BASIC, TOKEN_BEARER } from '@verdaccio/core';
import { aesDecryptDeprecated as aesDecrypt, parseBasicPayload } from '@verdaccio/signature';
import { Security } from '@verdaccio/types';

import { AuthMiddlewarePayload } from './types';
import {
  convertPayloadToBase64,
  isAESLegacy,
  parseAuthTokenHeader,
  verifyJWTPayload,
} from './utils';

const debug = buildDebug('verdaccio:auth:utils');

export function parseAESCredentials(authorizationHeader: string, secret: string) {
  debug('parseAESCredentials');
  const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

  // basic is deprecated and should not be enforced
  // basic is currently being used for functional test
  if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
    debug('legacy header basic');
    const credentials = convertPayloadToBase64(token).toString();

    return credentials;
  } else if (scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    debug('legacy header bearer');
    const credentials = aesDecrypt(Buffer.from(token), secret);

    return credentials;
  }
}

export function getMiddlewareCredentials(
  security: Security,
  secretKey: string,
  authorizationHeader: string
): AuthMiddlewarePayload {
  debug('getMiddlewareCredentials');
  // comment out for debugging purposes
  if (isAESLegacy(security)) {
    debug('is legacy');
    const credentials = parseAESCredentials(authorizationHeader, secretKey);
    if (typeof credentials !== 'string') {
      debug('parse legacy credentials failed');
      return;
    }

    const parsedCredentials = parseBasicPayload(credentials);
    if (!parsedCredentials) {
      debug('parse legacy basic payload credentials failed');
      return;
    }

    return parsedCredentials;
  }
  const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

  debug('is jwt');
  if (_.isString(token) && scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    return verifyJWTPayload(token, secretKey);
  }
}
