/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
import { getAuthenticatedMessage } from '@verdaccio/utils';
// import { API_ERROR, API_MESSAGE, HTTP_STATUS } from '@verdaccio/commons-api';
import { logger } from '@verdaccio/logger';
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:api:user');

async function userRoute(fastify) {
  fastify.get('/:org_couchdb_user', async () => {
    debug('verifying user');
    // @ts-ignore
    const message = getAuthenticatedMessage('test');
    logger.info('user authenticated message %o', message);
    return { ok: message };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify.put('/:org_couchdb_user/:_rev?/:revision?', async (_req, _reply) => {
    // const { name, password } = req.body;
    // const remoteName = req.remote_user.name;
    // if (_.isNil(remoteName) === false && _.isNil(name) === false && remoteName === name) {
    //   debug('login: no remote user detected');
    //   fastify.auth.authenticate(
    //     name,
    //     password,
    //     async function callbackAuthenticate(err, user): Promise<void> {
    //       if (err) {
    //         logger.trace(
    //           { name, err },
    //           'authenticating for user @{username} failed. Error: @{err.message}'
    //         );
    //         return reply.code(HTTP_STATUS.UNAUTHORIZED)
    //           ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, API_ERROR.BAD_USERNAME_PASSWORD)
    //         );
    //       }
    //       const restoredRemoteUser: RemoteUser = createRemoteUser(name, user.groups || []);
    //       const token = await getApiToken(auth, config, restoredRemoteUser, password);
    //       debug('login: new token');
    //       if (!token) {
    //         return next(ErrorCode.getUnauthorized());
    //       }
    //       res.status(HTTP_STATUS.CREATED);
    //       const message = getAuthenticatedMessage(req.remote_user.name);
    //       debug('login: created user message %o', message);
    //       return next({
    //         ok: message,
    //         token,
    //       });
    //     }
    //   );
    // } else {
    //   if (validatePassword(password) === false) {
    //     debug('adduser: invalid password');
    //     // eslint-disable-next-line new-cap
    //     return next(ErrorCode.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.PASSWORD_SHORT()));
    //   }
    //   auth.add_user(name, password, async function (err, user): Promise<void> {
    //     if (err) {
    //       if (err.status >= HTTP_STATUS.BAD_REQUEST && err.status < HTTP_STATUS.INTERNAL_ERROR) {
    //         debug('adduser: error on create user');
    //         // With npm registering is the same as logging in,
    //         // and npm accepts only an 409 error.
    //         // So, changing status code here.
    //         return next(
    //           ErrorCode.getCode(err.status, err.message) || ErrorCode.getConflict(err.message)
    //         );
    //       }
    //       return next(err);
    //     }
    //     const token =
    //       name && password ? await getApiToken(auth, config, user, password) : undefined;
    //     debug('adduser: new token %o', token);
    //     if (!token) {
    //       return next(ErrorCode.getUnauthorized());
    //     }
    //     req.remote_user = user;
    //     res.status(HTTP_STATUS.CREATED);
    //     debug('adduser: user has been created');
    //     return next({
    //       ok: `user '${req.body.name}' created`,
    //       token,
    //     });
    //   });
    // }
  });
}

export default userRoute;
