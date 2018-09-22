// @flow

import {assign, isObject, isFunction} from 'lodash';
import URL from 'url';
import fs from 'fs';
import http from 'http';
import https from 'https';
// $FlowFixMe
import constants from 'constants';
import endPointAPI from '../api/index';
import {getListListenAddresses, resolveConfigPath} from './cli/utils';
import {API_ERROR, certPem, csrPem, keyPem} from './constants';

import type {Callback} from '@verdaccio/types';
import type {$Application} from 'express';

const logger = require('./logger');

/**
 * Trigger the server after configuration has been loaded.
 * @param {Object} config
 * @param {Object} cliArguments
 * @param {String} configPath
 * @param {String} pkgVersion
 * @param {String} pkgName
 */
function startVerdaccio(config: any,
                        cliListen: string,
                        configPath: string,
                        pkgVersion: string,
                        pkgName: string,
                        callback: Callback) {
  if (isObject(config) === false) {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }

  endPointAPI(config).then((app)=> {
    const addresses = getListListenAddresses(cliListen, config.listen);

    addresses.forEach(function(addr) {
      let webServer;
      if (addr.proto === 'https') {
        // https  must either have key cert and ca  or a pfx and (optionally) a passphrase
        if (!config.https || !config.https.key || !config.https.cert || !config.https.ca) {
          logHTTPSWarning(configPath);
        }

        webServer = handleHTTPS(app, configPath, config);
      } else { // http
        webServer = http.createServer(app);
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
  logger.logger.fatal([
    'You have enabled HTTPS and need to specify either ',
    '    "https.key", "https.cert" and "https.ca" or ',
    '    "https.pfx" and optionally "https.passphrase" ',
    'to run https server',
    '',
    // commands are borrowed from node.js docs
    'To quickly create self-signed certificate, use:',
    ' $ openssl genrsa -out ' + resolveConfigPath(storageLocation, keyPem) + ' 2048',
    ' $ openssl req -new -sha256 -key ' + resolveConfigPath(storageLocation, keyPem) + ' -out ' + resolveConfigPath(storageLocation, csrPem),
    ' $ openssl x509 -req -in ' + resolveConfigPath(storageLocation, csrPem) +
    ' -signkey ' + resolveConfigPath(storageLocation, keyPem) + ' -out ' + resolveConfigPath(storageLocation, certPem),
    '',
    'And then add to config file (' + storageLocation + '):',
    '  https:',
    `    key: ${resolveConfigPath(storageLocation, keyPem)}`,
    `    cert: ${resolveConfigPath(storageLocation, certPem)}`,
    `    ca: ${resolveConfigPath(storageLocation, csrPem)}`,
  ].join('\n'));
  process.exit(2);
}

function handleHTTPS(app, configPath, config) {
  try {
    let httpsOptions = {
      secureProtocol: 'SSLv23_method', // disable insecure SSLv2 and SSLv3
      secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
    };

    if (config.https.pfx) {
      httpsOptions = assign(httpsOptions, {
        pfx: fs.readFileSync(config.https.pfx),
        passphrase: config.https.passphrase || '',
      });
    } else {
      httpsOptions = assign(httpsOptions, {
        key: fs.readFileSync(config.https.key),
        cert: fs.readFileSync(config.https.cert),
        ca: fs.readFileSync(config.https.ca),
      });
    }
    return https.createServer(httpsOptions, app);
  } catch (err) { // catch errors related to certificate loading
    logger.logger.fatal({err: err}, 'cannot create server: @{err.message}');
    process.exit(2);
  }
}

function listenDefaultCallback(webServer: $Application, addr: any, pkgName: string, pkgVersion: string) {
  webServer.listen(addr.port || addr.path, addr.host, () => {
    // send a message for tests
    if (isFunction(process.send)) {
      process.send({
        verdaccio_started: true,
      });
    }
  // $FlowFixMe
  }).on('error', function(err) {
    logger.logger.fatal({err: err}, 'cannot create server: @{err.message}');
    process.exit(2);
  });

  logger.logger.warn({
    addr: ( addr.path
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
          ),
    version: pkgName + '/' + pkgVersion,
  }, 'http address - @{addr} - @{version}');
}

export {startVerdaccio, listenDefaultCallback};
