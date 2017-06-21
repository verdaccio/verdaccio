'use strict';

const fs = require('fs');
const Path = require('path');
const logger = require('./logger');
const CONFIG_FILE = 'config.yaml';
const pkgJson = require('../../package.json');
/**
 * Find and get the first config file that match.
 * @return {String} the config file path
 */
function find_config_file() {
  const paths = get_paths();

  for (let i=0; i<paths.length; i++) {
    if (file_exists(paths[i].path)) return paths[i].path;
  }

  create_config_file(paths[0]);
  return paths[0].path;
}

/**
 * Create a default config file in your system.
 * @param {String} config_path
 */
function create_config_file(config_path) {
  require('mkdirp').sync(Path.dirname(config_path.path));
  logger.logger.info({file: config_path.path}, 'Creating default config file in @{file}');

  let created_config = fs.readFileSync(require.resolve('../../conf/default.yaml'), 'utf8');

  if (config_path.type === 'xdg') {
    // $XDG_DATA_HOME defines the base directory relative to which user specific data files should be stored,
    // If $XDG_DATA_HOME is either not set or empty, a default equal to $HOME/.local/share should be used.
    let data_dir = process.env.XDG_DATA_HOME|| Path.join(process.env.HOME, '.local', 'share');
    if (folder_exists(data_dir)) {
      data_dir = Path.resolve(Path.join(data_dir, pkgJson.name, 'storage'));
      created_config = created_config.replace(/^storage: .\/storage$/m, `storage: ${data_dir}`);
    }
  }

  fs.writeFileSync(config_path.path, created_config);
}

/**
 * Retrieve a list of possible config file locations.
 * @return {Array}
 */
function get_paths() {
  let try_paths = [];
  let xdg_config = process.env.XDG_CONFIG_HOME
                || process.env.HOME && Path.join(process.env.HOME, '.config');
  if (xdg_config && folder_exists(xdg_config)) {
    try_paths.push({
      path: Path.join(xdg_config, pkgJson.name, CONFIG_FILE),
      type: 'xdg',
    });
  }

  if (process.platform === 'win32' && process.env.APPDATA && folder_exists(process.env.APPDATA)) {
    try_paths.push({
      path: Path.resolve(Path.join(process.env.APPDATA, pkgJson.name, CONFIG_FILE)),
      type: 'win',
    });
  }

  try_paths.push({
    path: Path.resolve(Path.join('.', pkgJson.name, CONFIG_FILE)),
    type: 'def',
  });

  // backward compatibility
  try_paths.push({
    path: Path.resolve(Path.join('.', CONFIG_FILE)),
    type: 'old',
  });

  return try_paths;
}

/**
 * Check whether the path already exist.
 * @param {String} path
 * @return {Boolean}
 */
function folder_exists(path) {
  try {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  } catch(_) {
    return false;
  }
}

/**
 * Check whether the file already exist.
 * @param {String} path
 * @return {Boolean}
 */
function file_exists(path) {
  try {
    const stat = fs.statSync(path);
    return stat.isFile();
  } catch(_) {
    return false;
  }
}

module.exports = find_config_file;
