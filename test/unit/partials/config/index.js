
import _ from 'lodash';
import path from 'path';

import {parseConfigFile} from '../../../../src/lib/utils';

/**
 * Override the default.yaml configuration file with any new config provided.
 */
export default (options, url = 'default.yaml') => {
  const locationFile = path.join(__dirname, `../config/yaml/${url}`);
  const config = parseConfigFile(locationFile);

  return _.assign({}, _.cloneDeep(config), options);
}
