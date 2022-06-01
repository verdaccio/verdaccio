import constants from 'constants';
import fs from 'fs';
import http from 'http';
import https from 'https';
import URL from 'url';


import endPointAPI from '../api/index';
import { getListListenAddresses, resolveConfigPath } from './cli/utils';
import findConfigFile from './config-path';
import { API_ERROR, certPem, csrPem, keyPem } from './constants';
import { setup } from './logger';
import { parseConfigFile } from './utils';
import { Callback, ConfigRuntime, ConfigWithHttps, HttpsConfKeyCert, HttpsConfPfx } from '@verdaccio/types';
import _, { assign, isFunction, isObject } from 'lodash';
import express from 'express';
import { Application } from 'express';
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:node-api');

const logger = require('./logger');

export function displayExperimentsInfoBox(flags) {
  if (!flags) {
    return;
  }

  const experimentList = Object.keys(flags);
  if (experimentList.length >= 1) {
    logger.warn(
      // eslint-disable-next-line max-len
      `experiments are enabled, it is recommended do not use experiments in production comment out this section to disable it`
    );
    experimentList.forEach((experiment) => {
      // eslint-disable-next-line max-len
      logger.info(`support for experiment [${experiment}] ${flags[experiment] ? 'is enabled' : ' is disabled'}`);
    });
  }
}

/**
 * Exposes a server factory to be instantiated programmatically.
 *
    const app = await runServer(); // default configuration
    const app = await runServer('./config/config.yaml');
    const app = await runServer({ configuration });
    app.listen(4000, (event) => {
    // do something
    });
 * @param config
 */
export async function runServer(config?: string): Promise<any> {
  let configurationParsed: ConfigRuntime;
  if (config === undefined || typeof config === 'string') {
    const configPathLocation = findConfigFile(config);
    configurationParsed = parseConfigFile(configPathLocation) as ConfigRuntime;
  } else if (_.isObject(config)) {
    configurationParsed = config;
  } else {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }

  const addresses = getListListenAddresses(undefined, configurationParsed.listen);
  if (addresses.length > 1) {
    process.emitWarning('You have specified multiple listen addresses, using this method only the first will be used');
  }
  const app = await endPointAPI(configurationParsed);
  return createServerFactory(configurationParsed, addresses[0], app);
}

/**
 * Start the server on the port defined
 * @param config
 * @param port
 * @param version
 * @param pkgName
 */
export async function initServer(config: ConfigRuntime, port: string | void, version: string, pkgName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // FIXME: get only the first match, the multiple address will be removed
    const [addr] = getListListenAddresses(port, config.listen);
    setup(config?.logs as any);
    // @ts-expect-error
    displayExperimentsInfoBox(config.flags);
    endPointAPI(config).then((app) => {
      const serverFactory = createServerFactory(config, addr, app);
      serverFactory
        .listen(addr.port || addr.path, addr.host, (): void => {
          // send a message for test
          if (isFunction(process.send)) {
            process.send({
              verdaccio_started: true,
            });
          }
          const addressServer = `${
            addr.path
              ? URL.format({
                  protocol: 'unix',
                  pathname: addr.path,
                })
              : URL.format({
                  protocol: addr.proto,
                  hostname: addr.host,
                  port: addr.port,
                  pathname: '/',
                })
          }`;
          logger.info(`http address ${addressServer}`);
          logger.info(`version: ${version}`);
          resolve();
        })
        .on('error', function (err): void {
          reject(err);
          process.exitCode = 1;
        });

      function handleShutdownGracefully() {
        logger.fatal('received shutdown signal - closing server gracefully...');
        serverFactory.close(() => {
          logger.info('server closed.');
          process.exit(0);
        });
      }

      for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
        // Use once() so that receiving double signals exit the app.
        process.once(signal as any, handleShutdownGracefully);
      }
    });
  });
}

/**
 * Return a native HTTP/HTTPS server instance
 * @param config
 * @param addr
 * @param app
 */
export function createServerFactory(config: ConfigRuntime, addr, app) {
  let serverFactory;
  if (addr.proto === 'https') {
    debug('https enabled');
    try {
      let httpsOptions = {
        // disable insecure SSLv2 and SSLv3
        secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
      };

      const keyCertConfig = config.https as HttpsConfKeyCert;
      const pfxConfig = config.https as HttpsConfPfx;

      // https must either have key and cert or a pfx and (optionally) a passphrase
      if (!((keyCertConfig.key && keyCertConfig.cert) || pfxConfig.pfx)) {
        // logHTTPSError(configPath);
        throw Error('bad format https configuration');
      }

      if (pfxConfig.pfx) {
        const { pfx, passphrase } = pfxConfig;
        httpsOptions = assign(httpsOptions, {
          pfx: fs.readFileSync(pfx),
          passphrase: passphrase || '',
        });
      } else {
        const { key, cert, ca } = keyCertConfig;
        httpsOptions = assign(httpsOptions, {
          key: fs.readFileSync(key),
          cert: fs.readFileSync(cert),
          ...(ca && {
            ca: fs.readFileSync(ca),
          }),
        });
      }
      // TODO: enable http2 as feature
      // if (config.server.http2) <-- check if force http2
      serverFactory = https.createServer(httpsOptions, app);
    } catch (err) {
      throw new Error(`cannot create https server: ${err.message}`);
    }
  } else {
    // http
    debug('http enabled');
    serverFactory = http.createServer(app);
  }

  if (
    config.server &&
    typeof config.server.keepAliveTimeout !== 'undefined' &&
    // @ts-ignore
    config.server.keepAliveTimeout !== 'null'
  ) {
    // library definition for node is not up to date (doesn't contain recent 8.0 changes)
    serverFactory.keepAliveTimeout = config.server.keepAliveTimeout * 1000;
  }
  // FIXE: I could not find the reason of this code.
  unlinkAddressPath(addr);

  return serverFactory;
}

/**
 * Trigger the server after configuration has been loaded.
 * @param {Object} config
 * @param {Object} cliArguments
 * @param {String} configPath
 * @param {String} pkgVersion
 * @param {String} pkgName
 * @deprecated use initServer instead
 */
function startVerdaccio(config: any, cliListen: string, configPath: string, pkgVersion: string, pkgName: string, callback: Callback): void {
  if (isObject(config) === false) {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }

  if ('experiments' in config) {
    displayExperimentsInfoBox(config.experiments);
  }

  endPointAPI(config).then((app): void => {
    const addresses = getListListenAddresses(cliListen, config.listen);
    if (addresses.length > 1) {
      process.emitWarning('You have specified multiple listen addresses, in the future only the first will be used');
    }

    addresses.forEach(function (addr): void {
      let webServer;
      if (addr.proto === 'https') {
        webServer = handleHTTPS(app, configPath, config);
      } else {
        // http
        webServer = http.createServer(app);
      }
      if (config.server && typeof config.server.keepAliveTimeout !== 'undefined' && config.server.keepAliveTimeout !== 'null') {
        // library definition for node is not up to date (doesn't contain recent 8.0 changes)
        webServer.keepAliveTimeout = config.server.keepAliveTimeout * 1000;
      }
      unlinkAddressPath(addr);

      callback(webServer, addr, pkgName, pkgVersion);
    });
  });
}

function unlinkAddressPath(addr) {
  if (addr.path && fs.existsSync(addr.path)) {
    fs.unlinkSync(addr.path);
  }
}

function logHTTPSWarning(storageLocation) {
  logger.logger.fatal(
    [
      'You have enabled HTTPS and need to specify either ',
      '    "https.key" and "https.cert" or ',
      '    "https.pfx" and optionally "https.passphrase" ',
      'to run https server',
      '',
      // commands are borrowed from node.js docs
      'To quickly create self-signed certificate, use:',
      ' $ openssl genrsa -out ' + resolveConfigPath(storageLocation, keyPem) + ' 2048',
      ' $ openssl req -new -sha256 -key ' + resolveConfigPath(storageLocation, keyPem) + ' -out ' + resolveConfigPath(storageLocation, csrPem),
      ' $ openssl x509 -req -in ' +
        resolveConfigPath(storageLocation, csrPem) +
        ' -signkey ' +
        resolveConfigPath(storageLocation, keyPem) +
        ' -out ' +
        resolveConfigPath(storageLocation, certPem),
      '',
      'And then add to config file (' + storageLocation + '):',
      '  https:',
      `    key: ${resolveConfigPath(storageLocation, keyPem)}`,
      `    cert: ${resolveConfigPath(storageLocation, certPem)}`,
    ].join('\n')
  );
  process.exit(2);
}

/**
 * Handle HTTPS configuration
 * @param app
 * @param configPath
 * @param config
 * @deprecated use runServer instead
 */
function handleHTTPS(app: express.Application, configPath: string, config: ConfigWithHttps): https.Server {
  try {
    let httpsOptions = {
      secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3, // disable insecure SSLv2 and SSLv3
    };

    const keyCertConfig = config.https as HttpsConfKeyCert;
    const pfxConfig = config.https as HttpsConfPfx;

    // https must either have key and cert or a pfx and (optionally) a passphrase
    if (!((keyCertConfig.key && keyCertConfig.cert) || pfxConfig.pfx)) {
      logHTTPSWarning(configPath);
    }

    if (pfxConfig.pfx) {
      const { pfx, passphrase } = pfxConfig;
      httpsOptions = assign(httpsOptions, {
        pfx: fs.readFileSync(pfx),
        passphrase: passphrase || '',
      });
    } else {
      const { key, cert, ca } = keyCertConfig;
      httpsOptions = assign(httpsOptions, {
        key: fs.readFileSync(key),
        cert: fs.readFileSync(cert),
        ...(ca && {
          ca: fs.readFileSync(ca),
        }),
      });
    }
    return https.createServer(httpsOptions, app);
  } catch (err) {
    // catch errors related to certificate loading
    logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}');
    process.exit(2);
  }
}

/**
 * Handle HTTPS configuration
 * @param app
 * @param configPath
 * @param config
 * @deprecated use runServer instead
 */
function listenDefaultCallback(webServer: Application, addr: any, pkgName: string, pkgVersion: string): void {
  const server = webServer
    .listen(addr.port || addr.path, addr.host, (): void => {
      // send a message for tests
      if (isFunction(process.send)) {
        process.send({
          verdaccio_started: true,
        });
      }
    })
    .on('error', function (err): void {
      logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}');
      process.exit(2);
    });

  function handleShutdownGracefully() {
    logger.logger.fatal('received shutdown signal - closing server gracefully...');
    server.close(() => {
      logger.logger.info('server closed.');
      process.exit(0);
    });
  }

  // handle shutdown signals nicely when environment says so
  if (process.env.VERDACCIO_HANDLE_KILL_SIGNALS === 'true') {
    process.on('SIGINT', handleShutdownGracefully);
    process.on('SIGTERM', handleShutdownGracefully);
    process.on('SIGHUP', handleShutdownGracefully);
  }

  logger.logger.warn(
    {
      addr: addr.path
        ? URL.format({
            protocol: 'unix',
            pathname: addr.path,
          })
        : URL.format({
            protocol: addr.proto,
            hostname: addr.host,
            port: addr.port,
            pathname: '/',
          }),
      version: pkgName + '/' + pkgVersion,
    },
    'http address - @{addr} - @{version}'
  );
}

export { startVerdaccio, listenDefaultCallback };
