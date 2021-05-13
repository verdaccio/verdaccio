import fastify from 'fastify';
import buildDebug from 'debug';

import ping from './endpoints/ping';

const debug = buildDebug('verdaccio:fastify');

async function startServer({logger}) {
  debug('start server');
  const app = fastify({logger});
  app.register(ping);
  return app;
}

export default startServer;
