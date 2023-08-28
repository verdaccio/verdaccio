import { ProxyStorage } from '@verdaccio/proxy';
import { Config, Versions } from '@verdaccio/types';

import { logger } from './logger';

/**
 * Set up the Up Storage for each link.
 */
export function setupUpLinks(config: Config): Record<string, ProxyStorage> {
  const uplinks = {};

  for (const uplinkName in config.uplinks) {
    if (Object.prototype.hasOwnProperty.call(config.uplinks, uplinkName)) {
      // instance for each up-link definition
      const proxy = new ProxyStorage(config.uplinks[uplinkName], config, logger);
      proxy.upname = uplinkName;

      uplinks[uplinkName] = proxy;
    }
  }

  return uplinks;
}

export function updateVersionsHiddenUpLink(versions: Versions, upLink): void {
  for (const i in versions) {
    if (Object.prototype.hasOwnProperty.call(versions, i)) {
      const version = versions[i];

      // holds a "hidden" value to be used by the package storage.

      version[Symbol.for('__verdaccio_uplink')] = upLink.upname;
    }
  }
}
