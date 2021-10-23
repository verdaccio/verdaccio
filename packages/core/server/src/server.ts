import { Config as IConfig } from '@verdaccio/types';
import { Config as AppConfig } from '@verdaccio/config';

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
  const app = fastify({ logger });
  app.register(configPlugin, { config });
  app.register(coreUtils);
  app.register(authPlugin, { config: configInstance });
  app.register(storagePlugin, { config: configInstance });

  // api
  app.register((instance, opts, done) => {
    instance.register(ping);
    instance.register(user, { prefix: '/-/user' });
    instance.register(search);
    done();
  });

  // web
  app.register((instance, opts, done) => {
    instance.register(ping, { prefix: '/web' });
    done();
  });

  return app;
}

export default startServer;
