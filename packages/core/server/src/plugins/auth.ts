import fp from 'fastify-plugin';
import { Config as IConfig } from '@verdaccio/types';
import { Auth, IAuth } from '@verdaccio/auth';
import { FastifyInstance } from 'fastify';

export default fp(
  async function (fastify: FastifyInstance, opts: { config: IConfig; filters?: unknown }) {
    const { config } = opts;
    const auth: IAuth = new Auth(config);
    fastify.decorate('auth', auth);
  },
  {
    fastify: '>=3.x',
  }
);

declare module 'fastify' {
  interface FastifyInstance {
    auth: IAuth;
  }
}
