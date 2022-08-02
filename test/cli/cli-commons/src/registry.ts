/* eslint-disable prefer-promise-reject-errors */
import buildDebug from 'debug';
import { Registry } from 'verdaccio';

import { getDefaultConfig } from '@verdaccio/config';

const debug = buildDebug('verdaccio:e2e:registry-utils');

export type Setup = {
  registry: Registry;
  tempFolder: string;
};

export async function initialSetup(): Promise<Setup> {
  const { configPath, tempFolder } = await Registry.fromConfigToPath(getDefaultConfig());
  debug(`configPath %o`, configPath);
  debug(`tempFolder %o`, tempFolder);
  const registry = new Registry(configPath);
  return { registry, tempFolder };
}
