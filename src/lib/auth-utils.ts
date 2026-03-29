import * as _ from 'lodash-es';

import { defaultSecurity } from '@verdaccio/config';
import { Config, Security } from '@verdaccio/types';

export function getSecurity(config: Config): Security {
  if (_.isNil(config.security) === false) {
    return _.merge(defaultSecurity, config.security);
  }

  return defaultSecurity;
}
