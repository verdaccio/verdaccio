import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';

import { validatioUtils } from '@verdaccio/core';
import { JWTSignOptions, RemoteUser } from '@verdaccio/types';

const debug = buildDebug('verdaccio:fastify:web:login');
const loginBodySchema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    additionalProperties: false,
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  },
};

const resetPasswordSchema = {
  body: {
    type: 'object',
    required: ['password'],
    additionalProperties: false,
    properties: {
      password: { type: 'string' },
    },
  },
};

async function loginRoute(fastify: FastifyInstance) {
  fastify.post(
    '/login',
    {
      schema: loginBodySchema,
    },
    async (request, reply) => {
      // @ts-expect-error
      const { username, password } = request.body;
      debug('authenticate %o', username);
      fastify.auth.authenticate(
        username,
        password,
        async function callbackAuthenticate(err, user): Promise<void> {
          if (err) {
            const errorCode = err.message
              ? fastify.statusCode.UNAUTHORIZED
              : fastify.statusCode.INTERNAL_ERROR;
            reply.send(fastify.errorUtils.getCode(errorCode, err.message));
          } else {
            const jWTSignOptions: JWTSignOptions = fastify.configInstance.security.web.sign;
            debug('jwtSignOptions: %o', jWTSignOptions);
            const token = await fastify.auth.jwtEncrypt(user as RemoteUser, jWTSignOptions);
            reply.code(fastify.statusCode.OK).send({ token, username });
          }
        }
      );
    }
  );

  fastify.put(
    '/reset_password',
    {
      schema: resetPasswordSchema,
    },
    async (request, reply) => {
      if (_.isNil(request.userRemote.name)) {
        reply.send(
          fastify.errorUtils.getCode(
            fastify.statusCode.UNAUTHORIZED,
            fastify.errorUtils.API_ERROR.MUST_BE_LOGGED
          )
        );
      }
      // @ts-ignore
      const { password } = request.body;
      const { name } = request.userRemote;

      if (
        validatioUtils.validatePassword(
          password.new,
          fastify.configInstance?.server?.passwordValidationRegex
        ) === false
      ) {
        reply.send(
          fastify.errorUtils.getCode(
            fastify.statusCode.BAD_REQUEST,
            fastify.errorUtils.APP_ERROR.PASSWORD_VALIDATION
          )
        );
        return;
      }

      fastify.auth.changePassword(
        name as string,
        password.old,
        password.new,
        (err, isUpdated): void => {
          if (_.isNil(err) && isUpdated) {
            reply.code(fastify.statusCode.OK);
          } else {
            reply.send(
              fastify.errorUtils.getInternalError(
                fastify.errorUtils.API_ERROR.INTERNAL_SERVER_ERROR
              )
            );
          }
        }
      );
    }
  );
  // });
}
export default loginRoute;
