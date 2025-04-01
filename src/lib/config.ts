import { Config as ConfigCore } from '@verdaccio/config';
import { getMatchedPackagesSpec } from '@verdaccio/utils';

class Config extends ConfigCore {
  public constructor(config: any) {
    config.configPath = config.self_path;
    super(config, { forceMigrateToSecureLegacySignature: false });
    // Temporary solution for plugins that depends on legacy configuration files
    // @ts-ignore
    this.getMatchedPackagesSpec = (pkgName) => {
        return getMatchedPackagesSpec(pkgName, this.packages);
    }
  }
}

export default Config;
