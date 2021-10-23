import fp from 'fastify-plugin';

import { errorUtils, validatioUtils, API_ERROR, API_MESSAGE, HTTP_STATUS } from '@verdaccio/core';

export default fp(
  async function (fastify) {
    fastify.decorate('errorUtils', errorUtils);
    fastify.decorate('apiError', API_ERROR);
    fastify.decorate('apiMessage', API_MESSAGE);
    fastify.decorate('validatioUtils', validatioUtils);
    fastify.decorate('statusCode', HTTP_STATUS);
  },
  {
    fastify: '>=3.x',
  }
);

declare module 'fastify' {
  interface FastifyInstance {
    apiError: typeof API_ERROR;
    apiMessage: typeof API_MESSAGE;
    httpStatuscode: typeof HTTP_STATUS;
  }
}
