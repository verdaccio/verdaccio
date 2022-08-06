import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { Auth, IAuth } from '@verdaccio/auth';
import { Config as IConfig } from '@verdaccio/types';

export default fp(
  async function (fastify: FastifyInstance, opts: { config: IConfig; filters?: unknown }) {
    const { config } = opts;
    const auth: IAuth = new Auth(config);
    fastify.decorate('auth', auth);
  },
  {
    fastify: '>=4.x',
  }
);

declare module 'fastify' {
  interface FastifyInstance {
    auth: IAuth;
  }
}
