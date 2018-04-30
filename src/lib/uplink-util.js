// @flow

import {ErrorCode, isObject, validate_metadata} from './utils';
import ProxyStorage from './up-storage';
import {mergeVersions} from './metadata-utils';

import type {Package, Versions, Config, Logger} from '@verdaccio/types';
import type {IProxy, ProxyList} from '../../types';

 /**
   * Set up the Up Storage for each link.
   */
export function setupUpLinks(config: Config): ProxyList {
  const uplinks: ProxyList = {};

  for (let uplinkName in config.uplinks) {
    if (Object.prototype.hasOwnProperty.call(config.uplinks, uplinkName)) {
      // instance for each up-link definition
      const proxy: IProxy = new ProxyStorage(config.uplinks[uplinkName], config);
      proxy.upname = uplinkName;

      uplinks[uplinkName] = proxy;
    }
  }

  return uplinks;
}

export function updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy) {
  for (let i in versions) {
    if (Object.prototype.hasOwnProperty.call(versions, i)) {
      const version = versions[i];

      // holds a "hidden" value to be used by the package storage.
      // $FlowFixMe
      version[Symbol.for('__verdaccio_uplink')] = upLink.upname;
    }
  }
}

export function fetchUplinkMetadata(name: string, packageInfo: Package,
                                    options: any, upLink: any, logger: Logger): Promise<any> {

  return new Promise(function(resolve, reject) {
    const _options = Object.assign({}, options);
    const upLinkMeta = packageInfo._uplinks[upLink.upname];

    if (isObject(upLinkMeta)) {

      const fetched = upLinkMeta.fetched;

      // check whether is too soon to ask for metadata
      if (fetched && (Date.now() - fetched) < upLink.maxage) {
        return resolve(false);
      }

      _options.etag = upLinkMeta.etag;
    }

    upLink.getRemoteMetadata(name, _options, function handleUplinkMetadataResponse(err, upLinkResponse, eTag) {
      if (err && err.remoteStatus === 304) {
        upLinkMeta.fetched = Date.now();
      }

      if (err || !upLinkResponse) {
        // $FlowFixMe
        return reject(err || ErrorCode.get500('no data'));
      }

      try {
        validate_metadata(upLinkResponse, name);
      } catch (err) {
        logger.error({
          sub: 'out',
          err: err,
        }, 'package.json validating error @{!err.message}\n@{err.stack}');
        return reject(err);
      }

      packageInfo._uplinks[upLink.upname] = {
        etag: eTag,
        fetched: Date.now(),
      };

      // added to fix verdaccio#73
      if ('time' in upLinkResponse) {
        packageInfo.time = upLinkResponse.time;
      }

      updateVersionsHiddenUpLink(upLinkResponse.versions, upLink);

      try {
        mergeVersions(packageInfo, upLinkResponse);
      } catch (err) {
        logger.error({
          sub: 'out',
          err: err,
        }, 'package.json parsing error @{!err.message}\n@{err.stack}');
        return reject(err);
      }

      // if we got to this point, assume that the correct package exists
      // on the uplink
      resolve(true);
    });
  });
}
