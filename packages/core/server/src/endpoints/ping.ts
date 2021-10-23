/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
import { logger } from '@verdaccio/logger';
import { FastifyInstance } from 'fastify';

async function pingRoute(fastify: FastifyInstance) {
  fastify.get('/-/ping', async () => {
    logger.http('ping endpoint');
    console.log('-storage->', fastify.storage);
    console.log('-config->', fastify.configInstance);
    return {};
  });
}

export default pingRoute;
