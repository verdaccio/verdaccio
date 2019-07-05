import ProxyStorage from './up-storage';
import { Versions, Config } from '@verdaccio/types';
import { IProxy, ProxyList } from '../../types';

/**
 * Set up the Up Storage for each link.
 */
export function setupUpLinks(config: Config): ProxyList {
  const uplinks: ProxyList = {};

  for (const uplinkName in config.uplinks) {
    if (Object.prototype.hasOwnProperty.call(config.uplinks, uplinkName)) {
      // instance for each up-link definition
      const proxy: IProxy = new ProxyStorage(config.uplinks[uplinkName], config);
      proxy.upname = uplinkName;

      uplinks[uplinkName] = proxy;
    }
  }

  return uplinks;
}

export function updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy): void {
  for (const i in versions) {
    if (Object.prototype.hasOwnProperty.call(versions, i)) {
      const version = versions[i];

      // holds a "hidden" value to be used by the package storage.
      // $FlowFixMe
      version[Symbol.for('__verdaccio_uplink')] = upLink.upname;
    }
  }
}
