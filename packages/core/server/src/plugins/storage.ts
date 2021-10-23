import fp from 'fastify-plugin';
import { Config as IConfig } from '@verdaccio/types';
import { Storage } from '@verdaccio/store';
import { FastifyInstance } from 'fastify';

export default fp(
  async function (fastify: FastifyInstance, opts: { config: IConfig; filters?: unknown }) {
    const { config } = opts;
    const storage: Storage = new Storage(config);
    // @ts-ignore
    await storage.init(config, {});
    fastify.decorate('storage', storage);
  },
  {
    fastify: '>=3.x',
  }
);

declare module 'fastify' {
  interface FastifyInstance {
    storage: Storage;
  }
}
