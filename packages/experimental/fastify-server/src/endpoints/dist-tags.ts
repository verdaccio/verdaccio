import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

const debug = buildDebug('verdaccio:api:dist-tags');

async function distTagsRoute(fastify: FastifyInstance) {
  fastify.get('/-/package/:packageName/dist-tags', async (request, reply) => {
    // @ts-ignore
    const { packageName } = request.params;
    debug('dist-tags: response %o', packageName);
    const requestOptions = {
      protocol: request.protocol,
      headers: request.headers as any,
      host: request.hostname,
      remoteAddress: request.socket.remoteAddress,
    };
    const manifest = fastify.storage.getPackageByOptions({
      name: packageName,
      uplinksLook: true,
      keepUpLinkData: true,
      requestOptions,
    });
    reply.code(fastify.statusCode.OK).send(manifest[fastify.constants.DIST_TAGS]);
  });

  fastify.post('/-/package/:packageName/dist-tags', async (request) => {
    // @ts-ignore
    const { packageName } = request.params;
    // @ts-ignore
    await fastify.storage.mergeTags(packageName, request.body);
    return { ok: fastify.constants.API_MESSAGE.TAG_UPDATED };
  });

  fastify.delete('/-/package/:packageName/dist-tags', async (request, reply) => {
    // @ts-ignore
    // const { packageName } = request.params;

    reply.code(fastify.statusCode.NOT_FOUND);
  });
}

export default distTagsRoute;
