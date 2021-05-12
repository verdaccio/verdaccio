import fastify from 'fastify';
import ping from './endpoints/ping';

async function startServer() {
  const app = fastify();

  app.register(ping);

  app.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  return app;
}

export default startServer;
