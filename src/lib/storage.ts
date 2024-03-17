import assert from 'assert';
import async, { AsyncResultArrayCallback } from 'async';
import buildDebug from 'debug';
import _ from 'lodash';

import { hasProxyTo } from '@verdaccio/config';
import { pluginUtils, searchUtils, validatioUtils } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import { ProxySearchParams, ProxyStorage } from '@verdaccio/proxy';
import Search from '@verdaccio/search';
import { SearchMemoryIndexer } from '@verdaccio/search-indexer';
import { ReadTarball } from '@verdaccio/streams';
import {
  Callback,
  Config,
  DistFile,
  Logger,
  Manifest,
  MergeTags,
  Package,
  Version,
  Versions,
} from '@verdaccio/types';
import { GenericBody, Token, TokenFilter } from '@verdaccio/types';

import { logger } from '../lib/logger';
import { IPluginFilters, ISyncUplinks, StringValue } from '../types';
import { API_ERROR, DIST_TAGS, HTTP_STATUS } from './constants';
import LocalStorage from './local-storage';
import { mergeVersions } from './metadata-utils';
import { mapManifestToSearchPackageBody } from './search-utils';
import {
  checkPackageLocal,
  checkPackageRemote,
  cleanUpLinksRef,
  convertAbbreviatedManifest,
  generatePackageTemplate,
  mergeUplinkTimeIntoLocal,
  publishPackage,
} from './storage-utils';
import { setupUpLinks, updateVersionsHiddenUpLink } from './uplink-util';
import { ErrorCode, isObject, normalizeDistTags } from './utils';
import { removeLowerVersions } from './versions-utils';

const debug = buildDebug('verdaccio:storage');

class Storage {
  public localStorage: LocalStorage;
  public config: Config;
  public logger: Logger;
  public uplinks: Record<string, ProxyStorage>;
  public filters: IPluginFilters;
  private searchService: Search;

  public constructor(config: Config) {
    this.config = config;
    this.uplinks = setupUpLinks(config);

    this.logger = logger.child({ module: 'storage' });
    this.searchService = new Search(config, this.logger);
    this.filters = [];
    // @ts-ignore
    this.localStorage = null;
    debug('uplinks available %o', Object.keys(this.uplinks));
  }

  public async init(config: Config): Promise<void> {
    if (this.localStorage === null) {
      this.localStorage = new LocalStorage(this.config, logger);
      await this.localStorage.init();
      debug('local init storage initialized');
      this.localStorage.getSecret(config);
      debug('local storage secret initialized');
    }
    if (!this.filters) {
      this.filters = await asyncLoadPlugin<pluginUtils.ManifestFilter<unknown>>(
        this.config.filters,
        {
          config: this.config,
          logger: this.logger,
        },
        (plugin: pluginUtils.ManifestFilter<Config>) => {
          return typeof plugin.filter_metadata !== 'undefined';
        },
        this.config?.serverSettings?.pluginPrefix
      );
      debug('filters available %o', this.filters);
    }
    return;
  }

  /**
   *  Add a {name} package to a system
   Function checks if package with the same name is available from uplinks.
   If it isn't, we create package locally
   Used storages: local (write) && uplinks
   */
  public async addPackage(name: string, metadata: any, callback: Function): Promise<void> {
    try {
      await checkPackageLocal(name, this.localStorage);
      await checkPackageRemote(
        name,
        this._isAllowPublishOffline(),
        this._syncUplinksMetadata.bind(this)
      );
      await publishPackage(name, metadata, this.localStorage);
      callback();
    } catch (err: any) {
      callback(err);
    }
  }

  private _isAllowPublishOffline(): boolean {
    return (
      typeof this.config.publish !== 'undefined' &&
      _.isBoolean(this.config.publish.allow_offline) &&
      this.config.publish.allow_offline
    );
  }

  public readTokens(filter: TokenFilter): Promise<Token[]> {
    return this.localStorage.readTokens(filter);
  }

  public saveToken(token: Token): Promise<void> {
    return this.localStorage.saveToken(token);
  }

  public deleteToken(user: string, tokenKey: string): Promise<any> {
    return this.localStorage.deleteToken(user, tokenKey);
  }

  /**
   * Add a new version of package {name} to a system
   Used storages: local (write)
   */
  public addVersion(
    name: string,
    version: string,
    metadata: Version,
    tag: StringValue,
    callback: Callback
  ): void {
    this.localStorage.addVersion(name, version, metadata, tag, callback);
  }

  /**
   * Tags a package version with a provided tag
   Used storages: local (write)
   */
  public mergeTags(name: string, tagHash: MergeTags, callback: Callback): void {
    this.localStorage.mergeTags(name, tagHash, callback);
  }

  /**
   * Change an existing package (i.e. unpublish one version)
   Function changes a package info from local storage and all uplinks with write access./
   Used storages: local (write)
   */
  public changePackage(
    name: string,
    metadata: Package,
    revision: string,
    callback: Callback
  ): void {
    this.localStorage.changePackage(name, metadata, revision, callback);
  }

  /**
   * Remove a package from a system
   Function removes a package from local storage
   Used storages: local (write)
   */
  public removePackage(name: string, callback: Callback): void {
    this.localStorage.removePackage(name, callback);
    // update the indexer
    SearchMemoryIndexer.remove(name).catch((reason) => {
      logger.error('indexer has failed on remove item');
    });
  }

  /**
   Remove a tarball from a system
   Function removes a tarball from local storage.
   Tarball in question should not be linked to in any existing
   versions, i.e. package version should be unpublished first.
   Used storage: local (write)
   */
  public removeTarball(name: string, filename: string, revision: string, callback: Callback): void {
    this.localStorage.removeTarball(name, filename, revision, callback);
  }

  /**
   * Upload a tarball for {name} package
   Function is synchronous and returns a WritableStream
   Used storages: local (write)
   */
  public addTarball(name: string, filename: string) {
    return this.localStorage.addTarball(name, filename);
  }

  public hasLocalTarball(name: string, filename: string): Promise<boolean> {
    const self = this;
    return new Promise<boolean>((resolve, reject): void => {
      let localStream: any = self.localStorage.getTarball(name, filename);
      let isOpen = false;
      localStream.on('error', (err): any => {
        if (isOpen || err.status !== HTTP_STATUS.NOT_FOUND) {
          reject(err);
        }
        // local reported 404 or request was aborted already
        if (localStream) {
          localStream.abort();
          localStream = null;
        }
        resolve(false);
      });
      localStream.on('open', function (): void {
        isOpen = true;
        localStream.abort();
        localStream = null;
        resolve(true);
      });
    });
  }

  /**
   Get a tarball from a storage for {name} package
   Function is synchronous and returns a ReadableStream
   Function tries to read tarball locally, if it fails then it reads package
   information in order to figure out where we can get this tarball from
   Used storages: local || uplink (just one)
   */
  public getTarball(name: string, filename: string) {
    const readStream = new ReadTarball({});
    readStream.abort = function () {};

    const self = this;

    // if someone requesting tarball, it means that we should already have some
    // information about it, so fetching package info is unnecessary

    // trying local first
    // flow: should be IReadTarball
    let localStream: any = self.localStorage.getTarball(name, filename);
    let isOpen = false;
    localStream.on('error', (err): any => {
      if (isOpen || err.status !== HTTP_STATUS.NOT_FOUND) {
        return readStream.emit('error', err);
      }

      // local reported 404
      const err404 = err;
      localStream.abort();
      localStream = null; // we force for garbage collector
      self.localStorage.getPackageMetadata(name, (err, info: Package): void => {
        if (_.isNil(err) && info._distfiles && _.isNil(info._distfiles[filename]) === false) {
          // information about this file exists locally
          serveFile(info._distfiles[filename]);
        } else {
          // we know nothing about this file, trying to get information elsewhere
          self._syncUplinksMetadata(name, info, {}, (err, info: Package): any => {
            if (_.isNil(err) === false) {
              return readStream.emit('error', err);
            }
            if (_.isNil(info._distfiles) || _.isNil(info._distfiles[filename])) {
              return readStream.emit('error', err404);
            }
            serveFile(info._distfiles[filename]);
          });
        }
      });
    });
    localStream.on('content-length', function (v): void {
      readStream.emit('content-length', v);
    });
    localStream.on('open', function (): void {
      isOpen = true;
      localStream.pipe(readStream);
    });
    return readStream;

    /**
     * Fetch and cache local/remote packages.
     * @param {Object} file define the package shape
     */
    function serveFile(file: DistFile): void {
      let uplink: any = null;

      for (const uplinkId in self.uplinks) {
        if (hasProxyTo(name, uplinkId, self.config.packages)) {
          uplink = self.uplinks[uplinkId];
        }
      }

      if (uplink == null) {
        uplink = new ProxyStorage(
          {
            url: file.url,
            cache: true,
            _autogenerated: true,
          },
          self.config,
          logger
        );
      }

      let savestream: any = null;
      if (uplink.config.cache) {
        savestream = self.localStorage.addTarball(name, filename);
      }

      let on_open = function (): void {
        // prevent it from being called twice
        on_open = function () {};
        const rstream2 = uplink.fetchTarball(file.url);
        rstream2.on('error', function (err): void {
          if (savestream) {
            savestream.abort();
          }
          savestream = null;
          readStream.emit('error', err);
        });
        rstream2.on('end', function (): void {
          if (savestream) {
            savestream.done();
          }
        });

        rstream2.on('content-length', function (v): void {
          readStream.emit('content-length', v);
          if (savestream) {
            savestream.emit('content-length', v);
          }
        });
        rstream2.pipe(readStream);
        if (savestream) {
          rstream2.pipe(savestream);
        }
      };

      if (savestream) {
        savestream.on('open', function (): void {
          on_open();
        });

        savestream.on('error', function (err): void {
          self.logger.warn(
            { err: err, fileName: file },
            'error saving file @{fileName}: @{err.message}\n@{err.stack}'
          );
          if (savestream) {
            savestream.abort();
          }
          savestream = null;
          on_open();
        });
      } else {
        on_open();
      }
    }
  }

  /**
   Retrieve a package metadata for {name} package
   Function invokes localStorage.getPackage and uplink.get_package for every
   uplink with proxy_access rights against {name} and combines results
   into one json object
   Used storages: local && uplink (proxy_access)

   * @param {object} options
   * @property {string} options.name Package Name
   * @property {object}  options.req Express `req` object
   * @property {boolean} options.keepUpLinkData keep up link info in package meta, last update, etc.
   * @property {function} options.callback Callback for receive data
   */
  public getPackage(options): void {
    this.localStorage.getPackageMetadata(options.name, (err, data): void => {
      if (err && (!err.status || err.status >= HTTP_STATUS.INTERNAL_ERROR)) {
        // report internal errors right away
        return options.callback(err);
      }

      this._syncUplinksMetadata(
        options.name,
        data,
        { req: options.req, uplinksLook: options.uplinksLook },
        function getPackageSynUpLinksCallback(err, result: Package, uplinkErrors): void {
          if (err) {
            return options.callback(err);
          }

          normalizeDistTags(cleanUpLinksRef(options.keepUpLinkData, result));

          // npm can throw if this field doesn't exist
          result._attachments = {};
          if (options.abbreviated === true) {
            options.callback(null, convertAbbreviatedManifest(result), uplinkErrors);
          } else {
            options.callback(null, result, uplinkErrors);
          }
        }
      );
    });
  }

  public async getCachedPackages(
    query?: searchUtils.SearchQuery
  ): Promise<searchUtils.SearchPackageItem[]> {
    debug('search on each package', query);
    const results: searchUtils.SearchPackageItem[] = [];
    if (typeof query === 'undefined' || typeof query?.text === 'undefined') {
      debug('search query for cached not found');
      return results;
    }

    logger.debug(
      { t: query.text, q: query.quality, p: query.popularity, m: query.maintenance, s: query.size },
      'search by text @{t}| maintenance @{m}| quality @{q}| popularity @{p}'
    );

    if (typeof this.localStorage.search === 'undefined') {
      logger.info('plugin search not implemented yet');
    } else {
      debug('search on each package by plugin query');
      const items = await this.localStorage.search(query);
      try {
        for (const searchItem of items) {
          const manifest = await this.localStorage.getPackageMetadataAsync(searchItem.package.name);
          if (_.isEmpty(manifest?.versions) === false) {
            const searchPackage = mapManifestToSearchPackageBody(manifest, searchItem);
            debug('search local stream found %o', searchPackage.name);
            const searchPackageItem: searchUtils.SearchPackageItem = {
              package: searchPackage,
              score: searchItem.score,
              verdaccioPkgCached: searchItem.verdaccioPkgCached,
              verdaccioPrivate: searchItem.verdaccioPrivate,
              flags: searchItem?.flags,
              // FUTURE: find a better way to calculate the score
              searchScore: 1,
            };
            results.push(searchPackageItem);
          } else {
            debug('local item without versions detected %s', searchItem.package.name);
          }
        }
        debug('search local stream end');
      } catch (err) {
        this.logger.error({ err, query }, 'error on search by plugin @{err.message}');
        throw err;
      }
    }
    return results;
  }

  /**
   * Handle search on packages and proxies.
   * Iterate all proxies configured and search in all endpoints in v2 and pipe all responses
   *  once the proxies request has finished search in local storage for all packages
   * (privated and cached).
   */
  public async search(options: ProxySearchParams): Promise<searchUtils.SearchPackageItem[]> {
    debug('search on cache packages');
    const cachePackages = await this.getCachedPackages(options.query);
    debug('search found on cache packages %o', cachePackages.length);
    const remotePackages = await this.searchService.search(options);
    debug('search found on remote packages %o', remotePackages.length);
    const totalResults = [...cachePackages, ...remotePackages];
    const uniqueResults = removeLowerVersions(totalResults);
    debug('unique results %o', uniqueResults.length);
    return uniqueResults;
  }

  /**
   * Retrieve only private local packages
   * @param {*} callback
   */
  public getLocalDatabase(callback: Callback): void {
    const self = this;
    this.localStorage.storagePlugin.get((err, locals): void => {
      if (err) {
        callback(err);
      }

      const packages: Version[] = [];
      const getPackage = function (itemPkg): void {
        self.localStorage.getPackageMetadata(
          locals[itemPkg],
          function (err, pkgMetadata: Package): void {
            if (_.isNil(err)) {
              const latest = pkgMetadata[DIST_TAGS].latest;
              if (latest && pkgMetadata.versions[latest]) {
                const version: Version = pkgMetadata.versions[latest];
                const timeList = pkgMetadata.time as GenericBody;
                const time = timeList[latest];
                // @ts-ignore
                version.time = time;

                // Add for stars api
                // @ts-ignore
                version.users = pkgMetadata.users;

                packages.push(version);
              } else {
                self.logger.warn(
                  { package: locals[itemPkg] },
                  'package @{package} does not have a "latest" tag?'
                );
              }
            }

            if (itemPkg >= locals.length - 1) {
              callback(null, packages);
            } else {
              getPackage(itemPkg + 1);
            }
          }
        );
      };

      if (locals.length) {
        getPackage(0);
      } else {
        callback(null, []);
      }
    });
  }

  /**
   * Function fetches package metadata from uplinks and synchronizes it with local data
   if package is available locally, it MUST be provided in pkginfo
   returns callback(err, result, uplink_errors)
   */
  public _syncUplinksMetadata(
    name: string,
    packageInfo: Manifest,
    options: ISyncUplinks,
    callback: Callback
  ): void {
    let found = true;
    const self = this;
    const upLinks: ProxyStorage[] = [];
    const hasToLookIntoUplinks = _.isNil(options.uplinksLook) || options.uplinksLook;

    if (!packageInfo) {
      found = false;
      packageInfo = generatePackageTemplate(name);
    }

    for (const uplink in this.uplinks) {
      if (hasProxyTo(name, uplink, this.config.packages) && hasToLookIntoUplinks) {
        upLinks.push(this.uplinks[uplink]);
      }
    }

    async.map(
      upLinks,
      (upLink: ProxyStorage, cb): void => {
        const _options = Object.assign({}, options);
        const upLinkMeta = packageInfo._uplinks[upLink.upname];

        if (isObject(upLinkMeta)) {
          const fetched = upLinkMeta.fetched;

          if (fetched && Date.now() - fetched < upLink.maxage) {
            return cb();
          }

          _options.etag = upLinkMeta.etag;
        }

        upLink
          .getRemoteMetadata(name, _options)
          .then(([upLinkResponse, eTag]) => {
            try {
              upLinkResponse = validatioUtils.normalizeMetadata(upLinkResponse, name);
            } catch (err) {
              self.logger.error(
                {
                  sub: 'out',
                  err: err,
                },
                'package.json validating error @{!err.message}\n@{err.stack}'
              );
              return cb(null, [err]);
            }

            packageInfo._uplinks[upLink.upname] = {
              etag: eTag,
              fetched: Date.now(),
            };

            packageInfo = mergeUplinkTimeIntoLocal(packageInfo, upLinkResponse);

            updateVersionsHiddenUpLink(upLinkResponse.versions, upLink);

            try {
              mergeVersions(packageInfo, upLinkResponse);
            } catch (err) {
              self.logger.error(
                {
                  sub: 'out',
                  err: err,
                },
                'package.json parsing error @{!err.message}\n@{err.stack}'
              );
              return cb(null, [err]);
            }

            // if we got to this point, assume that the correct package exists
            // on the uplink
            found = true;
            cb();
          })
          .catch((err) => {
            if (err && err.remoteStatus === 304) {
              upLinkMeta.fetched = Date.now();
            }
            return cb(null, [err || ErrorCode.getInternalError('no data')]);
          });
      },
      // @ts-ignore
      (err: Error, upLinksErrors: any): AsyncResultArrayCallback<unknown, Error> => {
        assert(!err && Array.isArray(upLinksErrors));

        // Check for connection timeout or reset errors with uplink(s)
        // (these should be handled differently from the package not being found)
        if (!found) {
          let uplinkTimeoutError;
          for (let i = 0; i < upLinksErrors.length; i++) {
            if (upLinksErrors[i]) {
              for (let j = 0; j < upLinksErrors[i].length; j++) {
                if (upLinksErrors[i][j]) {
                  const code = upLinksErrors[i][j].code;
                  if (code === 'ETIMEDOUT' || code === 'ESOCKETTIMEDOUT' || code === 'ECONNRESET') {
                    uplinkTimeoutError = true;
                    break;
                  }
                }
              }
            }
          }

          if (uplinkTimeoutError) {
            return callback(ErrorCode.getServiceUnavailable(), null, upLinksErrors);
          }
          return callback(ErrorCode.getNotFound(API_ERROR.NO_PACKAGE), null, upLinksErrors);
        }

        if (upLinks.length === 0) {
          return callback(null, packageInfo);
        }

        self.localStorage.updateVersions(
          name,
          packageInfo,
          async (err, packageJsonLocal: Package): Promise<any> => {
            if (err) {
              return callback(err);
            }
            // Any error here will cause a 404, like an uplink error. This is likely the right thing to do
            // as a broken filter is a security risk.
            const filterErrors: Error[] = [];
            // This MUST be done serially and not in parallel as they modify packageJsonLocal
            for (const filter of self.filters) {
              // These filters can assume it's save to modify packageJsonLocal and return it directly for
              // performance (i.e. need not be pure)
              const [_filteredManifest, _filtersErrors] = await this.applyFilters(packageJsonLocal);
              packageJsonLocal = _filteredManifest;
              filterErrors.push(...filterErrors);
            }
            callback(null, packageJsonLocal, [...upLinksErrors, ...filterErrors]);
          }
        );
      }
    );
  }

  /**
   * Apply filters to manifest.
   * @param manifest
   * @returns
   */
  public async applyFilters(manifest: Manifest): Promise<[Manifest, any]> {
    if (this.filters === null || this.filters.length === 0) {
      debug('no filters to be applied');
      return [manifest, []];
    }

    let filterPluginErrors: any[] = [];
    let filteredManifest = { ...manifest };
    for (const filter of this.filters) {
      // These filters can assume it's save to modify packageJsonLocal
      // and return it directly for
      // performance (i.e. need not be pure)
      try {
        debug('applying filter to %s', manifest.name);
        filteredManifest = await filter.filter_metadata(manifest);
        debug('filter applied to %s', manifest.name);
      } catch (err: any) {
        debug('filter apply has failed');
        this.logger.error({ err: err.message }, 'filter has failed @{err}');
        filterPluginErrors.push(err);
      }
    }
    return [filteredManifest, filterPluginErrors];
  }

  /**
   * Set a hidden value for each version.
   * @param {Array} versions list of version
   * @param {String} upLink uplink name
   * @private
   */
  public _updateVersionsHiddenUpLink(versions: Versions, upLink: ProxyStorage): void {
    for (const i in versions) {
      if (Object.prototype.hasOwnProperty.call(versions, i)) {
        const version = versions[i];

        // holds a "hidden" value to be used by the package storage.
        version[Symbol.for('__verdaccio_uplink')] = upLink.upname;
      }
    }
  }
}

export default Storage;
