// @flow

import path from 'path';

import {parseAddress} from '../utils';
import {DEFAULT_PORT} from '../constants';

const logger = require('../logger');

export const resolveConfigPath = function(storageLocation: string, file: string) {
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
export function getListListenAddresses(argListen: string, configListen: mixed) {
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
  addresses = addresses.map(function(addr) {
    const parsedAddr = parseAddress(addr);

    if (!parsedAddr) {
      logger.logger.warn({addr: addr},
        'invalid address - @{addr}, we expect a port (e.g. "4873"),'
        + ' host:port (e.g. "localhost:4873") or full url'
        + ' (e.g. "http://localhost:4873/")');
    }

    return parsedAddr;
  }).filter(Boolean);

  return addresses;
}
