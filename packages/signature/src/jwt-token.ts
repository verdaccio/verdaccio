import buildDebug from 'debug';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

import { RemoteUser } from '@verdaccio/types';

export type SignOptionsSignature = SignOptions;
export type VerifyOptionsSignature = VerifyOptions;

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
  options: SignOptionsSignature = {}
): Promise<string> {
  return new Promise(function (resolve, reject) {
    debug('sign jwt token');
    jwt.sign(
      payload,
      secretOrPrivateKey, // FIXME: upgrade to the latest library and types
      {
        // 1 === 1ms (one millisecond)
        notBefore: '1ms', // Make sure the time will not rollback :)
        ...options,
      },
      (error, token) => {
        if (error) {
          debug('error on sign jwt token %s', error.message);
          return reject(error);
        }
        debug('signed jwt token successfully');
        return resolve(token as string);
      }
    );
  });
}

export function verifyPayload(
  token: string,
  secretOrPrivateKey: string,
  options: VerifyOptionsSignature = {}
): RemoteUser {
  debug('verifying jwt token');
  return jwt.verify(token, secretOrPrivateKey, options) as RemoteUser;
}
