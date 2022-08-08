import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

import { Package, Version } from '@verdaccio/types';

const debug = buildDebug('verdaccio:fastify:api:sidebar');
export type $SidebarPackage = Package & { latest: Version };

interface ParamsInterface {
  name: string;
  version: string;
}

async function manifestRoute(fastify: FastifyInstance) {
  fastify.get<{ Params: ParamsInterface }>('/:name', async (request) => {
    const { name } = request.params;
    const storage = fastify.storage;
    debug('pkg name %s ', name);
    const data = await storage?.getPackageByOptions({
      name,
      // @ts-ignore
      uplinksLook: true,
      requestOptions: {
        protocol: request.protocol,
        headers: request.headers as any,
        host: request.hostname,
      },
    });
    return data;
  });

  interface QueryInterface {
    write: string;
  }

  fastify.get<{ Params: ParamsInterface; Querystring: QueryInterface }>(
    '/:packageName/:version',
    async (request) => {
      const { name, version } = request.params;
      const storage = fastify.storage;
      const write = request.query.write === 'true';
      debug('pkg name %s, with version / tag: %s ', name, version);
      const requestOptions = {
        protocol: request.protocol,
        headers: request.headers as any,
        host: request.hostname,
        remoteAddress: request.socket.remoteAddress,
        byPassCache: write,
      };
      const data = await storage?.getPackageByOptions({
        name,
        version,
        uplinksLook: true,
        requestOptions,
      });
      return data;
    }
  );
}

export default manifestRoute;
