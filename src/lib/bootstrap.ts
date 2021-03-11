import { assign, isObject, isFunction } from 'lodash';
import express from 'express';
import URL from 'url';
import fs from 'fs';
import http from 'http';
import https from 'https';
import constants from 'constants';
import endPointAPI from '../api/index';
import { getListListenAddresses, resolveConfigPath } from './cli/utils';
import { API_ERROR, certPem, csrPem, keyPem } from './constants';

import { Callback, ConfigWithHttps, HttpsConfKeyCert, HttpsConfPfx } from '@verdaccio/types';
import { Application } from 'express';

const logger = require('./logger');

function displayExperimentsInfoBox(experiments) {
  const experimentList = Object.keys(experiments);
  if (experimentList.length >= 1) {
    logger.logger.warn('⚠️  experiments are enabled, we recommend do not use experiments in production, comment out this section to disable it');
    experimentList.forEach(experiment => {
      logger.logger.warn(` - support for ${experiment} ${experiments[experiment] ? 'is enabled' : ' is disabled'}`);
    });
  }
}

/**
 * Trigger the server after configuration has been loaded.
 * @param {Object} config
 * @param {Object} cliArguments
 * @param {String} configPath
 * @param {String} pkgVersion
 * @param {String} pkgName
 */
function startVerdaccio(config: any, cliListen: string, configPath: string, pkgVersion: string, pkgName: string, callback: Callback): void {
  if (isObject(config) === false) {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }

  if ('experiments' in config) {
    displayExperimentsInfoBox(config.experiments);
  }

  endPointAPI(config).then(
    (app): void => {
      const addresses = getListListenAddresses(cliListen, config.listen);

      addresses.forEach(function(addr): void {
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
    }
  );
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

function listenDefaultCallback(webServer: Application, addr: any, pkgName: string, pkgVersion: string): void {

  const server = webServer
    .listen(
      addr.port || addr.path,
      addr.host,
      (): void => {
        // send a message for tests
        if (isFunction(process.send)) {
          process.send({
            verdaccio_started: true,
          });
        }
      }
    )
    .on('error', function(err): void {
      logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}');
      process.exit(2);
    });

    function handleShutdownGracefully() {
      logger.logger.fatal("received shutdown signal - closing server gracefully...");
      server.close(() => {
        logger.logger.info("server closed.");
        process.exit(0);
      });
    }

  // handle shutdown signals nicely when environment says so
  if (process.env.HANDLE_KILL_SIGNALS === "true") {
    process.on("SIGINT", handleShutdownGracefully);
    process.on("SIGTERM", handleShutdownGracefully);
    process.on("SIGHUP", handleShutdownGracefully);
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
