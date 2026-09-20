import buildDebug from 'debug';
import { CORE_SCHEMA, Schema, YAMLException, dump, load, mergeTag } from 'js-yaml';
import { isObject } from 'lodash-es';
import fs from 'node:fs';

import { API_ERROR, APP_ERROR } from '@verdaccio/core';
import type { ConfigYaml } from '@verdaccio/types';

import { findConfigFile } from './config-path';
import { fileExists } from './config-utils';

const debug = buildDebug('verdaccio:config:parse');

/**
 * js-yaml v5 defaults to the YAML 1.2 CORE_SCHEMA, which no longer resolves
 * merge keys (`<<`). Extend it with the merge tag so anchors + `<<` used to
 * share settings across config sections keep working as they did on v4.
 */
const CONFIG_SCHEMA = new Schema([...CORE_SCHEMA.tags, mergeTag]);

/**
 * Load YAML config content, tolerating a documentless file.
 *
 * js-yaml v5 throws on an empty document (an empty, whitespace-only, or
 * comment-only file), whereas v4 returned `undefined`. Preserve the v4
 * behavior by treating such a file as an empty config object.
 */
function loadYamlConfig(content: string): ConfigYaml {
  try {
    return (load(content, { schema: CONFIG_SCHEMA }) as ConfigYaml) ?? ({} as ConfigYaml);
  } catch (err: any) {
    if (
      err instanceof YAMLException &&
      err.reason === 'expected a document, but the input is empty'
    ) {
      return {} as ConfigYaml;
    }
    throw err;
  }
}

/**
 * Parse a YAML config file.
 * @param configPath the absolute path of the configuration file (must end in .yaml or .yml)
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
  if (!/\.ya?ml$/i.test(configPath)) {
    throw new Error(`config file must be a YAML file (.yaml or .yml)`);
  }
  debug('parsing config file: %o', configPath);
  try {
    const yamlConfig = loadYamlConfig(fs.readFileSync(configPath, 'utf8'));

    return Object.assign({}, yamlConfig, {
      configPath,
      // @deprecated use configPath instead
      config_path: configPath,
    });
  } catch (e: any) {
    debug('failed to parse config %o error: %o', configPath, e.message);
    throw new Error(APP_ERROR.CONFIG_NOT_VALID, { cause: e });
  }
}

export function fromJStoYAML(config: Partial<ConfigYaml>): string | null {
  debug('convert config from JSON to YAML');
  if (isObject(config)) {
    return dump(config);
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
 *
 * @param {string | ConfigYaml} [config] - Optional. A path to the configuration file (string),
 *                                         a pre-parsed config object, or `undefined`.
 * @returns {ConfigYaml} The parsed configuration object.
 * @throws {Error} If the provided config is neither a string, undefined, nor an object.
 */
export function getConfigParsed(config?: string | ConfigYaml): ConfigYaml {
  debug('getConfigParsed called with config: %o', typeof config);
  let configurationParsed: ConfigYaml;
  if (config === undefined || typeof config === 'string') {
    debug('using default configuration');
    const configPathLocation = findConfigFile(config);
    configurationParsed = parseConfigFile(configPathLocation);
  } else if (typeof config === 'object' && config !== null) {
    configurationParsed = config;

    // When config is provided as an object (programmatic API), ensure configPath
    // is set so the Config constructor does not throw.
    if (!configurationParsed.configPath) {
      configurationParsed.configPath = process.cwd();
    }
  } else {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }
  return configurationParsed;
}
