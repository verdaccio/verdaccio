'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CONFIG_FILE = 'config.yaml';
const XDG = 'xdg';
const WIN = 'win';
const WIN32 = 'win32';
const pkgJSON = require('../../package.json');

/**
 * Find and get the first config file that match.
 * @return {String} the config file path
 */
function findConfigFile(configPath) {
  if (_lodash2.default.isNil(configPath) === false) {
    return _path2.default.resolve(configPath);
  }

  const configPaths = getConfigPaths();

  if (_lodash2.default.isEmpty(configPaths)) {
    throw new Error('no configuration files can be proccesed');
  }

  const primaryConf = _lodash2.default.find(configPaths, configLocation => (0, _utils.fileExists)(configLocation.path));
  if (_lodash2.default.isNil(primaryConf) === false) {
    return primaryConf.path;
  }

  return createConfigFile(_lodash2.default.head(configPaths)).path;
}

function createConfigFile(configLocation) {
  createConfigFolder(configLocation);

  const defaultConfig = updateStorageLinks(configLocation, readDefaultConfig());

  _fs2.default.writeFileSync(configLocation.path, defaultConfig);

  return configLocation;
}

function readDefaultConfig() {
  return _fs2.default.readFileSync(require.resolve('../../conf/default.yaml'), 'utf8');
}

function createConfigFolder(configLocation) {
  _mkdirp2.default.sync(_path2.default.dirname(configLocation.path));
  _logger2.default.logger.info({ file: configLocation.path }, 'Creating default config file in @{file}');
}

function updateStorageLinks(configLocation, defaultConfig) {
  if (configLocation.type !== XDG) {
    return defaultConfig;
  }

  // $XDG_DATA_HOME defines the base directory relative to which user specific data files should be stored,
  // If $XDG_DATA_HOME is either not set or empty, a default equal to $HOME/.local/share should be used.
  // $FlowFixMe
  let dataDir = process.env.XDG_DATA_HOME || _path2.default.join(process.env.HOME, '.local', 'share');
  if ((0, _utils.folder_exists)(dataDir)) {
    dataDir = _path2.default.resolve(_path2.default.join(dataDir, pkgJSON.name, 'storage'));
    return defaultConfig.replace(/^storage: .\/storage$/m, `storage: ${dataDir}`);
  } else {
    return defaultConfig;
  }
}

function getConfigPaths() {
  return [getXDGDirectory(), getWindowsDirectory(), getRelativeDefaultDirectory(), getOldDirectory()].filter(path => !!path);
}

const getXDGDirectory = () => {
  const XDGConfig = getXDGHome() || process.env.HOME && _path2.default.join(process.env.HOME, '.config');

  if (XDGConfig && (0, _utils.folder_exists)(XDGConfig)) {
    return {
      path: _path2.default.join(XDGConfig, pkgJSON.name, CONFIG_FILE),
      type: XDG
    };
  }
};

const getXDGHome = () => process.env.XDG_CONFIG_HOME;

const getWindowsDirectory = () => {
  if (process.platform === WIN32 && process.env.APPDATA && (0, _utils.folder_exists)(process.env.APPDATA)) {
    return {
      path: _path2.default.resolve(_path2.default.join(process.env.APPDATA, pkgJSON.name, CONFIG_FILE)),
      type: WIN
    };
  }
};

const getRelativeDefaultDirectory = () => {
  return {
    path: _path2.default.resolve(_path2.default.join('.', pkgJSON.name, CONFIG_FILE)),
    type: 'def'
  };
};

const getOldDirectory = () => {
  return {
    path: _path2.default.resolve(_path2.default.join('.', CONFIG_FILE)),
    type: 'old'
  };
};

exports.default = findConfigFile;