import assert from 'assert';
import Stream from 'stream';
import async, { AsyncResultArrayCallback } from 'async';
import _ from 'lodash';
import { Request } from 'express';
import buildDebug from 'debug';

import { ProxyStorage } from '@verdaccio/proxy';
import { API_ERROR, HTTP_STATUS, DIST_TAGS } from '@verdaccio/dev-commons';
import { ReadTarball } from '@verdaccio/streams';
import {
  ErrorCode,
  normalizeDistTags,
  validateMetadata,
  isObject,
  hasProxyTo,
} from '@verdaccio/utils';
import { setupUpLinks, updateVersionsHiddenUpLink, ProxyList, IProxy } from '@verdaccio/proxy';
import {
  IReadTarball,
  IUploadTarball,
  Versions,
  Package,
  Config,
  MergeTags,
  Version,
  DistFile,
  StringValue,
  IPluginStorageFilter,
  IBasicStorage,
  IPluginStorage,
  Callback,
  Logger,
  GenericBody,
  TokenFilter,
  Token,
  IStorageManager,
  ITokenActions,
} from '@verdaccio/types';
import { logger } from '@verdaccio/logger';
import { VerdaccioError } from '@verdaccio/commons-api';
import { SearchInstance } from './search';

import { LocalStorage } from './local-storage';
import { mergeVersions } from './metadata-utils';
import {
  checkPackageLocal,
  publishPackage,
  checkPackageRemote,
  cleanUpLinksRef,
  mergeUplinkTimeIntoLocal,
  generatePackageTemplate,
} from './storage-utils';

const debug = buildDebug('verdaccio:storage');

export interface IGetPackageOptions {
  callback: Callback;
  name: string;
  keepUpLinkData: boolean;
  uplinksLook: boolean;
  req: any;
}

export interface IStorage extends IBasicStorage<Config>, ITokenActions {
  config: Config;
  storagePlugin: IPluginStorage<Config>;
  logger: Logger;
}

export interface ISyncUplinks {
  uplinksLook?: boolean;
  etag?: string;
  req?: Request;
}

export type IPluginFilters = IPluginStorageFilter<Config>[];

export interface IStorageHandler extends IStorageManager<Config>, ITokenActions {
  config: Config;
  localStorage: IStorage | null;
  filters: IPluginFilters;
  uplinks: ProxyList;
  init(config: Config, filters: IPluginFilters): Promise<string>;
  saveToken(token: Token): Promise<any>;
  deleteToken(user: string, tokenKey: string): Promise<any>;
  readTokens(filter: TokenFilter): Promise<Token[]>;
  _syncUplinksMetadata(name: string, packageInfo: Package, options: any, callback: Callback): void;
  _updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy): void;
}

class Storage {
  public localStorage: IStorage;
  public config: Config;
  public logger: Logger;
  public uplinks: ProxyList;
  public filters: IPluginFilters;

  public constructor(config: Config) {
    this.config = config;
    this.uplinks = setupUpLinks(config);
    debug('uplinks available %o', this.uplinks);
    this.logger = logger.child({ module: 'storage' });
    this.filters = [];
    // @ts-ignore
    this.localStorage = null;
  }

  public init(config: Config, filters: IPluginFilters = []): Promise<string> {
    this.filters = filters;
    debug('filters available %o', filters);
    this.localStorage = new LocalStorage(this.config, logger);

    return this.localStorage.getSecret(config);
  }

  /**
   *  Add a {name} package to a system
   Function checks if package with the same name is available from uplinks.
   If it isn't, we create package locally
   Used storages: local (write) && uplinks
   */
  public async addPackage(name: string, metadata: any, callback: Function): Promise<void> {
    try {
      debug('add package for %o', name);
      await checkPackageLocal(name, this.localStorage);
      debug('look up remote for %o', name);
      await checkPackageRemote(
        name,
        this._isAllowPublishOffline(),
        this._syncUplinksMetadata.bind(this)
      );
      debug('publishing a package for %o', name);
      await publishPackage(name, metadata, this.localStorage as IStorage);
      callback();
    } catch (err) {
      debug('error on add a package for %o with error %o', name, err?.error);
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
    debug('add the version %o for package %o', version, name);
    this.localStorage.addVersion(name, version, metadata, tag, callback);
  }

  /**
   * Tags a package version with a provided tag
   Used storages: local (write)
   */
  public mergeTags(name: string, tagHash: MergeTags, callback: Callback): void {
    debug('merge tags for package %o tags %o', name, tagHash);
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
    debug('change existing package for package %o revision %o', name, revision);
    this.localStorage.changePackage(name, metadata, revision, callback);
  }

  /**
   * Remove a package from a system
   Function removes a package from local storage
   Used storages: local (write)
   */
  public removePackage(name: string, callback: Callback): void {
    debug('remove packagefor package %o', name);
    this.localStorage.removePackage(name, callback);
    // update the indexer
    SearchInstance.remove(name);
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
  public addTarball(name: string, filename: string): IUploadTarball {
    debug('add tarball for package %o', name);
    return this.localStorage.addTarball(name, filename);
  }

  /**
   Get a tarball from a storage for {name} package
   Function is synchronous and returns a ReadableStream
   Function tries to read tarball locally, if it fails then it reads package
   information in order to figure out where we can get this tarball from
   Used storages: local || uplink (just one)
   */
  public getTarball(name: string, filename: string): IReadTarball {
    debug('get tarball for package %o filename %o', name, filename);
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
          self.config
        );
      }

      let savestream: IUploadTarball | null = null;
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
            'error saving file @{fileName}: @{err?.message}\n@{err.stack}'
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
  public getPackage(options: IGetPackageOptions): void {
    const { name } = options;
    debug('get package for %o', name);
    this.localStorage.getPackageMetadata(name, (err, data): void => {
      if (err && (!err.status || err.status >= HTTP_STATUS.INTERNAL_ERROR)) {
        // report internal errors right away
        debug('error on get package for %o with error %o', name, err?.message);
        return options.callback(err);
      }

      debug('sync uplinks for %o', name);
      this._syncUplinksMetadata(
        name,
        data,
        { req: options.req, uplinksLook: options.uplinksLook },
        function getPackageSynUpLinksCallback(err, result: Package, uplinkErrors): void {
          if (err) {
            debug('error on sync package for %o with error %o', name, err?.message);
            return options.callback(err);
          }

          normalizeDistTags(cleanUpLinksRef(options.keepUpLinkData, result));

          // npm can throw if this field doesn't exist
          result._attachments = {};

          debug('sync uplinks errors %o', uplinkErrors);
          options.callback(null, result, uplinkErrors);
        }
      );
    });
  }

  /**
   Retrieve remote and local packages more recent than {startkey}
   Function streams all packages from all uplinks first, and then
   local packages.
   Note that local packages could override registry ones just because
   they appear in JSON last. That's a trade-off we make to avoid
   memory issues.
   Used storages: local && uplink (proxy_access)
   * @param {*} startkey
   * @param {*} options
   * @return {Stream}
   */
  public search(startkey: string, options: any): IReadTarball {
    const self = this;
    // stream to write a tarball
    const stream: any = new Stream.PassThrough({ objectMode: true });

    async.eachSeries(
      Object.keys(this.uplinks),
      function (up_name, cb): void {
        // shortcut: if `local=1` is supplied, don't call uplinks
        if (options.req.query.local !== undefined) {
          return cb();
        }
        // search by keyword for each uplink
        const lstream: IUploadTarball = self.uplinks[up_name].search(options);
        // join streams
        lstream.pipe(stream, { end: false });
        lstream.on('error', function (err): void {
          self.logger.error({ err: err }, 'uplink error: @{err?.message}');
          cb();
          cb = function (): void {};
        });
        lstream.on('end', function (): void {
          cb();
          cb = function (): void {};
        });

        stream.abort = function (): void {
          if (lstream.abort) {
            lstream.abort();
          }
          cb();
          cb = function (): void {};
        };
      },
      // executed after all series
      function (): void {
        // attach a local search results
        const lstream: IReadTarball = self.localStorage.search(startkey, options);
        stream.abort = function (): void {
          lstream.abort();
        };
        lstream.pipe(stream, { end: true });
        lstream.on('error', function (err: VerdaccioError): void {
          self.logger.error({ err: err }, 'search error: @{err?.message}');
          stream.end();
        });
      }
    );

    return stream;
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
        self.localStorage.getPackageMetadata(locals[itemPkg], function (
          err,
          pkgMetadata: Package
        ): void {
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
        });
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
    packageInfo: Package,
    options: ISyncUplinks,
    callback: Callback
  ): void {
    let found = true;
    const self = this;
    const upLinks: IProxy[] = [];
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
      (upLink, cb): void => {
        const _options = Object.assign({}, options);
        const upLinkMeta = packageInfo._uplinks[upLink.upname];

        if (isObject(upLinkMeta)) {
          const fetched = upLinkMeta.fetched;

          if (fetched && Date.now() - fetched < upLink.maxage) {
            return cb();
          }

          _options.etag = upLinkMeta.etag;
        }

        upLink.getRemoteMetadata(name, _options, (err, upLinkResponse, eTag): void => {
          if (err && err.remoteStatus === 304) {
            upLinkMeta.fetched = Date.now();
          }

          if (err || !upLinkResponse) {
            return cb(null, [err || ErrorCode.getInternalError('no data')]);
          }

          try {
            validateMetadata(upLinkResponse, name);
          } catch (err) {
            self.logger.error(
              {
                sub: 'out',
                err: err,
              },
              'package.json validating error @{!err?.message}\n@{err.stack}'
            );
            return cb(null, [err]);
          }

          packageInfo._uplinks[upLink.upname] = {
            etag: eTag,
            fetched: Date.now(),
          };

          packageInfo.time = mergeUplinkTimeIntoLocal(packageInfo, upLinkResponse);

          updateVersionsHiddenUpLink(upLinkResponse.versions, upLink);

          try {
            mergeVersions(packageInfo, upLinkResponse);
          } catch (err) {
            self.logger.error(
              {
                sub: 'out',
                err: err,
              },
              'package.json parsing error @{!err?.message}\n@{err.stack}'
            );
            return cb(null, [err]);
          }

          // if we got to this point, assume that the correct package exists
          // on the uplink
          found = true;
          cb();
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
              try {
                // These filters can assume it's save to modify packageJsonLocal and return it directly for
                // performance (i.e. need not be pure)
                packageJsonLocal = await filter.filter_metadata(packageJsonLocal);
              } catch (err) {
                filterErrors.push(err);
              }
            }
            callback(null, packageJsonLocal, _.concat(upLinksErrors, filterErrors));
          }
        );
      }
    );
  }

  /**
   * Set a hidden value for each version.
   * @param {Array} versions list of version
   * @param {String} upLink uplink name
   * @private
   */
  public _updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy): void {
    for (const i in versions) {
      if (Object.prototype.hasOwnProperty.call(versions, i)) {
        const version = versions[i];

        // holds a "hidden" value to be used by the package storage.
        // $FlowFixMe
        version[Symbol.for('__verdaccio_uplink')] = upLink.upname;
      }
    }
  }
}

export { Storage };
