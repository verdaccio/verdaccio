async function pingRoute(fastify) {
  fastify.get('/-/ping', async () => {
    return {};
  });
}

export default pingRoute;
