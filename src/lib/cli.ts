#!/usr/bin/env node

/* eslint no-sync:0 */
/* eslint no-empty:0 */

import path from 'path';
import semver from 'semver';
import { bgYellow, bgRed } from 'kleur';
import { startVerdaccio, listenDefaultCallback } from './bootstrap';
import findConfigFile from './config-path';
import { parseConfigFile } from './utils';

require('pkginfo')(module);

if (process.getuid && process.getuid() === 0) {
  global.console.warn(
    bgYellow().red(
      "*** WARNING: Verdaccio doesn't need superuser privileges. Don't run it under root! ***"
    )
  );
}

const MIN_NODE_VERSION = '6.9.0';

if (semver.satisfies(process.version, `>=${MIN_NODE_VERSION}`) === false) {
  global.console.error(
    bgRed(
      `Verdaccio requires at least Node.js ${MIN_NODE_VERSION} or higher, please upgrade your Node.js distribution`
    )
  );
  process.exit(1);
}

process.title = 'verdaccio';

// eslint-disable-next-line import/order
const logger = require('./logger');
logger.setup(null, { logStart: false }); // default setup

const envinfo = require('envinfo');
const commander = require('commander');
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;

commander
  .option('-i, --info', 'prints debugging information about the local environment')
  .option('-l, --listen <[host:]port>', 'host:port number to listen on (default: localhost:4873)')
  .option('-c, --config <config.yaml>', 'use this configuration file (default: ./config.yaml)')
  .version(pkgVersion)
  .parse(process.argv);

function init() {
  let verdaccioConfiguration;
  let configPathLocation;
  const cliListener = commander.listen;

  try {
    configPathLocation = findConfigFile(commander.config);
    verdaccioConfiguration = parseConfigFile(configPathLocation);
    process.title = (verdaccioConfiguration.web && verdaccioConfiguration.web.title) || 'verdaccio';

    if (!verdaccioConfiguration.self_path) {
      verdaccioConfiguration.self_path = path.resolve(configPathLocation);
    }
    if (!verdaccioConfiguration.https) {
      verdaccioConfiguration.https = { enable: false };
    }

    logger.logger.warn({ file: configPathLocation }, 'config file  - @{file}');

    startVerdaccio(
      verdaccioConfiguration,
      cliListener,
      configPathLocation,
      pkgVersion,
      pkgName,
      listenDefaultCallback
    );
  } catch (err) {
    logger.logger.fatal(
      { file: configPathLocation, err: err },
      'cannot open config file @{file}: @{!err.message}'
    );
    process.exit(1);
  }
}

if (commander.info) {
  // eslint-disable-next-line no-console
  console.log('\nEnvironment Info:');
  (async () => {
    const data = await envinfo.run({
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Virtualization: ['Docker'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      npmGlobalPackages: ['verdaccio']
    });
    // eslint-disable-next-line no-console
    console.log(data);
    process.exit(0);
  })();
} else if (commander.args.length == 1 && !commander.config) {
  // handling "verdaccio [config]" case if "-c" is missing in command line
  commander.config = commander.args.pop();
  init();
} else if (commander.args.length !== 0) {
  commander.help();
} else {
  init();
}

process.on('uncaughtException', function (err) {
  logger.logger.fatal(
    {
      err: err
    },
    'uncaught exception, please report this\n@{err.stack}'
  );
  process.exit(255);
});
