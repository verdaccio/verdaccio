import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

const debug = buildDebug('verdaccio:fastify:whoami');

async function whoamiRoute(fastify: FastifyInstance) {
  fastify.get('/-/whoami', async (request, reply) => {
    const username: string | void = request.userRemote.name;
    debug('whoami: response %o', username);
    reply.code(fastify.statusCode.OK);
    return { username };
  });
}

export default whoamiRoute;
