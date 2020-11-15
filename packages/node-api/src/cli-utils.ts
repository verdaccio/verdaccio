import path from 'path';

const logger = require('@verdaccio/logger');

export const DEFAULT_PORT = '4873';
export const DEFAULT_PROTOCOL = 'http';
export const DEFAULT_DOMAIN = 'localhost';
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
export function parseAddress(urlAddress: any): any {
  //
  // TODO: refactor it to something more reasonable?
  //
  //        protocol :  //      (  host  )|(    ipv6     ):  port  /
  let urlPattern = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(urlAddress);

  if (urlPattern) {
    return {
      proto: urlPattern[2] || DEFAULT_PROTOCOL,
      host: urlPattern[6] || urlPattern[7] || DEFAULT_DOMAIN,
      port: urlPattern[8] || DEFAULT_PORT,
    };
  }

  urlPattern = /^((https?):(\/\/)?)?unix:(.*)$/.exec(urlAddress);

  if (urlPattern) {
    return {
      proto: urlPattern[2] || DEFAULT_PROTOCOL,
      path: urlPattern[4],
    };
  }

  return null;
}

export const resolveConfigPath = function (storageLocation: string, file: string) {
  return path.resolve(path.dirname(storageLocation), file);
};

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
export function getListListenAddresses(argListen: string, configListen: any): any {
  // command line || config file || default
  let addresses;
  if (argListen) {
    addresses = [argListen];
  } else if (Array.isArray(configListen)) {
    addresses = configListen;
  } else if (configListen) {
    addresses = [configListen];
  } else {
    addresses = [DEFAULT_PORT];
  }
  addresses = addresses
    .map(function (addr): string {
      const parsedAddr = parseAddress(addr);

      if (!parsedAddr) {
        logger.logger.warn(
          { addr: addr },
          'invalid address - @{addr}, we expect a port (e.g. "4873"),' +
            ' host:port (e.g. "localhost:4873") or full url' +
            ' (e.g. "http://localhost:4873/")'
        );
      }

      return parsedAddr;
    })
    .filter(Boolean);

  return addresses;
}
