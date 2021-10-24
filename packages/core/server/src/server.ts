import { Config as IConfig, RemoteUser } from '@verdaccio/types';
import { Config as AppConfig, createAnonymousRemoteUser } from '@verdaccio/config';

import fastify from 'fastify';
import buildDebug from 'debug';

import search from './endpoints/search';
import storagePlugin from './plugins/storage';
import authPlugin from './plugins/auth';
import coreUtils from './plugins/coreUtils';
import configPlugin from './plugins/config';
import ping from './endpoints/ping';
import user from './endpoints/user';

const debug = buildDebug('verdaccio:fastify');

async function startServer({ logger, config }) {
  // eslint-disable-next-line prettier/prettier
  const configInstance: IConfig = new AppConfig(Object.assign({}, config));
  debug('start server');
  const fastifyInstance = fastify({ logger });
  fastifyInstance.decorateRequest<RemoteUser>('userRemote', createAnonymousRemoteUser());
  fastifyInstance.register(configPlugin, { config });
  fastifyInstance.register(coreUtils);
  fastifyInstance.register(authPlugin, { config: configInstance });
  fastifyInstance.register(storagePlugin, { config: configInstance });

  // api
  fastifyInstance.register((instance, opts, done) => {
    instance.register(ping);
    instance.register(user, { prefix: '/-/user' });
    instance.register(search);
    done();
  });

  // web
  fastifyInstance.register((instance, opts, done) => {
    instance.register(ping, { prefix: '/web' });
    done();
  });

  return fastifyInstance;
}

declare module 'fastify' {
  interface FastifyRequest {
    userRemote: any;
  }
}

export default startServer;
