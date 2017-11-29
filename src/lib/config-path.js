import fs from 'fs';
import _ from 'lodash';
import Path from 'path';
import logger from './logger';
import mkdirp from 'mkdirp';

import {folder_exists, file_exists} from './utils';

const CONFIG_FILE = 'config.yaml';
const XDG = 'xdg';
const WIN = 'win';
const WIN32 = 'win32';
const pkgJson = require('../../package.json');

/**
 * Find and get the first config file that match.
 * @return {String} the config file path
 */
function findConfigFile() {
  const configPaths = getConfigPaths();

  if (_.isEmpty(configPaths)) {
    throw new Error('no configuration files can be proccesed');
  }

  const primaryConf = _.find(configPaths, (configLocation) => file_exists(configLocation.path));
  if (_.isNil(primaryConf) === false) {
    return primaryConf.path;
  }

  return createConfigFile(_.head(configPaths)).path;
}

function createConfigFile(configLocation) {
  createConfigFolder(configLocation);

  const defaultConfig = updateStorageLinks(configLocation, readDefaultConfig());

  fs.writeFileSync(configLocation.path, defaultConfig);

  return configLocation;
}

function readDefaultConfig() {
  return fs.readFileSync(require.resolve('../../conf/default.yaml'), 'utf8');
}

function createConfigFolder(configLocation) {
  mkdirp.sync(Path.dirname(configLocation.path));
  logger.logger.info({file: configLocation.path}, 'Creating default config file in @{file}');
}

function updateStorageLinks(configLocation, defaultConfig) {
    console.log(defaultConfig);
    if (configLocation.type !== XDG) {
        return defaultConfig;
    }

    // $XDG_DATA_HOME defines the base directory relative to which user specific data files should be stored,
    // If $XDG_DATA_HOME is either not set or empty, a default equal to $HOME/.local/share should be used.
    let dataDir = process.env.XDG_DATA_HOME || Path.join(process.env.HOME, '.local', 'share');
    if (folder_exists(dataDir)) {
      dataDir = Path.resolve(Path.join(dataDir, pkgJson.name, 'storage'));
      return defaultConfig.replace(/^storage: .\/storage$/m, `storage: ${dataDir}`);
    } else {
      return defaultConfig;
    }
}

function getConfigPaths() {
  return _.filter([getXDGDirectory(), getWindowsDirectory(), getRelativeDefaultDirectory(), getOldDirectory()]);
}

const getXDGDirectory = () => {
  const xdgConfig = getXDGHome() ||
        process.env.HOME && Path.join(process.env.HOME, '.config');

  if (xdgConfig && folder_exists(xdgConfig)) {
    return {
      path: Path.join(xdgConfig, pkgJson.name, CONFIG_FILE),
      type: XDG,
    };
  }
};

const getXDGHome = () => process.env.XDG_CONFIG_HOME;

const getWindowsDirectory = () => {
  if (process.platform === WIN32 && process.env.APPDATA && folder_exists(process.env.APPDATA)) {
    return {
      path: Path.resolve(Path.join(process.env.APPDATA, pkgJson.name, CONFIG_FILE)),
      type: WIN,
    };
  }
};

const getRelativeDefaultDirectory = () => {
  return {
    path: Path.resolve(Path.join('.', pkgJson.name, CONFIG_FILE)),
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
