import { Application } from 'express';
import path from 'node:path';

import apiMiddleware from '@verdaccio/api';
import { parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import { Storage } from '@verdaccio/store';
import { initializeServer as initializeServerHelper } from '@verdaccio/test-helper';

import routes from '../src';

setup({});

export const getConf = (configName: string) => {
  const configPath = path.join(__dirname, 'config', configName);
  return parseConfigFile(configPath);
};

// @deprecated
export async function initializeServer(configName): Promise<Application> {
  return initializeServerHelper(
    getConf(configName),
    [apiMiddleware, { async: true, routes }],
    Storage
  );
}
