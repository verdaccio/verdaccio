import fastify from 'fastify';


async function startServer() {
  const app = fastify();

  app.get('/', async (request, reply) => {
    return {hello: 'world'}
  });

  return app;
}


export default startServer;
