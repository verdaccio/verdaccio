/* eslint-disable no-console */

/* eslint-disable no-invalid-this */
import { FastifyInstance } from 'fastify';

import { logger } from '@verdaccio/logger';

async function pingRoute(fastify: FastifyInstance) {
  fastify.get('/-/ping', async () => {
    logger.http('ping');
    return {};
  });
}

export default pingRoute;
