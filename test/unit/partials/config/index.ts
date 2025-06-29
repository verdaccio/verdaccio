import createDebug from 'debug';
import _ from 'lodash';
import path from 'node:path';

import { getDefaultConfig, parseConfigFile } from '@verdaccio/config';

const debug = createDebug('verdaccio:test:unit:config');

export default (options = {}, url) => {
  console.log('using config file', url);
  let config;
  if (url) {
    const locationFile = path.join(__dirname, `../config/yaml/${url}`);
    config = parseConfigFile(locationFile);
  } else {
    config = getDefaultConfig();
  }

  const extended = _.merge(config, options);
  debug('extended config', JSON.stringify(extended, null, 2));
  return extended;
};
