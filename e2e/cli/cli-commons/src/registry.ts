/* eslint-disable prefer-promise-reject-errors */
import buildDebug from 'debug';
import getPort from 'get-port';
import { merge } from 'lodash';
import { Registry } from 'verdaccio';

import { getDefaultConfig } from '@verdaccio/config';
import { ConfigYaml } from '@verdaccio/types';

const debug = buildDebug('verdaccio:e2e:registry-utils');

export type Setup = {
  registry: Registry;
  tempFolder: string;
};

const log =
  process.env.NODE_ENV === 'production'
    ? { type: 'stdout', format: 'json', level: 'warn' }
    : { type: 'stdout', format: 'pretty', level: 'info' };

const defaultConfig = {
  ...getDefaultConfig(),
  log,
};

export function getConfigPath(customConfig) {
  return Registry.fromConfigToPath({
    ...customConfig,
    _debug: true,
  });
}

export async function initialSetup(customConfig?: ConfigYaml): Promise<Setup> {
  const config = merge(defaultConfig, customConfig);
  const { configPath, tempFolder } = await getConfigPath(config);
  debug(`configPath %o`, configPath);
  debug(`tempFolder %o`, tempFolder);
  const port = await getPort();
  const registry = new Registry(configPath, { createUser: true, port });
  return { registry, tempFolder };
}
