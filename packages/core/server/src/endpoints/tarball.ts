import { FastifyInstance } from 'fastify';
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:api:tarball');

async function tarballRoute(fastify: FastifyInstance) {
  fastify.get('/:package/-/:filename', async (request, reply) => {
    // @ts-ignore
    const { package: pkg, filename } = request.params;
    debug('stream tarball for %s@%s', pkg, filename);
    const stream = fastify.storage.getTarball(pkg, filename);
    return reply.send(stream);
  });

  fastify.get('/:scopedPackage/-/:scope/:filename', async (request, reply) => {
    // @ts-ignore
    const { scopedPackage, filename } = request.params;
    debug('stream scope tarball for %s@%s', scopedPackage, filename);
    const stream = fastify.storage.getTarball(scopedPackage, filename);
    return reply.send(stream);
  });
}

export default tarballRoute;
