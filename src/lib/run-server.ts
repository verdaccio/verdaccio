import * as _ from 'lodash-es';

import { initServer as initServerNode, runServer as runServerNode } from '@verdaccio/node-api';
import { defineAPI } from '@verdaccio/server';
import { ConfigYaml, Config as IConfig } from '@verdaccio/types';

import AppConfig from './config';
import { logger } from './logger';
import Storage from './storage';
import { initLogger } from './utils';

/**
 * Build the Express app from a raw config by reusing @verdaccio/server's
 * composition (defineAPI), but inject 7.x's Storage so legacy callback storage
 * plugins keep working. Exposed for tests that need the app without a listener.
 */
export async function endPointAPI(configHash: ConfigYaml): Promise<any> {
  const appConfig: IConfig = new AppConfig(_.cloneDeep(configHash));
  const storage = new Storage(appConfig, logger);
  await storage.init(appConfig);
  return defineAPI(appConfig, storage as any);
}

/**
 * Server factory passed to @verdaccio/node-api / @verdaccio/cli: maps the
 * deprecated `logs` config key then builds the app with 7.x's legacy-aware
 * Storage (via {@link endPointAPI}).
 */
export async function startServer(config: ConfigYaml): Promise<any> {
  await initLogger(config);
  return endPointAPI(config);
}

/**
 * Exposes a server factory to be instantiated programmatically.
 *
    ```ts
    const app = await runServer(); // default configuration
    const app = await runServer('./config/config.yaml');
    const app = await runServer({ configuration });
    app.listen(4000, (event) => {
      // do something
    });
    ```
 * @param config
 */
export async function runServer(config?: string | ConfigYaml): Promise<any> {
  return runServerNode(config, startServer);
}

/**
 * Start the server on the port defined (or the port defined in the config file)
 * @param config
 * @param port
 * @param version
 * @param pkgName
 */
export async function initServer(
  config: ConfigYaml,
  port: string | void,
  version: string,
  pkgName: string
): Promise<void> {
  return initServerNode(config, port, version, pkgName, startServer);
}
