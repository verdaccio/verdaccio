import constants from 'constants';
import buildDebug from 'debug';
import fs from 'fs';
import http from 'http';
import https from 'https';
import _, { assign } from 'lodash';
import path from 'path';

import { ConfigRuntime, HttpsConfKeyCert, HttpsConfPfx } from '@verdaccio/types';

import endPointAPI from '../api/index';
import { getListListenAddresses } from './cli/utils';
import findConfigFile from './config-path';
import { API_ERROR } from './constants';
import { parseConfigFile } from './utils';

const debug = buildDebug('verdaccio');

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
      logger.info(
        `support for experiment [${experiment}] ${
          flags[experiment] ? 'is enabled' : ' is disabled'
        }`
      );
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
    if (!configurationParsed.self_path) {
      configurationParsed.self_path = path.resolve(configPathLocation);
    }
  } else if (_.isObject(config)) {
    configurationParsed = config;
    if (!configurationParsed.self_path) {
      throw new Error('self_path is required, please provide a valid root path for storage');
    }
  } else {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }

  const addresses = getListListenAddresses(undefined, configurationParsed.listen);
  if (addresses.length > 1) {
    process.emitWarning(
      'You have specified multiple listen addresses, using this method only the first will be used'
    );
  }

  const app = await endPointAPI(configurationParsed);
  return createServerFactory(configurationParsed, addresses[0], app);
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

function unlinkAddressPath(addr) {
  if (addr.path && fs.existsSync(addr.path)) {
    fs.unlinkSync(addr.path);
  }
}
