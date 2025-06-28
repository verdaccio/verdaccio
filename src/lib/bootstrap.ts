import { debug } from 'console';
import constants from 'constants';
import express from 'express';
import { Application } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { assign, isFunction, isObject } from 'lodash';
import URL from 'url';

import { getListenAddress } from '@verdaccio/config';
import { Callback, ConfigYaml, HttpsConfKeyCert, HttpsConfPfx } from '@verdaccio/types';

import endPointAPI from '../api/index';
import { API_ERROR, DEFAULT_PORT } from './constants';
import { displayExperimentsInfoBox } from './experiments';
import { logger } from './logger';
import { initLogger, logHTTPSWarning } from './utils';

/**
 * Trigger the server after configuration has been loaded.
 * @param {Object} config
 * @param {Object} cliArguments
 * @param {String} configPath
 * @param {String} pkgVersion
 * @param {String} pkgName
 * @deprecated use runServer instead
 */
function startVerdaccio(
  config: ConfigYaml,
  cliListen: string,
  configPath: string,
  pkgVersion: string,
  pkgName: string,
  callback: Callback
): void {
  if (isObject(config) === false) {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }

  initLogger(config);

  // merge flags and experiments for backward compatibility
  const flags = {
    ...(config?.flags || {}),
    ...(config?.experiments || {}),
  };
  displayExperimentsInfoBox(flags);
  logger.warn('This is a deprecated method, please use runServer instead');

  endPointAPI(config).then((app): void => {
    const combined: string | undefined | any[] = [cliListen, config?.listen, DEFAULT_PORT];
    const addr = getListenAddress(combined, logger);
    let webServer;
    if (addr.proto === 'https') {
      webServer = handleHTTPS(app, configPath, config);
    } else {
      // http
      webServer = http.createServer(app);
    }
    if (webServer && typeof config?.server?.keepAliveTimeout === 'number') {
      // library definition for node is not up to date (doesn't contain recent 8.0 changes)
      webServer.keepAliveTimeout = config.server.keepAliveTimeout * 1000;
    }
    unlinkAddressPath(addr);
    console.log('---> Starting server with address:', addr);
    callback(webServer, addr, pkgName, pkgVersion);
  });
}

function unlinkAddressPath(addr) {
  if (addr.path && fs.existsSync(addr.path)) {
    fs.unlinkSync(addr.path);
  }
}

function handleHTTPS(
  app: express.Application,
  configPath: string,
  config: ConfigYaml
): https.Server {
  try {
    let httpsOptions = {
      secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3, // disable insecure SSLv2 and SSLv3
    };
    const keyCertConfig = config.https as HttpsConfKeyCert;
    const pfxConfig = config.https as HttpsConfPfx;

    const missingKeyCert = !(keyCertConfig.key && keyCertConfig.cert);
    debug('missingKeyCert', missingKeyCert);
    const missingPfx = !pfxConfig.pfx;
    debug('missingPfx', missingPfx);

    if (missingKeyCert && missingPfx) {
      debug('No HTTPS configuration found');
      logHTTPSWarning(configPath);
      throw new Error('No HTTPS configuration found');
    }

    debug('HTTPS configuration found');
    if (pfxConfig.pfx) {
      debug('Using PFX configuration');
      const { pfx, passphrase } = pfxConfig;
      httpsOptions = assign(httpsOptions, {
        pfx: fs.readFileSync(pfx),
        passphrase: passphrase || '',
      });
    } else {
      debug('Using Key/Cert configuration');
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
  } catch (err: any) {
    // catch errors related to certificate loading
    logger.fatal({ err: err }, 'cannot create https server: @{err.message}');
    process.exit(2);
  }
}
/**
 *
 * @param webServer
 * @param addr
 * @param pkgName
 * @param pkgVersion
 * @deprecated use initServer instead
 */
function listenDefaultCallback(
  webServer: Application,
  addr: any,
  pkgName: string,
  pkgVersion: string
): void {
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
      logger.fatal({ err: err }, 'cannot create http server: @{err.message}');
      process.exit(2);
    });

  function handleShutdownGracefully() {
    logger.fatal('received shutdown signal - closing server gracefully...');
    server.close(() => {
      logger.info('server closed.');
      process.exit(0);
    });
  }

  // handle shutdown signals nicely when environment says so
  if (process.env.VERDACCIO_HANDLE_KILL_SIGNALS === 'true') {
    process.on('SIGINT', handleShutdownGracefully);
    process.on('SIGTERM', handleShutdownGracefully);
    process.on('SIGHUP', handleShutdownGracefully);
  }

  logger.warn(
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
