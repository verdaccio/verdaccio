import { Application } from 'express';
import path from 'path';

import { parseConfigFile } from '@verdaccio/config';
import { fileUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { generateRandomHexString } from '@verdaccio/utils';

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
    `${config.auth.htpasswd.file}-${generateRandomHexString()}`
  );
  return config;
};

export async function initializeServer(configName): Promise<Application> {
  const config = await getConf(configName);
  await setup(config.log ?? {});
  return apiMiddleware(config);
}
