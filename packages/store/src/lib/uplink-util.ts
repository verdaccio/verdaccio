import { logger } from '@verdaccio/logger';
import { IProxy, ProxyStorage } from '@verdaccio/proxy';
import { Config, Manifest } from '@verdaccio/types';

export interface ProxyInstanceList {
  [key: string]: IProxy;
}

/**
 * Set up the Up Storage for each link.
 */
export function setupUpLinks(config: Config): ProxyInstanceList {
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

  return { ...manifest, versions: versions };
}
