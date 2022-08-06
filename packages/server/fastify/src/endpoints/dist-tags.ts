import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

import { MergeTags } from '@verdaccio/types';

const debug = buildDebug('verdaccio:fastify:dist-tags');

interface ParamsInterface {
  packageName: string;
}

async function distTagsRoute(fastify: FastifyInstance) {
  fastify.get<{ Params: ParamsInterface }>(
    '/-/package/:packageName/dist-tags',
    async (request, reply) => {
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
    }
  );

  fastify.post<{ Params: ParamsInterface; Body: MergeTags }>(
    '/-/package/:packageName/dist-tags',
    async (request) => {
      const { packageName } = request.params;
      await fastify.storage.mergeTagsNext(packageName, request.body);
      return { ok: fastify.constants.API_MESSAGE.TAG_UPDATED };
    }
  );

  fastify.delete('/-/package/:packageName/dist-tags', async (request, reply) => {
    // @ts-ignore
    // const { packageName } = request.params;

    reply.code(fastify.statusCode.NOT_FOUND);
  });
}

export default distTagsRoute;
