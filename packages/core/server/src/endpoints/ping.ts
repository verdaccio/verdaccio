/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
import { logger } from '@verdaccio/logger';

async function pingRoute(fastify) {
  fastify.get('/-/ping', async () => {
    logger.http('ping endpoint');
    // @ts-ignore
    console.log('-storage->', fastify.storage);
    console.log('-config->', fastify.config);
    return {};
  });
}

export default pingRoute;
