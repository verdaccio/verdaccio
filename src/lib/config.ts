import _ from 'lodash';

import { Config as ConfigCore } from '@verdaccio/config';

class Config extends ConfigCore {
  public constructor(config: any) {
    config.configPath = config.self_path;
    super(config, { forceMigrateToSecureLegacySignature: false });
  }
}

export default Config;
