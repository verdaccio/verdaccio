import buildDebug from 'debug';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

import { CHARACTER_ENCODING } from '@verdaccio/core';

import { fileExists, folderExists } from './config-utils';

const CONFIG_FILE = 'config.yaml';
const XDG = 'xdg';
const WIN = 'win';
const WIN32 = 'win32';
// eslint-disable-next-line
const pkgJSON = {
  name: 'verdaccio',
};

export type SetupDirectory = {
  path: string;
  type: string;
};

const debug = buildDebug('verdaccio:config');

/**
 * Find and get the first config file that match.
 * @return {String} the config file path
 */
function findConfigFile(configPath?: string): string {
  // console.log(process.env);
  if (typeof configPath !== 'undefined') {
    return path.resolve(configPath);
  }

  const configPaths: SetupDirectory[] = getConfigPaths();
  debug('%o posible locations found', configPaths.length);
  if (_.isEmpty(configPaths)) {
    // this should never happens
    throw new Error('no configuration files can be processed');
  }

  // find the first location that already exist
  const primaryConf: SetupDirectory | void = _.find(configPaths, (configLocation: SetupDirectory) =>
    fileExists(configLocation.path)
  );

  if (typeof primaryConf !== 'undefined') {
    debug('previous location exist already %s', primaryConf?.path);
    return primaryConf.path;
  }

  // @ts-ignore
  return createConfigFile(_.head(configPaths)).path;
}

function createConfigFile(configLocation: SetupDirectory): SetupDirectory {
  createConfigFolder(configLocation);

  const defaultConfig = updateStorageLinks(configLocation, readDefaultConfig());

  fs.writeFileSync(configLocation.path, defaultConfig);

  return configLocation;
}

export function readDefaultConfig(): Buffer {
  const pathDefaultConf: string = path.resolve(__dirname, 'conf/default.yaml');
  try {
    debug('default configuration file %s', pathDefaultConf);
    fs.accessSync(pathDefaultConf, fs.constants.R_OK);
  } catch {
    throw new TypeError('configuration file does not have enough permissions for reading');
  }
  // @ts-ignore
  return fs.readFileSync(pathDefaultConf, CHARACTER_ENCODING.UTF8);
}

function createConfigFolder(configLocation): void {
  fs.mkdirSync(path.dirname(configLocation.path), { recursive: true });
  debug(`Creating default config file in %o`, configLocation?.path);
}

function updateStorageLinks(configLocation, defaultConfig): string {
  if (configLocation.type !== XDG) {
    return defaultConfig;
  }

  // $XDG_DATA_HOME defines the base directory relative to which user specific data
  // files should be stored, If $XDG_DATA_HOME is either not set or empty, a default
  // equal to $HOME/.local/share should be used.
  let dataDir =
    process.env.XDG_DATA_HOME || path.join(process.env.HOME as string, '.local', 'share');
  if (folderExists(dataDir)) {
    debug(`previous storage located`);
    debug(`update storage links to %s`, dataDir);
    dataDir = path.resolve(path.join(dataDir, pkgJSON.name, 'storage'));
    return defaultConfig.replace(/^storage: .\/storage$/m, `storage: ${dataDir}`);
  }
  debug(`could not find a previous storage location, skip override`);
  return defaultConfig;
}

/**
 * Return a list of configuration locations by platform.
 * @returns
 */
function getConfigPaths(): SetupDirectory[] {
  const listPaths: (SetupDirectory | void)[] = [
    getXDGDirectory(),
    getWindowsDirectory(),
    getRelativeDefaultDirectory(),
    getOldDirectory(),
  ];

  return listPaths.reduce(function (acc, currentValue: SetupDirectory | void): SetupDirectory[] {
    if (typeof currentValue !== 'undefined') {
      debug('directory detected path %s for type %s', currentValue?.path, currentValue.type);
      acc.push(currentValue);
    }
    return acc;
  }, [] as SetupDirectory[]);
}

/**
 * Get XDG_CONFIG_HOME or HOME location (usually unix)
 * @returns
 */
const getXDGDirectory = (): SetupDirectory | void => {
  const xDGConfigPath =
    process.env.XDG_CONFIG_HOME || (process.env.HOME && path.join(process.env.HOME, '.config'));
  if (xDGConfigPath && folderExists(xDGConfigPath)) {
    debug('XDGConfig folder path %s', xDGConfigPath);
    return {
      path: path.join(xDGConfigPath, pkgJSON.name, CONFIG_FILE),
      type: XDG,
    };
  }
};

/**
 * Detect windows location, APPDATA
 * usually something like C:\User\<Build User>\AppData\Local
 * @returns
 */
const getWindowsDirectory = (): SetupDirectory | void => {
  if (process.platform === WIN32 && process.env.APPDATA && folderExists(process.env.APPDATA)) {
    debug('is windows appdata: %s', process.env.APPDATA);
    return {
      path: path.resolve(path.join(process.env.APPDATA, pkgJSON.name, CONFIG_FILE)),
      type: WIN,
    };
  }
};

/**
 * Return relative directory, this is the default.
 * It will cretate config in your {currentLocation/verdaccio/config.yaml}
 * @returns
 */
const getRelativeDefaultDirectory = (): SetupDirectory => {
  return {
    path: path.resolve(path.join('.', pkgJSON.name, CONFIG_FILE)),
    type: 'def',
  };
};

/**
 * This should never happens, consider it DEPRECATED
 * @returns
 */
const getOldDirectory = (): SetupDirectory => {
  return {
    path: path.resolve(path.join('.', CONFIG_FILE)),
    type: 'old',
  };
};

export { findConfigFile };
