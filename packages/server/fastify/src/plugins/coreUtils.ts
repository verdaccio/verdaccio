import fp from 'fastify-plugin';

import {
  API_ERROR,
  API_MESSAGE,
  HTTP_STATUS,
  constants,
  errorUtils,
  pluginUtils,
  searchUtils,
  streamUtils,
  validationUtils,
  warningUtils,
} from '@verdaccio/core';

export default fp(
  async function (fastify) {
    fastify.decorate('errorUtils', errorUtils);
    fastify.decorate('searchUtils', searchUtils);
    fastify.decorate('streamUtils', streamUtils);
    fastify.decorate('validationUtils', validationUtils);
    fastify.decorate('pluginUtils', pluginUtils);
    fastify.decorate('warningUtils', warningUtils);
    fastify.decorate('apiError', API_ERROR);
    fastify.decorate('constants', constants);
    fastify.decorate('apiMessage', API_MESSAGE);
    fastify.decorate('statusCode', HTTP_STATUS);
  },
  {
    fastify: '>=4.x',
  }
);

declare module 'fastify' {
  interface FastifyInstance {
    apiError: typeof API_ERROR;
    apiMessage: typeof API_MESSAGE;
    statusCode: typeof HTTP_STATUS;
    errorUtils: typeof errorUtils;
    warningUtils: typeof warningUtils;
    searchUtils: typeof searchUtils;
    streamUtils: typeof streamUtils;
    pluginUtils: typeof pluginUtils;
    validationUtils: typeof validationUtils;
    constants: typeof constants;
  }
}
