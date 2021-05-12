import fastify from 'fastify';
import buildDebug from 'debug';

import ping from './endpoints/ping';

const debug = buildDebug('verdaccio:fastify');

async function startServer() {
  debug('start server');
  const app = fastify();
  app.register(ping);
  return app;
}

export default startServer;
