import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

const debug = buildDebug('verdaccio:api:dist-tags');

async function distTagsRoute(fastify: FastifyInstance) {
  fastify.get('/-/package/:packageName/dist-tags', async (request, reply) => {
    // @ts-ignore
    const { packageName } = request.params;
    debug('dist-tags: response %o', packageName);
    fastify.storage.getPackage({
      name: packageName,
      uplinksLook: true,
      req: request.raw,
      callback: function (err, info): void {
        if (err) {
          reply.send(err);
        }
        reply.code(fastify.statusCode.OK).send(info[fastify.constants.DIST_TAGS]);
      },
    });
  });

  fastify.post('/-/package/:packageName/dist-tags', async (request, reply) => {
    // @ts-ignore
    const { packageName } = request.params;
    // @ts-ignore
    fastify.storage.mergeTags(packageName, request.body, function (err): void {
      if (err) {
        reply.send(err);
      }
      reply
        .code(fastify.statusCode.CREATED)
        .send({ ok: fastify.constants.API_MESSAGE.TAG_UPDATED });
    });
  });

  fastify.delete('/-/package/:packageName/dist-tags', async (request, reply) => {
    // @ts-ignore
    const { packageName } = request.params;
    fastify.storage.getPackage({
      name: packageName,
      uplinksLook: true,
      req: request.raw,
      callback: function (err, info): void {
        if (err) {
          reply.send(err);
        }
        reply.send(info[fastify.constants.DIST_TAGS]);
      },
    });
  });
}

export default distTagsRoute;
