
import _ from 'lodash';

import {getDefaultConfig} from '@verdaccio/config';

export default (options = {}, url = 'default.yaml') => {
  console.log('using config file', url);
  const config = getDefaultConfig()

  return _.assign({}, _.cloneDeep(config), options);
}
