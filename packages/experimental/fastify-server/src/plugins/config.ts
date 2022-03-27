import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { Config as AppConfig } from '@verdaccio/config';
import { ConfigRuntime, Config as IConfig } from '@verdaccio/types';

export default fp(
  async function (fastify: FastifyInstance, opts: { config: ConfigRuntime }) {
    const { config } = opts;
    const configInstance: IConfig = new AppConfig(Object.assign({}, config));
    fastify.decorate('configInstance', configInstance);
  },
  {
    fastify: '>=3.x',
  }
);

declare module 'fastify' {
  interface FastifyInstance {
    configInstance: IConfig;
  }
}
