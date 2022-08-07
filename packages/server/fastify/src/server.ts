import buildDebug from 'debug';
import fastify from 'fastify';

import { Config as AppConfig, createAnonymousRemoteUser } from '@verdaccio/config';
import { logger } from '@verdaccio/logger';
import { ConfigYaml, Config as IConfig, RemoteUser } from '@verdaccio/types';

import distTags from './endpoints/dist-tags';
import manifest from './endpoints/manifest';
import ping from './endpoints/ping';
import search from './endpoints/search';
import tarball from './endpoints/tarball';
import user from './endpoints/user';
import whoami from './endpoints/whoami';
import authPlugin from './plugins/auth';
import configPlugin from './plugins/config';
import coreUtils from './plugins/coreUtils';
import storagePlugin from './plugins/storage';
import login from './routes/web/api/login';
import readme from './routes/web/api/readme';
import sidebar from './routes/web/api/sidebar';

const debug = buildDebug('verdaccio:fastify');
enum PREFIX {
  WEB = '/-/verdaccio',
  USER = '/-/user',
}

async function startServer(config: ConfigYaml): Promise<any> {
  // eslint-disable-next-line prettier/prettier
  const configInstance: IConfig = new AppConfig({ ...config } as any);
  debug('start fastify server');
  const fastifyInstance = fastify({ logger });
  fastifyInstance.addHook('onRequest', (request, reply, done) => {
    request.userRemote = createAnonymousRemoteUser();
    done();
  });
  fastifyInstance.register(coreUtils);
  fastifyInstance.register(configPlugin, { config });
  fastifyInstance.register(storagePlugin, { config: configInstance });
  fastifyInstance.register(authPlugin, { config: configInstance });

  // api
  fastifyInstance.register((instance, opts, done) => {
    instance.register(ping);
    instance.register(user, { prefix: PREFIX.USER });
    instance.register(search);
    instance.register(whoami);
    instance.register(manifest);
    instance.register(tarball);
    instance.register(distTags);
    instance.register(readme, { prefix: PREFIX.WEB });
    instance.register(sidebar, { prefix: PREFIX.WEB });
    instance.register(login, { prefix: PREFIX.WEB });

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
    userRemote: RemoteUser;
  }
}

export default startServer;
