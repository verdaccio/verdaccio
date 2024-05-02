import { Config, Logger, Manifest } from '@verdaccio/types';

import { IProxy, ProxyStorage } from './index';

export interface ProxyInstanceList {
  [key: string]: IProxy;
}

/**
 * Set up uplinks for each proxy configuration.
 */
export function setupUpLinks(config: Config, logger: Logger): ProxyInstanceList {
  const uplinks: ProxyInstanceList = {};

  for (const uplinkName in config.uplinks) {
    if (Object.prototype.hasOwnProperty.call(config.uplinks, uplinkName)) {
      // instance for each up-link definition
      const proxy: IProxy = new ProxyStorage(config.uplinks[uplinkName], config, logger);
      // TODO: review this can be inside ProxyStorage
      proxy.upname = uplinkName;

      uplinks[uplinkName] = proxy;
    }
  }

  return uplinks;
}

export function updateVersionsHiddenUpLinkNext(manifest: Manifest, upLink: IProxy): Manifest {
  const { versions } = manifest;
  const versionsList = Object.keys(versions);
  if (versionsList.length === 0) {
    return manifest;
  }

  for (const version of versionsList) {
    // holds a "hidden" value to be used by the package storage.
    versions[version][Symbol.for('__verdaccio_uplink')] = upLink.upname;
  }

  return { ...manifest, versions };
}
