import buildDebug from 'debug';
import fs from 'fs';
import YAML from 'js-yaml';
import { isObject } from 'lodash';

import { APP_ERROR } from '@verdaccio/core';
import { ConfigYaml } from '@verdaccio/types';

import { fileExists } from './config-utils';

const debug = buildDebug('verdaccio:config:parse');

/**
 * Parse a config file from yaml to JSON.
 * @param configPath the absolute path of the configuration file
 */
export function parseConfigFile(configPath: string): ConfigYaml & {
  // @deprecated use configPath instead
  config_path: string;
  configPath: string;
} {
  debug('parse config file %s', configPath);
  if (!fileExists(configPath)) {
    throw new Error(`config file does not exist or not reachable`);
  }
  debug('parsing config file: %o', configPath);
  try {
    if (/\.ya?ml$/i.test(configPath)) {
      const yamlConfig = YAML.load(fs.readFileSync(configPath, 'utf8'), {
        strict: false,
      }) as ConfigYaml;

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
      debug('config module not found %o error: %o', configPath, e.message);
      throw Error(APP_ERROR.CONFIG_NOT_VALID);
    }

    throw e;
  }
}

export function fromJStoYAML(config: Partial<ConfigYaml>): string | null {
  debug('convert config from JSON to YAML');
  if (isObject(config)) {
    return YAML.dump(config);
  } else {
    throw new Error(`config is not a valid object`);
  }
}
