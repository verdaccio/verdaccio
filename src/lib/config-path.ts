/**
 * @prettier
 * @flow
 */

import fs from 'fs';
import _ from 'lodash';
import Path from 'path';
import { logger } from './logger';
import mkdirp from 'mkdirp';

import { folderExists, fileExists } from './utils';
import { CHARACTER_ENCODING } from './constants';

const CONFIG_FILE = 'config.yaml';
const XDG = 'xdg';
const WIN = 'win';
const WIN32 = 'win32';
const pkgJSON = require('../../package.json');

/**
 * Find and get the first config file that match.
 * @return {String} the config file path
 */
function findConfigFile(configPath: any) {
  if (_.isNil(configPath) === false) {
    return Path.resolve(configPath);
  }

  const configPaths = getConfigPaths();

  if (_.isEmpty(configPaths)) {
    throw new Error('no configuration files can be processed');
  }

  const primaryConf: any = _.find(configPaths, (configLocation: any) => fileExists(configLocation.path));
  if (_.isNil(primaryConf) === false) {
    return primaryConf.path;
  }

  return createConfigFile(_.head(configPaths)).path;
}

function createConfigFile(configLocation: any) {
  createConfigFolder(configLocation);

  const defaultConfig = updateStorageLinks(configLocation, readDefaultConfig());

  fs.writeFileSync(configLocation.path, defaultConfig);

  return configLocation;
}

function readDefaultConfig() {
  return fs.readFileSync(require.resolve('../../conf/default.yaml'), CHARACTER_ENCODING.UTF8);
}

function createConfigFolder(configLocation) {
  mkdirp.sync(Path.dirname(configLocation.path));
  logger.info({ file: configLocation.path }, 'Creating default config file in @{file}');
}

function updateStorageLinks(configLocation, defaultConfig) {
  if (configLocation.type !== XDG) {
    return defaultConfig;
  }

  // $XDG_DATA_HOME defines the base directory relative to which user specific data files should be stored,
  // If $XDG_DATA_HOME is either not set or empty, a default equal to $HOME/.local/share should be used.
  // $FlowFixMe
  let dataDir = process.env.XDG_DATA_HOME || Path.join(process.env.HOME as string, '.local', 'share');
  if (folderExists(dataDir)) {
    dataDir = Path.resolve(Path.join(dataDir, pkgJSON.name, 'storage'));
    return defaultConfig.replace(/^storage: .\/storage$/m, `storage: ${dataDir}`);
  } else {
    return defaultConfig;
  }
}

function getConfigPaths() {
  return [getXDGDirectory(), getWindowsDirectory(), getRelativeDefaultDirectory(), getOldDirectory()].filter(path => !!path);
}

const getXDGDirectory = () => {
  const XDGConfig = getXDGHome() || (process.env.HOME && Path.join(process.env.HOME, '.config'));

  if (XDGConfig && folderExists(XDGConfig)) {
    return {
      path: Path.join(XDGConfig, pkgJSON.name, CONFIG_FILE),
      type: XDG,
    };
  }
};

const getXDGHome = () => process.env.XDG_CONFIG_HOME;

const getWindowsDirectory = () => {
  if (process.platform === WIN32 && process.env.APPDATA && folderExists(process.env.APPDATA)) {
    return {
      path: Path.resolve(Path.join(process.env.APPDATA, pkgJSON.name, CONFIG_FILE)),
      type: WIN,
    };
  }
};

const getRelativeDefaultDirectory = () => {
  return {
    path: Path.resolve(Path.join('.', pkgJSON.name, CONFIG_FILE)),
    type: 'def',
  };
};

const getOldDirectory = () => {
  return {
    path: Path.resolve(Path.join('.', CONFIG_FILE)),
    type: 'old',
  };
};

export default findConfigFile;
