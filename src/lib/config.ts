import { Config as ConfigCore } from '@verdaccio/config';
import { getMatchedPackagesSpec } from '@verdaccio/utils';

class Config extends ConfigCore {
  public constructor(config: any) {
    config.configPath = config.self_path;
    super(config, { forceMigrateToSecureLegacySignature: false });
    // Temporary solution for plugins that depepends of legacy configuration files
    // @ts-ignore
    this.getMatchedPackagesSpec = getMatchedPackagesSpec;
  }
}

export default Config;
