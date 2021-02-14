import URL from 'url';
import fs from 'fs';
import http from 'http';
import https from 'https';
import constants from 'constants';
import { Application } from 'express';
import { assign, isObject, isFunction } from 'lodash';
import buildDebug from 'debug';

import { displayError, displayMessage, displayLink } from '@verdaccio/cli-ui';

import {
  ConfigRuntime,
  Callback,
  ConfigWithHttps,
  HttpsConfKeyCert,
  HttpsConfPfx,
} from '@verdaccio/types';
import { API_ERROR } from '@verdaccio/commons-api';
import server from '@verdaccio/server';

export const keyPem = 'verdaccio-key.pem';
export const certPem = 'verdaccio-cert.pem';
export const csrPem = 'verdaccio-csr.pem';

import { getListListenAddresses, resolveConfigPath } from './cli-utils';
import { displayExperimentsInfoBox } from './experiments';

const debug = buildDebug('verdaccio:runtime');

function launchServer(
  app,
  addr,
  config,
  configPath: string,
  pkgVersion: string,
  pkgName: string,
  callback: Callback
): void {
  let webServer;
  if (addr.proto === 'https') {
    debug('https enabled');
    webServer = handleHTTPS(app, configPath, config);
  } else {
    // http
    debug('http enabled');
    webServer = http.createServer(app);
  }
  if (
    config.server &&
    typeof config.server.keepAliveTimeout !== 'undefined' &&
    config.server.keepAliveTimeout !== 'null'
  ) {
    // library definition for node is not up to date (doesn't contain recent 8.0 changes)
    webServer.keepAliveTimeout = config.server.keepAliveTimeout * 1000;
  }
  unlinkAddressPath(addr);

  callback(webServer, addr, pkgName, pkgVersion);
}

async function startVerdaccio(
  config: ConfigRuntime,
  cliListen: string,
  configPath: string,
  pkgVersion: string,
  pkgName: string,
  callback: Callback
): Promise<void> {
  if (isObject(config) === false) {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }

  const app = await server(config);
  const addresses = getListListenAddresses(cliListen, config.listen);
  displayExperimentsInfoBox(config.flags);

  addresses.forEach((addr) =>
    launchServer(app, addr, config, configPath, pkgVersion, pkgName, callback)
  );
}

function unlinkAddressPath(addr) {
  if (addr.path && fs.existsSync(addr.path)) {
    fs.unlinkSync(addr.path);
  }
}

function logHTTPSError(storageLocation) {
  displayError(
    [
      'You have enabled HTTPS and need to specify either ',
      '    "https.key" and "https.cert" or ',
      '    "https.pfx" and optionally "https.passphrase" ',
      'to run https server',
      '',
      // commands are borrowed from node.js docs
      'To quickly create self-signed certificate, use:',
      ' $ openssl genrsa -out ' + resolveConfigPath(storageLocation, keyPem) + ' 2048',
      ' $ openssl req -new -sha256 -key ' +
        resolveConfigPath(storageLocation, keyPem) +
        ' -out ' +
        resolveConfigPath(storageLocation, csrPem),
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
  displayError(displayLink('https://verdaccio.org/docs/en/configuration#https'));
  process.exit(2);
}

function handleHTTPS(app: Application, configPath: string, config: ConfigWithHttps): https.Server {
  try {
    let httpsOptions = {
      // disable insecure SSLv2 and SSLv3
      secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
    };

    const keyCertConfig = config.https as HttpsConfKeyCert;
    const pfxConfig = config.https as HttpsConfPfx;

    // https must either have key and cert or a pfx and (optionally) a passphrase
    if (!((keyCertConfig.key && keyCertConfig.cert) || pfxConfig.pfx)) {
      logHTTPSError(configPath);
      process.exit(1);
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
    displayError(`cannot create server: ${err.message}`);
    process.exit(2);
  }
}

function listenDefaultCallback(
  webServer: Application,
  addr: any,
  pkgName: string,
  pkgVersion: string
): void {
  webServer
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
      displayMessage(`http address ${displayLink(addressServer)}`);
      displayMessage(`${pkgName} / ${pkgVersion}`);
    })
    .on('error', function (err): void {
      displayError(`cannot create server: ${err.message}`);
      process.exit(2);
    });
}

export { startVerdaccio, listenDefaultCallback };
