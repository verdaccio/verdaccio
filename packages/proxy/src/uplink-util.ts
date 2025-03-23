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

  for (const uplinkName of Object.keys(config.uplinks)) {
    // instance for each up-link definition
    const proxy: IProxy = new ProxyStorage(uplinkName, config.uplinks[uplinkName], config, logger);
    uplinks[uplinkName] = proxy;
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
    versions[version][Symbol.for('__verdaccio_uplink')] = upLink.uplinkName;
  }

  return { ...manifest, versions };
}
