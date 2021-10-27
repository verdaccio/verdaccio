/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
import _ from 'lodash';
import { getAuthenticatedMessage, validatePassword } from '@verdaccio/utils';
import { RemoteUser } from '@verdaccio/types';
import { logger } from '@verdaccio/logger';
import { createRemoteUser } from '@verdaccio/config';
import { getApiToken } from '@verdaccio/auth';
import buildDebug from 'debug';
import { FastifyInstance, FastifyRequest } from 'fastify';

const debug = buildDebug('verdaccio:api:user');

async function userRoute(fastify: FastifyInstance) {
  fastify.get('/:org_couchdb_user', async (request, reply) => {
    // @ts-expect-error
    const message = getAuthenticatedMessage(request.userRemote.name);
    logger.info('user authenticated message %o', message);
    reply.code(fastify.statusCode.OK);
    return { ok: message };
  });

  fastify.delete('/token/:token', async (request: FastifyRequest, reply) => {
    debug('loging out');
    // FIXME: type params correctly
    // @ts-ignore
    const { token } = request.params;
    const userRemote: RemoteUser = request.userRemote;
    await fastify.auth.invalidateToken(token);
    console.log('userRoute', userRemote);
    reply.code(fastify.statusCode.OK);
    return { ok: fastify.apiMessage.LOGGED_OUT };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify.put<{
    Body: { name: string; password: string };
  }>('/:username', async (request, reply) => {
    const { name, password } = request.body;
    const remoteName = request.userRemote.name;
    if (_.isNil(remoteName) === false && _.isNil(name) === false && remoteName === name) {
      //   debug('login: no remote user detected');
      fastify.auth.authenticate(
        name,
        password,
        async function callbackAuthenticate(err, user): Promise<void> {
          if (err) {
            logger.trace(
              { name, err },
              'authenticating for user @{username} failed. Error: @{err.message}'
            );
            reply
              .code(fastify.statusCode.UNAUTHORIZED)
              .send(
                fastify.errorUtils.getCode(
                  fastify.statusCode.UNAUTHORIZED,
                  fastify.apiError.BAD_USERNAME_PASSWORD
                )
              );
          }
          const restoredRemoteUser: RemoteUser = createRemoteUser(name, user.groups || []);
          const token = await getApiToken(
            fastify.auth,
            fastify.configInstance,
            restoredRemoteUser,
            password
          );
          debug('login: new token');
          if (!token) {
            return reply.send(fastify.errorUtils.getUnauthorized());
          } else {
            reply.code(fastify.statusCode.CREATED);
            const message = getAuthenticatedMessage(remoteName);
            debug('login: created user message %o', message);
            reply.send({
              ok: message,
              token,
            });
          }
        }
      );
    } else {
      if (validatePassword(password) === false) {
        debug('adduser: invalid password');
        reply.code(fastify.statusCode.BAD_REQUEST).send(
          fastify.errorUtils.getCode(
            fastify.statusCode.BAD_REQUEST,
            // eslint-disable-next-line new-cap
            fastify.apiError.PASSWORD_SHORT()
          )
        );
        return;
      }
      fastify.auth.add_user(name, password, async function (err, user): Promise<void> {
        if (err) {
          if (
            err.status >= fastify.statusCode.BAD_REQUEST &&
            err.status < fastify.statusCode.INTERNAL_ERROR
          ) {
            debug('adduser: error on create user');
            // With npm registering is the same as logging in,
            // and npm accepts only an 409 error.
            // So, changing status code here.
            const addUserError =
              fastify.errorUtils.getCode(err.status, err.message) ||
              fastify.errorUtils.getConflict(err.message);

            reply.send(addUserError);
            return;
          }
        }
        const token =
          name && password
            ? await getApiToken(fastify.auth, fastify.configInstance, user, password)
            : undefined;
        debug('adduser: new token %o', token);
        if (!token) {
          return reply.send(fastify.errorUtils.getUnauthorized());
        }
        debug('adduser: user has been created');
        reply.code(fastify.statusCode.CREATED).send({
          ok: `user '${name}' created`,
          token,
        });
      });
    }
  });
}

export default userRoute;
