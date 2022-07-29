import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

import { Package, Version } from '@verdaccio/types';

const debug = buildDebug('verdaccio:web:api:sidebar');
export type $SidebarPackage = Package & { latest: Version };

async function manifestRoute(fastify: FastifyInstance) {
  fastify.get('/:packageName', async (request) => {
    // @ts-ignore
    const { packageName } = request.params;
    const storage = fastify.storage;
    debug('pkg name %s ', packageName);
    const data = await storage?.getPackageByOptions({
      name: packageName,
      // remove on refactor getPackageByOptions
      // @ts-ignore
      req: request.raw,
      uplinksLook: true,
      requestOptions: {
        protocol: request.protocol,
        headers: request.headers as any,
        host: request.hostname,
      },
    });
    return data;
  });

  fastify.get('/:packageName/:version', async (request) => {
    // @ts-ignore
    const { packageName, version } = request.params;
    const storage = fastify.storage;
    debug('pkg name %s, with version / tag: %s ', packageName, version);
    const data = await storage?.getPackageByOptions({
      name: packageName,
      // remove on refactor getPackageByOptions
      // @ts-ignore
      req: request.raw,
      version,
      uplinksLook: true,
      requestOptions: {
        protocol: request.protocol,
        headers: request.headers as any,
        host: request.hostname,
      },
    });
    return data;
  });
}

export default manifestRoute;
