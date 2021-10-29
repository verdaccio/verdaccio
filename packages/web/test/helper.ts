import bodyParser from 'body-parser';
import express from 'express';
import { Application } from 'express';
import path from 'path';

import { Auth, IAuth } from '@verdaccio/auth';
import { Config, parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import { errorReportingMiddleware, final, handleError } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';

import routes from '../src';

setup([]);

const getConf = (configName: string) => {
  const configPath = path.join(__dirname, 'config', configName);
  return parseConfigFile(configPath);
};

export async function initializeServer(configName: string): Promise<Application> {
  const app = express();
  const config = new Config(getConf(configName));
  const storage = new Storage(config);
  await storage.init(config, []);
  const auth: IAuth = new Auth(config);
  // for parsing the body (login api)
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));
  // @ts-ignore
  app.use(errorReportingMiddleware);
  app.use(routes(config, auth, storage));
  // @ts-ignore
  app.use(handleError);
  // @ts-ignore
  app.use(final);
  return app;
}
