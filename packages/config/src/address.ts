import createDebug from 'debug';

import { DEFAULT_DOMAIN, DEFAULT_PORT, DEFAULT_PROTOCOL } from '@verdaccio/core';
import { Logger } from '@verdaccio/types';

const debug = createDebug('verdaccio:config:address');

export interface ListenAddress {
  proto: string;
  host?: string;
  port?: string;
  path?: string;
}

/**
 * Parse an internet address
 * Allow:
 - https:localhost:1234        - protocol + host + port
 - localhost:1234              - host + port
 - 1234                        - port
 - http::1234                  - protocol + port
 - https://localhost:443/      - full url + https
 - http://[::1]:443/           - ipv6
 - unix:/tmp/http.sock         - unix sockets
 - https://unix:/tmp/http.sock - unix sockets (https)
 * @param {*} urlAddress the internet address definition
 * @return {Object|Null} literal object that represent the address parsed
 */
export function parseAddress(urlAddress: string): ListenAddress | null {
  //
  // TODO: refactor it to something more reasonable?
  //
  //        protocol :  //      (  host  )|(    ipv6     ):  port  /
  const urlPattern = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(urlAddress);

  if (urlPattern) {
    return {
      proto: urlPattern[2] || DEFAULT_PROTOCOL,
      host: urlPattern[6] || urlPattern[7] || DEFAULT_DOMAIN,
      port: urlPattern[8] || DEFAULT_PORT,
    };
  }

  const unixPattern = /^(?:(https?):\/\/)?unix:(\/.*)$/.exec(urlAddress);
  if (!unixPattern) {
    // if we cannot match the unix pattern, we return null
    // this is to avoid returning a wrong object
    return null;
  }

  return {
    host: unixPattern[2],
    proto: unixPattern[1] || 'unix',
    path: unixPattern[2],
  };
}

function addrToString(a: ListenAddress): string {
  return a.proto === 'unix' ? `unix:${a.host}` : `${a.proto}://${a.host}:${a.port}`;
}

/**
 * Retrieve all addresses defined in the config file.
 * Verdaccio is able to listen multiple ports
 * @param {String} argListen
 * @param {String} configListen
 * eg:
 *  listen:
 - localhost:5555
 - localhost:5557
 @return {Array}
 */
export function getListenAddress(listen: (string | void)[], logger: Logger): ListenAddress {
  debug('getListenAddress called with %o', listen);

  if (!listen) {
    debug('No listen address provided, using default');
    return { proto: DEFAULT_PROTOCOL, host: DEFAULT_DOMAIN, port: DEFAULT_PORT };
  }

  if (Array.isArray(listen)) {
    const filteredListen = listen.filter((item) => typeof item === 'string');

    if (filteredListen.length === 0) {
      throw new Error('Listen addresses array cannot be empty');
    }

    const invalid: string[] = [];

    for (const raw of filteredListen) {
      const candidate = parseAddress(raw as string);
      if (candidate) {
        debug('valid listen address found: %o', candidate);

        invalid.forEach((bad) =>
          logger.warn(
            { addr: bad },
            'invalid address - @{addr}, we expect a port (e.g. "4873"), ' +
              'host:port (e.g. "localhost:4873"), full url ' +
              '(e.g. "http://localhost:4873/") or unix:/path/socket'
          )
        );

        if (listen.length > 1) {
          logger.warn(
            `Multiple listen addresses are not supported, using the first valid one ${addrToString(
              candidate
            )}`
          );
        }
        return candidate;
      }
      invalid.push(raw as string);
    }

    invalid.forEach((bad) =>
      logger.warn(
        { addr: bad },
        'invalid address - @{addr}, we expect a port (e.g. "4873"), ' +
          'host:port (e.g. "localhost:4873"), full url ' +
          '(e.g. "http://localhost:4873/") or unix:/path/socket'
      )
    );
    throw new Error('No valid listen addresses found in configuration array');
  }

  const single = parseAddress(listen);
  if (!single) {
    throw new Error(
      `Invalid address - ${listen}, we expect a port (e.g. "4873"), ` +
        `host:port (e.g. "localhost:4873"), full url ` +
        `(e.g. "http://localhost:4873/") or unix:/path/socket`
    );
  }
  return single;
}
