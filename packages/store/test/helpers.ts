import buildDebug from 'debug';
import path from 'node:path';

import { parseConfigFile } from '@verdaccio/config';

const debug = buildDebug('verdaccio:mock:config');

/**
 * Override the default.yaml configuration file with any new config provided.
 */
function configExample(externalConfig: any = {}, configFile?: string, location?: string) {
  let config = {};
  if (location && configFile) {
    const locationFile = path.join(location, configFile);
    debug('config location: %s', locationFile);
    config = parseConfigFile(locationFile);
    debug('config file: %o', JSON.stringify(config));
  }
  return { ...externalConfig, ...config };
}

export { configExample };
