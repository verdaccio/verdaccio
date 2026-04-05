import { initServer as initServerNode, runServer as runServerNode } from '@verdaccio/node-api';
import { ConfigYaml } from '@verdaccio/types';

import endPointAPI from '../api/index';
import { initLogger } from './utils';

async function startServer(config: ConfigYaml): Promise<any> {
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
