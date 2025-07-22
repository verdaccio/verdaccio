import buildDebug from 'debug';
import YAML from 'js-yaml';
import { isObject } from 'lodash';
import fs from 'node:fs';
import path from 'node:path';

import { API_ERROR, APP_ERROR } from '@verdaccio/core';
import { ConfigYaml } from '@verdaccio/types';

import { findConfigFile } from './config-path';
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

/**
 * Parses and returns a configuration object of type `ConfigYaml`.
 *
 * If a string or `undefined` is provided, it is interpreted as a path to a config file
 * (or uses a default location). The config file is then loaded and parsed.
 * If an object is provided, it is assumed to be a pre-parsed configuration.
 * Backward compability: ensures the returned configuration object has a `self_path` property set,
 * either to the config file path or to a property within the object.
 *
 * @param {string | ConfigYaml} [config] - Optional. A path to the configuration file (string),
 *                                         a pre-parsed config object, or `undefined`.
 * @returns {ConfigYaml} The parsed configuration object with a guaranteed `self_path` property.
 * @throws {Error} If the provided config is neither a string, undefined, nor an object.
 */
export function getConfigParsed(config?: string | ConfigYaml): ConfigYaml {
  debug('getConfigParsed called with config: %o', typeof config);
  let configurationParsed: ConfigYaml;
  if (config === undefined || typeof config === 'string') {
    debug('using default configuration');
    const configPathLocation = findConfigFile(config);
    configurationParsed = parseConfigFile(configPathLocation);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!configurationParsed.self_path) {
      debug('self_path not defined, using config path location');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      configurationParsed.self_path = path.resolve(configPathLocation);
    }
  } else if (typeof config === 'object' && config !== null) {
    configurationParsed = config;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!configurationParsed.self_path) {
      debug('self_path not defined, using config path location');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      configurationParsed.self_path = configurationParsed.configPath;
    }
  } else {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }
  return configurationParsed;
}
