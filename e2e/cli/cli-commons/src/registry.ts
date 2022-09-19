/* eslint-disable prefer-promise-reject-errors */
import buildDebug from 'debug';
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
    : { type: 'stdout', format: 'pretty', level: 'warn' };
const defaultConfig = {
  ...getDefaultConfig(),
  log,
};

export async function initialSetup(customConfig?: ConfigYaml): Promise<Setup> {
  // @ts-ignore
  const { configPath, tempFolder } = await Registry.fromConfigToPath({
    ...(customConfig
      ? customConfig
      : {
          ...defaultConfig,
          _debug: true,
        }),
  });
  debug(`configPath %o`, configPath);
  debug(`tempFolder %o`, tempFolder);
  const registry = new Registry(configPath);
  return { registry, tempFolder };
}
