import { Application } from 'express';
import path from 'node:path';

// import apiMiddleware from '@verdaccio/api';
import { parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
// import { Storage } from '@verdaccio/store';
import { initializeServer as initializeServerHelper } from '@verdaccio/test-helper';

import apiEndpoint from '../../../src/api/endpoint';
import routes from '../../../src/api/web/index';
import Storage from '../../../src/lib/storage';

setup({});

export const getConf = (configName: string) => {
  const configPath = path.normalize(path.join(__dirname, configName));
  return parseConfigFile(configPath);
};

// @deprecated
export async function initializeServer(configName: string): Promise<Application> {
  return initializeServerHelper(
    getConf(configName),
    [apiEndpoint, { async: true, routes }],
    Storage
  );
}
