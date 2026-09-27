import { initServer as _initServer, runServer as _runServer } from '@verdaccio/node-api';
import startServer from '@verdaccio/server';
import type { ConfigYaml } from '@verdaccio/types';

/**
 * Build a server without starting it. Resolves with a native http/https server,
 * so the caller decides the port and when to listen.
 */
export async function runServer(config?: string | ConfigYaml): Promise<any> {
  return _runServer(config, startServer);
}

/**
 * Build a server and start listening on `port`, or on the address from the configuration.
 */
export async function initServer(
  config: ConfigYaml,
  port: string | void,
  version: string,
  pkgName: string
): Promise<void> {
  return _initServer(config, port, version, pkgName, startServer);
}

export { ConfigBuilder, parseConfigFile, getDefaultConfig, Config } from '@verdaccio/config';

export default runServer;
