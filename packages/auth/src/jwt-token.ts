import jwt from 'jsonwebtoken';
import buildDebug from 'debug';

import { JWTSignOptions, RemoteUser } from '@verdaccio/types';

const debug = buildDebug('verdaccio:auth:token:jwt');
/**
 * Sign the payload and return JWT
 * https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
 * @param payload
 * @param secretOrPrivateKey
 * @param options
 */
export async function signPayload(
  payload: RemoteUser,
  secretOrPrivateKey: string,
  options: JWTSignOptions = {}
): Promise<string> {
  return new Promise(function (resolve, reject): Promise<string> {
    debug('sign jwt token');
    return jwt.sign(
      payload,
      secretOrPrivateKey,
      {
        // 1 === 1ms (one millisecond)
        notBefore: '1', // Make sure the time will not rollback :)
        ...options,
      },
      (error, token) => {
        debug('error on sign jwt token');
        return error ? reject(error) : resolve(token);
      }
    );
  });
}

export function verifyPayload(token: string, secretOrPrivateKey: string): RemoteUser {
  debug('verify jwt token');
  return jwt.verify(token, secretOrPrivateKey);
}
