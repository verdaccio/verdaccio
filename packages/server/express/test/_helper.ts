import { Application } from 'express';
import path from 'node:path';

import { parseConfigFile } from '@verdaccio/config';
import { cryptoUtils, fileUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import apiMiddleware from '../src';

export const getConf = async (conf) => {
  const configPath = path.join(__dirname, 'config', conf);
  const config = parseConfigFile(configPath);
  // generate and create storage folder
  const storage = await fileUtils.createTempFolder('config');
  config.storage = storage;
  // custom config to avoid conflict with other tests
  config.auth.htpasswd.file = path.join(
    storage,
    `${config.auth.htpasswd.file}-${cryptoUtils.generateRandomHexString()}`
  );
  return config;
};

export async function initializeServer(configName): Promise<Application> {
  const config = await getConf(configName);
  setup(config.log ?? {});
  return apiMiddleware(config);
}
