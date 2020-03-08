
import _ from 'lodash';
import path from 'path';

import {parseConfigFile} from '@verdaccio/utils';

/**
 * Override the default.yaml configuration file with any new config provided.
 */
function configExample(externalConfig, configFile: string = 'default.yaml', location: string = '') {
  const locationFile = location ? path.join(location, configFile) :
    path.join(__dirname, `./config/yaml/${configFile}`);
  const config = parseConfigFile(locationFile);

  return _.assign({}, _.cloneDeep(config), externalConfig);
}


export {
  configExample
}
