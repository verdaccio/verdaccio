import buildDebug from 'debug';
import _ from 'lodash';
import path from 'path';

import { parseConfigFile } from '@verdaccio/config';
import { ConfigYaml } from '@verdaccio/types';

const debug = buildDebug('verdaccio:mock:config');

/**
 * Override the default.yaml configuration file with any new config provided.
 */
function configExample(
  externalConfig: Partial<ConfigYaml> = {},
  configFile: string,
  location: string = ''
) {
  const locationFile = location
    ? path.join(location, configFile)
    : path.join(__dirname, `./config/yaml/${configFile}`);
  debug('config location: %s', locationFile);
  const config = parseConfigFile(locationFile);
  debug('config file: %o', JSON.stringify(config));
  return _.assign({}, _.cloneDeep(config), externalConfig);
}

export { configExample };
