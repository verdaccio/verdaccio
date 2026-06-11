import type { Application } from 'express';
import path from 'node:path';

import apiEndpoint from '@verdaccio/api';
import { parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import { initializeServer as initializeServerHelper } from '@verdaccio/test-helper';
import webMiddleware from '@verdaccio/web';

// 7.x's Storage wrapper (adds legacy callback storage-plugin support on top of
// @verdaccio/store); the api/web routers come straight from the published packages.
import Storage from '../../../src/lib/storage';

setup({});

export const getConf = (configName: string) => {
  const configPath = path.normalize(path.join(__dirname, configName));
  return parseConfigFile(configPath);
};

export async function initializeServer(configName: string): Promise<Application> {
  return initializeServerHelper(
    getConf(configName),
    [apiEndpoint, { async: true, routes: webMiddleware }],
    Storage
  );
}
