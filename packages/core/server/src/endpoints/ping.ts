import { logger } from '@verdaccio/logger';

async function pingRoute(fastify) {
  fastify.get('/-/ping', async () => {
    logger.http('ping endpoint');
    return {};
  });
}

export default pingRoute;
