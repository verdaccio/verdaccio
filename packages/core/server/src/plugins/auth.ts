import { Auth, IAuth } from '@verdaccio/auth';

export async function authService(fastify, opts, done) {
  const { config } = opts;
  const auth: IAuth = new Auth(config);
  fastify.decorate('auth', auth);
  done();
}
