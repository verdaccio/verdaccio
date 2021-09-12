import { Config as IConfig } from '@verdaccio/types';
import { Config as AppConfig } from '@verdaccio/config';

import fastify from 'fastify';
import buildDebug from 'debug';
import fp from 'fastify-plugin';

import ping from './endpoints/ping';
import search from './endpoints/search';
import { storageService } from './plugins/storage';

const debug = buildDebug('verdaccio:fastify');

async function startServer({ logger, config }) {
  const configInstance: IConfig = new AppConfig(Object.assign({}, config));
  debug('start server');
  const app = fastify({ logger });

  app.decorate('config', configInstance);
  app.register(fp(storageService), { config: configInstance });

  // api
  app.register((instance, opts, done) => {
    instance.decorate('utility', new Map());
    instance.register(ping);
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
