import fp from 'fastify-plugin';

import { logger } from '@verdaccio/logger';

function pingPlugin (fastify, _opts, done) {
  fastify.get('/-/ping', async () => {
    logger.http('ping endpoint');
    return {};
  });

  done();
}

export default fp(pingPlugin, {
  fastify: '3.x',
  name: 'api-ping'
});
