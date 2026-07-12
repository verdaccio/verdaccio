import assert from 'assert';
import async from 'async';
import buildDebug from 'debug';
import _ from 'lodash';
import Stream from 'stream';

import { hasProxyTo } from '@verdaccio/config';
import { PLUGIN_CATEGORY, pluginUtils, validationUtils } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import LocalDatabasePlugin from '@verdaccio/local-storage-legacy';
import { SearchMemoryIndexer } from '@verdaccio/search-indexer';
import { ReadTarball } from '@verdaccio/streams';
import {
  Callback,
  Config,
  DistFile,
  Logger,
  Manifest,
  MergeTags,
  Version,
  Versions,
} from '@verdaccio/types';
import { GenericBody, Token, TokenFilter } from '@verdaccio/types';

import { StoragePluginLegacy } from '../../types/custom';
import { logger } from '../lib/logger';
import { IPluginFilters, ISyncUplinks, StringValue } from '../types';
import { API_ERROR, DIST_TAGS, HTTP_STATUS } from './constants';
import LocalStorage, { StoragePlugin } from './local-storage';
import { mergeVersions } from './metadata-utils';
import {
  checkPackageLocal,
  checkPackageRemote,
  cleanUpLinksRef,
  convertAbbreviatedManifest,
  generatePackageTemplate,
  lookupDistFile,
  mergeUplinkTimeIntoLocal,
  publishPackage,
} from './storage-utils';
import ProxyStorage from './up-storage';
import { setupUpLinks, updateVersionsHiddenUpLink } from './uplink-util';
import { ErrorCode, hasTarball, isObject, normalizeDistTags } from './utils';

const debug = buildDebug('verdaccio:storage');

class Storage {
  public localStorage: LocalStorage;
  public config: Config;
  public logger: Logger;
  public uplinks: Record<string, ProxyStorage>;
  public filters: IPluginFilters | undefined;

  public constructor(config: Config) {
    this.config = config;
    this.uplinks = setupUpLinks(config);
    this.logger = logger;
    // @ts-ignore
    this.localStorage = null;
  }

  /**
   * Initialize the storage: load the storage plugin (or the default
   * local storage) and the filter plugins. Safe to call once; subsequent
   * calls only reload missing filters.
   * @param {Config} config verdaccio configuration
   * @param {IPluginFilters} filters preloaded filter plugins; when omitted they are loaded from the configuration
   */
  public async init(config: Config, filters?: IPluginFilters): Promise<void> {
    if (this.localStorage === null) {
      this.filters = filters;
      const storageInstance = await this.loadStorage(config, this.logger);
      this.localStorage = new LocalStorage(this.config, logger, storageInstance);
      await this.localStorage.getSecret(config);
      debug('initialization completed');
    } else {
      debug('storage has been already initialized');
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
        true,
        this.config?.serverSettings?.pluginPrefix,
        PLUGIN_CATEGORY.FILTER
      );
      debug('filters available %o', this.filters.length);
    }
  }

  /**
   * Resolve the storage backend: a configured storage plugin when available,
   * otherwise the default `@verdaccio/local-storage` on the configured path.
   * @return {Promise<StoragePlugin>} the storage plugin instance
   */
  private async loadStorage(config: Config, logger: Logger): Promise<StoragePlugin> {
    const Storage = await this.loadStorePlugin();
    if (_.isNil(Storage)) {
      assert(this.config.storage, 'CONFIG: storage path not defined');
      debug('no custom storage found, loading default storage @verdaccio/local-storage');
      const localStorage = new LocalDatabasePlugin(config, logger);
      logger.info(
        { name: '@verdaccio/local-storage', pluginCategory: PLUGIN_CATEGORY.STORAGE },
        'plugin @{name} successfully loaded (@{pluginCategory})'
      );
      return localStorage;
    }
    return Storage as StoragePlugin;
  }

  /**
   * Load the storage plugins declared under `store` in the configuration.
   * Only one storage is supported: with several plugins configured the
   * first loaded one wins and a warning is logged.
   * @return {Promise<StoragePluginLegacy<Config> | undefined>} the selected plugin, or undefined when none is configured
   */
  private async loadStorePlugin(): Promise<StoragePluginLegacy<Config> | undefined> {
    const plugins: StoragePluginLegacy<Config>[] = await asyncLoadPlugin<
      pluginUtils.Storage<unknown>
    >(
      this.config.store,
      {
        config: this.config,
        logger: this.logger,
      },
      (plugin) => {
        return typeof plugin.getPackageStorage !== 'undefined';
      },
      true,
      this.config?.serverSettings?.pluginPrefix,
      PLUGIN_CATEGORY.STORAGE
    );

    if (plugins.length > 1) {
      this.logger.warn(
        'more than one storage plugins has been detected, multiple storage are not supported, one will be selected automatically'
      );
    }

    return _.head(plugins);
  }

  /**
   * Add a package to the system (publish flow).
   * Verifies the package does not exist locally nor on any uplink before
   * creating it locally; uplinks being offline rejects the publish unless
   * `publish.allow_offline` is enabled.
   * Used storages: local (write) && uplinks
   * @param {String} name package name
   * @param {Object} metadata package manifest to publish
   * @param {Function} callback invoked with an error when the publish is rejected
   */
  public async addPackage(name: string, metadata: any, callback: any): Promise<void> {
    debug('add package %o', name);
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

  /**
   * Whether `publish.allow_offline` is enabled in the configuration.
   * @return {Boolean} true when publishing with unreachable uplinks is allowed
   */
  private _isAllowPublishOffline(): boolean {
    return (
      typeof this.config.publish !== 'undefined' &&
      _.isBoolean(this.config.publish.allow_offline) &&
      this.config.publish.allow_offline
    );
  }

  /**
   * Read the npm tokens matching the filter from the token storage.
   * Used storages: local (read)
   */
  public readTokens(filter: TokenFilter): Promise<Token[]> {
    return this.localStorage.readTokens(filter);
  }

  /**
   * Save an npm token to the token storage.
   * Used storages: local (write)
   */
  public saveToken(token: Token): Promise<void> {
    return this.localStorage.saveToken(token);
  }

  /**
   * Delete an npm token from the token storage.
   * Used storages: local (write)
   */
  public deleteToken(user: string, tokenKey: string): Promise<any> {
    return this.localStorage.deleteToken(user, tokenKey);
  }

  /**
   * Add a new version of a package to the system.
   * Used storages: local (write)
   * @param {String} name package name
   * @param {String} version version id, eg. 1.0.0
   * @param {Version} metadata version metadata
   * @param {String} tag dist-tag pointing to the version
   * @param {Function} callback
   */
  public addVersion(
    name: string,
    version: string,
    metadata: Version,
    tag: StringValue,
    callback: Callback
  ): void {
    debug('add version %s package for %s', version, name);
    this.localStorage.addVersion(name, version, metadata, tag, callback);
  }

  /**
   * Tag package versions with the provided dist-tags.
   * Used storages: local (write)
   * @param {String} name package name
   * @param {MergeTags} tagHash dist-tag to version mapping to merge
   * @param {Function} callback
   */
  public mergeTags(name: string, tagHash: MergeTags, callback: Callback): void {
    debug('merge tags for %o', name);
    this.localStorage.mergeTags(name, tagHash, callback);
  }

  /**
   * Change an existing package (eg. unpublish one version).
   * Used storages: local (write)
   * @param {String} name package name
   * @param {Manifest} metadata updated package manifest
   * @param {String} revision expected revision of the stored manifest
   * @param {Function} callback
   */
  public changePackage(
    name: string,
    metadata: Manifest,
    revision: string,
    callback: Callback
  ): void {
    debug('change existing package for package %o revision %o', name, revision);
    this.localStorage.changePackage(name, metadata, revision, callback);
  }

  /**
   * Remove a package from the local storage and the search indexer.
   * Used storages: local (write)
   * @param {String} name package name
   * @param {Function} callback
   */
  public removePackage(name: string, callback: Callback): void {
    debug('remove package %o', name);
    this.localStorage.removePackage(name, callback);
    // update the indexer
    SearchMemoryIndexer.remove(name).catch((reason) => {
      debug('indexer has failed on remove item %o', reason);
      logger.error('indexer has failed on remove item');
    });
  }

  /**
   * Remove a tarball from the local storage. The tarball must not be
   * linked by any existing version, ie. the version should be
   * unpublished first.
   * Used storages: local (write)
   * @param {String} name package name
   * @param {String} filename tarball file name
   * @param {String} revision expected revision of the stored manifest
   * @param {Function} callback
   */
  public removeTarball(name: string, filename: string, revision: string, callback: Callback): void {
    debug('remove tarball %s for %s', filename, name);
    this.localStorage.removeTarball(name, filename, revision, callback);
  }

  /**
   * Upload a tarball (publish flow). Synchronous, returns a writable
   * stream the tarball body is piped into.
   * Used storages: local (write)
   * @param {String} name package name
   * @param {String} filename tarball file name
   * @return {Stream} writable upload stream
   */
  public addTarball(name: string, filename: string) {
    debug('add a tarball for %o', name);
    return this.localStorage.addTarball(name, filename);
  }

  /**
   * Whether a tarball exists in the local storage, without reading it
   * (the stream is aborted as soon as it opens).
   * Used storages: local (read)
   * @param {String} name package name
   * @param {String} filename tarball file name
   * @return {Promise<Boolean>} true when the tarball is stored locally
   */
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
   * Get a tarball. Synchronous, returns a readable stream.
   * The tarball is read locally first; on a local miss the distfile record
   * is resolved from the package metadata (see lookupDistFile), syncing the
   * uplinks when the local metadata does not know the file, and the tarball
   * is then fetched from the uplink that serves the distfile url.
   * Used storages: local || uplink (just one)
   * @param {String} name package name
   * @param {String} filename tarball file name
   * @return {Stream} readable tarball stream
   */
  public getTarball(name: string, filename: string) {
    debug('get tarball for package %o filename %o', name, filename);
    const readStream = new ReadTarball({});
    readStream.abort = function () {};

    const self = this;

    // Check if the tarball is allowed by filter plugins before serving.
    // Filters may block specific versions, so we verify the tarball's version
    // still exists in the filtered metadata.
    this._isTarballAllowedByFilters(name, filename).then(async (allowed) => {
      if (!allowed) {
        readStream.emit('error', ErrorCode.getNotFound(API_ERROR.NO_PACKAGE));
        return;
      }

      // trying local first
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

        const lookupFromUplinks = (info: Manifest | null): void => {
          self._syncUplinksMetadata(
            name,
            info as Manifest,
            {},
            (syncErr, syncInfo: Manifest): any => {
              if (_.isNil(syncErr) === false) {
                return readStream.emit('error', syncErr);
              }
              // _syncUplinksMetadata returns filter-applied metadata; if the
              // version was removed by a filter, surface a 404 like a missing tarball.
              if (self.filters?.length && !hasTarball(syncInfo, filename)) {
                return readStream.emit('error', err404);
              }
              const distFile = lookupDistFile(syncInfo, filename);
              if (_.isNil(distFile)) {
                debug('remote tarball not found');
                return readStream.emit('error', err404);
              }
              debug('dist file found, using it %o', (distFile as DistFile).url);
              serveFile(distFile as DistFile);
            }
          );
        };

        self.localStorage.getPackageMetadataAsync(name).then(
          (info) => {
            const distFile = lookupDistFile(info, filename);
            if (_.isNil(distFile) === false) {
              // information about this file exists locally
              debug('dist file found, using it %o', (distFile as DistFile).url);
              serveFile(distFile as DistFile);
            } else {
              // we know nothing about this file, trying to get information elsewhere
              debug('dist file not found, proceed update upstream');
              lookupFromUplinks(info);
            }
          },
          () => {
            // we know nothing about this file, trying to get information elsewhere
            lookupFromUplinks(null);
          }
        );
      });
      localStream.on('content-length', function (v): void {
        readStream.emit('content-length', v);
      });
      localStream.on('open', function (): void {
        isOpen = true;
        localStream.pipe(readStream);
      });
    });

    return readStream;

    /**
     * Stream the tarball from the uplink serving the distfile, caching it
     * locally (and restoring the distfile record) when the uplink has the
     * cache enabled.
     * @param {DistFile} file distfile record resolved for the tarball
     */
    function serveFile(file: DistFile): void {
      let uplink: any = null;

      if (file.registry && self.uplinks[file.registry]) {
        // the distfile records which uplink it was merged from
        // (see LocalStorage._updateUplinkToRemoteProtocol)
        uplink = self.uplinks[file.registry];
        debug('tarball %o is served by the recorded uplink %o', filename, file.registry);
      } else {
        const candidates: any[] = [];
        for (const uplinkId in self.uplinks) {
          if (hasProxyTo(name, uplinkId, self.config.packages)) {
            candidates.push(self.uplinks[uplinkId]);
          }
        }
        debug('tarball %o has %o candidate uplinks', filename, candidates.length);

        // pick the uplink that actually serves the distfile url, so the
        // request carries the settings of the registry hosting it; with
        // several matching uplinks (duplicated urls) the last configured
        // one keeps winning, exactly like the previous selection did
        for (const candidate of candidates) {
          if (candidate.isUplinkValid(file.url)) {
            uplink = candidate;
          }
        }

        if (uplink !== null) {
          debug('uplink %o url matches tarball %o', uplink.upname, file.url);
        } else if (candidates.length === 1) {
          // a single configured uplink keeps the legacy behavior: tarballs
          // hosted elsewhere (a CDN) may still need its agent/proxy settings
          uplink = candidates[0];
          debug(
            'using the single configured uplink %o for tarball %o hosted elsewhere',
            uplink.upname,
            file.url
          );
        }
      }

      if (uplink == null) {
        debug('upstream not found, creating one for %o', name);
        uplink = new ProxyStorage(
          {
            url: file.url,
            cache: true,
            _autogenerated: true,
          },
          self.config
        );
      }

      let savestream: any = null;
      if (uplink.config.cache) {
        // persist which configured uplink served the tarball, so future
        // fetches can pick it directly (autogenerated proxies have no name)
        debug('cache remote tarball enabled');
        let distFile: DistFile = file;
        if (!file.registry && uplink.upname) {
          debug('recording uplink %o on the persisted distfile for %o', uplink.upname, filename);
          distFile = { ...file, registry: uplink.upname };
        }
        savestream = self.localStorage.addTarball(name, filename, distFile);
      } else {
        debug('cache remote tarball disabled');
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
   * Retrieve the package metadata: the local manifest merged with the
   * manifest of every uplink with proxy access to the package.
   * Used storages: local && uplink (proxy_access)
   * @param {Object} options
   * @property {String} options.name package name
   * @property {Object} options.req Express `req` object
   * @property {Boolean} options.keepUpLinkData keep the uplink info (last update, etc.) in the package metadata
   * @property {Boolean} options.abbreviated serve the abbreviated manifest (npm install)
   * @property {Function} options.callback invoked with the merged manifest and any uplink errors
   */
  public getPackage(options): void {
    debug('get package for %o', options.name);
    this.localStorage.getPackageMetadata(options.name, (err, data): void => {
      if (err && (!err.status || err.status >= HTTP_STATUS.INTERNAL_ERROR)) {
        // report internal errors right away
        return options.callback(err);
      }

      this._syncUplinksMetadata(
        options.name,
        data,
        { req: options.req, uplinksLook: options.uplinksLook },
        function getPackageSynUpLinksCallback(err, result: Manifest, uplinkErrors): void {
          if (err) {
            return options.callback(err);
          }

          normalizeDistTags(cleanUpLinksRef(options.keepUpLinkData, result));

          // npm can throw if this field doesn't exist
          result._attachments = {};
          if (options.abbreviated === true) {
            debug('get abbreviated manifest');
            options.callback(null, convertAbbreviatedManifest(result), uplinkErrors);
          } else {
            debug('get full package manifest');
            options.callback(null, result, uplinkErrors);
          }
        }
      );
    });
  }

  /**
   * Retrieve remote and local packages more recent than the start key.
   * All uplinks are streamed first, then the local packages; local
   * packages can override registry ones just because they appear in the
   * JSON last — a trade-off made to avoid memory issues.
   * Used storages: local && uplink (proxy_access)
   * @param {String} startkey timestamp to search from
   * @param {Object} options request options; `local=1` in the query skips the uplinks
   * @return {Stream} object stream of search results
   */
  public search(startkey: string, options: any) {
    const self = this;
    const searchStream: any = new Stream.PassThrough({ objectMode: true });
    async.eachSeries(
      Object.keys(this.uplinks),
      function (up_name, cb): void {
        // shortcut: if `local=1` is supplied, don't call uplinks
        if (options.req?.query?.local !== undefined) {
          return cb();
        }
        logger.info(`search for uplink ${up_name}`);
        // search by keyword for each uplink
        const uplinkStream = self.uplinks[up_name].search(options);
        // join uplink stream with streams PassThrough
        uplinkStream.pipe(searchStream, { end: false });
        uplinkStream.on('error', function (err): void {
          self.logger.error({ err: err }, 'uplink error: @{err.message}');
          cb();
          // to avoid call callback more than once
          cb = function (): void {};
        });
        uplinkStream.on('end', function (): void {
          cb();
          // to avoid call callback more than once
          cb = function (): void {};
        });

        searchStream.abort = function (): void {
          if (uplinkStream.abort) {
            uplinkStream.abort();
          }
          cb();
          // to avoid call callback more than once
          cb = function (): void {};
        };
      },
      // executed after all series
      function (): void {
        // attach a local search results
        const localSearchStream = self.localStorage.search(startkey, options);
        searchStream.abort = function (): void {
          localSearchStream.abort();
        };
        localSearchStream.pipe(searchStream, { end: true });
        localSearchStream.on('error', function (err: any): void {
          self.logger.error({ err: err }, 'search error: @{err.message}');
          searchStream.end();
        });
      }
    );

    return searchStream;
  }

  /**
   * Retrieve only private local packages, as the latest version of each.
   * Used storages: local (read)
   * @param {Function} callback invoked with the list of latest versions
   */
  public getLocalDatabase(callback: Callback): void {
    this.localStorage.storagePlugin.get((err, locals): void => {
      if (err) {
        return callback(err);
      }

      this._collectLocalPackages(locals).then(
        (packages) => callback(null, packages),
        (err) => callback(err)
      );
    });
  }

  /**
   * Read each local package name, apply filters, and collect the latest version.
   */
  private async _collectLocalPackages(locals: string[]): Promise<Version[]> {
    const packages: Version[] = [];
    for (const name of locals) {
      try {
        const pkgMetadata = await this.localStorage.getPackageMetadataAsync(name);
        const { filteredPackage } = await this._applyFilters(pkgMetadata);
        const latest = filteredPackage[DIST_TAGS]?.latest;
        if (latest && filteredPackage.versions[latest]) {
          const version: Version = filteredPackage.versions[latest];
          const timeList = filteredPackage.time as GenericBody;
          const time = timeList[latest];
          // @ts-ignore
          version.time = time;

          // Add for stars api
          // @ts-ignore
          version.users = filteredPackage.users;

          packages.push(version);
        } else {
          this.logger.warn({ package: name }, 'package @{package} does not have a "latest" tag?');
        }
      } catch (err) {
        this.logger.error({ err, package: name }, 'error reading package @{package}');
      }
    }
    return packages;
  }

  /**
   * Fetch the package metadata from every uplink with proxy access and
   * synchronize it with the local data; filter plugins are applied to the
   * merged result.
   * @param {String} name package name
   * @param {Manifest} packageInfo local manifest; MUST be provided when the package exists locally
   * @param {ISyncUplinks} options uplink request options
   * @param {Function} callback invoked with (err, mergedManifest, uplinkErrors)
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

    debug('sync uplinks for %o', name);
    debug('is sync uplink enabled %o', hasToLookIntoUplinks);
    if (!packageInfo) {
      debug('local package %s not found', name);
      found = false;
      packageInfo = generatePackageTemplate(name);
    }

    for (const uplink in this.uplinks) {
      if (hasProxyTo(name, uplink, this.config.packages) && hasToLookIntoUplinks) {
        upLinks.push(this.uplinks[uplink]);
      }
    }
    debug('uplinks found for %o: %o', name, upLinks.length);

    async.map(
      upLinks,
      (upLink: ProxyStorage, cb): void => {
        const _options = Object.assign({}, options);
        const upLinkMeta = packageInfo._uplinks[upLink.upname];

        if (isObject(upLinkMeta)) {
          const fetched = upLinkMeta.fetched;

          if (fetched && Date.now() - fetched < upLink.maxage) {
            debug('returning cached manifest for %o', upLink.upname);
            return cb();
          }

          _options.etag = upLinkMeta.etag;
        }

        upLink.getRemoteMetadata(name, _options, (err, upLinkResponse, eTag): void => {
          if (err && err.remoteStatus === 304) {
            debug('uplink %o responded 304 for %o, cache is up to date', upLink.upname, name);
            upLinkMeta.fetched = Date.now();
          }

          if (err || !upLinkResponse) {
            debug('error captured on uplink %o for %o: %o', upLink.upname, name, err?.message);
            return cb(null, [err || ErrorCode.getInternalError('no data')]);
          }

          try {
            upLinkResponse = validationUtils.normalizeMetadata(upLinkResponse, name);
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
          debug('syncing on uplink %o', upLink.upname);
          found = true;
          cb();
        });
      },
      // @ts-ignore
      async (err: Error, upLinksErrors: any): Promise<void> => {
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
            debug('uplinks sync failed with timeout error');
            return callback(ErrorCode.getServiceUnavailable(), null, upLinksErrors);
          }
          debug('uplinks sync failed with no package found');
          return callback(ErrorCode.getNotFound(API_ERROR.NO_PACKAGE), null, upLinksErrors);
        }

        if (upLinks.length === 0) {
          debug('no uplinks found for %o, upstream update aborted', name);
          const { filteredPackage, filterErrors } = await self._applyFilters(
            packageInfo as Manifest
          );
          return callback(null, filteredPackage, filterErrors);
        }

        try {
          const packageJsonLocal = await self.localStorage.updateVersionsAsync(name, packageInfo);
          const { filteredPackage, filterErrors } = await self._applyFilters(packageJsonLocal);
          callback(null, filteredPackage, _.concat(upLinksErrors, filterErrors));
        } catch (err) {
          callback(err);
        }
      }
    );
  }

  /**
   * Apply all configured filter plugins to a package manifest sequentially.
   * Each filter's output is passed as input to the next filter.
   * Returns the filtered manifest and any errors that occurred.
   */
  private async _applyFilters(
    packageInfo: Manifest
  ): Promise<{ filteredPackage: Manifest; filterErrors: Error[] }> {
    const filterErrors: Error[] = [];
    let filteredPackage = packageInfo;
    for (const filter of this.filters ?? []) {
      try {
        filteredPackage = await filter.filter_metadata(filteredPackage);
      } catch (err: any) {
        debug('filter plugin has failed on %o: %o', packageInfo.name, err?.message);
        filterErrors.push(err);
      }
    }
    return { filteredPackage, filterErrors };
  }

  /**
   * Check if a tarball should be served based on filter plugins, using only
   * local metadata. Returns true (defer) when the version isn't cached locally
   * — the uplink-sync path in getTarball re-checks filters after sync, which
   * avoids a redundant uplink round-trip and double filter application.
   */
  private async _isTarballAllowedByFilters(name: string, filename: string): Promise<boolean> {
    if (!this.filters?.length) {
      return true;
    }

    try {
      const pkgMetadata = await this.localStorage.getPackageMetadataAsync(name);
      if (!hasTarball(pkgMetadata, filename)) {
        return true;
      }
      const { filteredPackage } = await this._applyFilters(pkgMetadata);
      const allowed = hasTarball(filteredPackage, filename);
      if (allowed === false) {
        debug('tarball %o of %o is blocked by a filter plugin', filename, name);
      }
      return allowed;
    } catch (err: any) {
      if (err?.status === HTTP_STATUS.NOT_FOUND) {
        return true;
      }
      this.logger.error(
        { package: name, fileName: filename, err },
        'error checking filters for tarball @{fileName} of package @{package}: @{err.message}'
      );
      return true;
    }
  }

  /**
   * Tag each version with the uplink it was fetched from, under a hidden
   * (symbol) key. The local storage uses the tag to record the registry
   * on the distfile records it creates.
   * @param {Versions} versions versions fetched from the uplink
   * @param {ProxyStorage} upLink uplink the versions were fetched from
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
