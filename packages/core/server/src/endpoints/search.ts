/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
import { logger } from '@verdaccio/logger';

async function searchRoute(fastify) {
  fastify.get('/-/v1/search', async () => {
    logger.http('search endpoint');
    // @ts-ignore
    console.log('-storage->', fastify.storage);
    console.log('-config->', fastify.config);
    return {};
  });
}

export default searchRoute;
