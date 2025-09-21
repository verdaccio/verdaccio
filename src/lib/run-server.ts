import constants from 'constants';
import buildDebug from 'debug';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { assign } from 'lodash';

import { getConfigParsed, getListenAddress } from '@verdaccio/config';
import { ConfigYaml, HttpsConfKeyCert, HttpsConfPfx } from '@verdaccio/types';

import endPointAPI from '../api/index';
import { displayExperimentsInfoBox } from './experiments';
import { logger } from './logger';
import { initLogger } from './utils';

const debug = buildDebug('verdaccio:run-server');

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
export async function runServer(
  config?: string | ConfigYaml,
  options?: { listenArg?: string }
): Promise<any> {
  const configurationParsed = getConfigParsed(config);

  initLogger(configurationParsed);
  // merge flags and experiments for backward compatibility
  const flags = {
    ...(configurationParsed?.flags || {}),
    ...(configurationParsed?.experiments || {}),
  };
  displayExperimentsInfoBox(flags);

  const listen = options?.listenArg ?? configurationParsed?.listen;
  const address = getListenAddress(listen, logger);

  const app = await endPointAPI(configurationParsed);
  return createServerFactory(configurationParsed, address, app);
}

/**
 * Return a native HTTP/HTTPS server instance
 * @param config
 * @param addr
 * @param app
 */
export function createServerFactory(config: ConfigYaml, addr, app) {
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
    } catch (err: any) {
      logger.fatal({ err: err }, 'cannot create server: @{err.message}');
      process.exit(2);
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
