import createDebug from 'debug';
import _ from 'lodash';
import path from 'node:path';

import { getDefaultConfig, parseConfigFile } from '@verdaccio/config';

const debug = createDebug('verdaccio:test:unit:config');

export default (options = {}, url: string | undefined = undefined, mergeWithDefault = false) => {
  let config;
  if (url) {
    const locationFile = path.join(__dirname, `../config/yaml/${url}`);
    debug('location file', locationFile);
    config = parseConfigFile(locationFile);
    if (mergeWithDefault) {
      // merge with default config
      config = _.merge(getDefaultConfig(), config);
    }
  } else {
    config = getDefaultConfig();
  }

  const extended = _.merge(config, options);
  debug('extended config', JSON.stringify(extended, null, 2));
  return extended;
};
