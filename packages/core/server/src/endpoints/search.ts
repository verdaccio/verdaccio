/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
import { logger } from '@verdaccio/logger';

async function searchRoute(fastify) {
  fastify.get('/-/v1/search', async (request, reply) => {
    // TODO: apply security layer here like in
    // packages/api/src/v1/search.ts
    // TODO: add validations for query, some parameters are mandatory
    // TODO: review which query fields are mandatory

    const abort = new AbortController();

    request.on('aborted', () => {
      abort.abort();
    });
    const { url, query } = request;
    const storage = fastify.storage;

    const data = await storage.searchManager?.search({
      query,
      url,
      abort,
    });

    logger.http('search endpoint');
    reply.code(200).send(data);
  });
}

export default searchRoute;
