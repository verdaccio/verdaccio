import fs from 'fs';
import YAML from 'js-yaml';
import { APP_ERROR } from '@verdaccio/commons-api';
import { ConfigRuntime, ConfigYaml } from '@verdaccio/types';

/**
 * Parse a config file from yaml to JSON.
 * @param configPath the absolute path of the configuration file
 */
export function parseConfigFile(configPath: string): ConfigRuntime {
  try {
    if (/\.ya?ml$/i.test(configPath)) {
      const yamlConfig = YAML.safeLoad(fs.readFileSync(configPath, 'utf8')) as ConfigYaml;
      return Object.assign({}, yamlConfig, {
        configPath,
        // @deprecated use configPath instead
        config_path: configPath,
      });
    }

    const jsonConfig = require(configPath) as ConfigYaml;
    return Object.assign({}, jsonConfig, {
      configPath,
      // @deprecated use configPath instead
      config_path: configPath,
    });
  } catch (e: any) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = APP_ERROR.CONFIG_NOT_VALID;
    }

    throw e;
  }
}
