import { Config as ConfigCore } from '@verdaccio/config';
import { authUtils } from '@verdaccio/core';

class Config extends ConfigCore {
  public constructor(config: any) {
    config.configPath = config.self_path;
    super(config);
    // Temporary solution for plugins that depends on legacy configuration files
    this.getMatchedPackagesSpec = (pkgName) => {
      return authUtils.getMatchedPackagesSpec(pkgName, this.packages);
    };
  }
}

export default Config;
