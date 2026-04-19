import { runServer as _runServer } from '@verdaccio/node-api';
import startServer from '@verdaccio/server';
import type { ConfigYaml } from '@verdaccio/types';

export async function runServer(config?: string | ConfigYaml): Promise<any> {
  return _runServer(config, startServer);
}
