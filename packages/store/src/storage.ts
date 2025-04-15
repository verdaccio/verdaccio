import assert from 'assert';
import buildDebug from 'debug';
import _, { isEmpty, isNil } from 'lodash';
import { basename } from 'path';
import { PassThrough, Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import { default as URL } from 'url';

import { getProxiesForPackage, hasProxyTo } from '@verdaccio/config';
import {
  API_ERROR,
  API_MESSAGE,
  DEFAULT_USER,
  DIST_TAGS,
  HEADER_TYPE,
  HTTP_STATUS,
  MAINTAINERS,
  PLUGIN_CATEGORY,
  SUPPORT_ERRORS,
  USERS,
  errorUtils,
  pluginUtils,
  searchUtils,
  tarballUtils,
  validationUtils,
} from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import {
  IProxy,
  ISyncUplinksOptions,
  ProxyInstanceList,
  ProxySearchParams,
  ProxyStorage,
  setupUpLinks,
  updateVersionsHiddenUpLinkNext,
} from '@verdaccio/proxy';
import Search from '@verdaccio/search';
import {
  TarballDetails,
  convertDistRemoteToLocalTarballUrls,
  convertDistVersionToLocalTarballsUrl,
  getTarballDetails,
} from '@verdaccio/tarball';
import {
  AbbreviatedManifest,
  AbbreviatedVersions,
  Author,
  Config,
  DistFile,
  GenericBody,
  Logger,
  Manifest,
  MergeTags,
  PackageUsers,
  StringValue,
  Token,
  TokenFilter,
  UnPublishManifest,
  Version,
} from '@verdaccio/types';
import { createTarballHash, normalizeContributors } from '@verdaccio/utils';

import {
  PublishOptions,
  UpdateManifestOptions,
  cleanUpReadme,
  isDeprecatedManifest,
  tagVersion,
  tagVersionNext,
} from '.';
import { isPublishablePackage } from './lib/star-utils';
import { isExecutingStarCommand } from './lib/star-utils';
import {
  STORAGE,
  cleanUpLinksRef,
  generatePackageTemplate,
  generateRevision,
  getLatestReadme,
  mapManifestToSearchPackageBody,
  mergeUplinkTimeIntoLocalNext,
  mergeVersions,
  normalizeDistTags,
  normalizePackage,
  updateUpLinkMetadata,
} from './lib/storage-utils';
import { getVersion, removeLowerVersions } from './lib/versions-utils';
import { LocalStorage } from './local-storage';
import { IGetPackageOptionsNext, OwnerManifestBody, StarManifestBody } from './type';

const debug = buildDebug('verdaccio:storage');

export type Filters = pluginUtils.ManifestFilter<Config>[];
export const noSuchFile = 'ENOENT';
export const resourceNotAvailable = 'EAGAIN';
export const PROTO_NAME = '__proto__';

class Storage {
  public localStorage: LocalStorage;
  public filters: Filters | null;
  public readonly config: Config;
  public readonly logger: Logger;
  public readonly uplinks: ProxyInstanceList;
  private searchService: Search;
  public constructor(config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger.child({ module: 'storage' });
    this.uplinks = setupUpLinks(config, this.logger);
    this.searchService = new Search(config, this.logger);
    this.filters = null;
    // @ts-ignore
    this.localStorage = null;
    debug('uplinks available %o', Object.keys(this.uplinks));
  }

  static ABBREVIATED_HEADER = 'application/vnd.npm.install-v1+json';

  /**
   * Change an existing package (i.e. unpublish one version)
   Function changes a package info from local storage and all uplinks with write access./
   Used storages: local (write)
   */
  public async changePackage(name: string, metadata: Manifest, revision: string): Promise<void> {
    debug('change existing package for package %o revision %o', name, revision);
    debug(`change manifest tags for %o revision %o`, name, revision);
    if (
      !validationUtils.isObject(metadata.versions) ||
      !validationUtils.isObject(metadata[DIST_TAGS])
    ) {
      debug(`change manifest bad data for %o`, name);
      throw errorUtils.getBadData();
    }

    debug(`change manifest updating manifest for %o`, name);
    await this.updatePackage(name, async (localData: Manifest): Promise<Manifest> => {
      // eslint-disable-next-line guard-for-in
      for (const version in localData.versions) {
        const incomingVersion = metadata.versions[version];
        if (_.isNil(incomingVersion)) {
          this.logger.info({ name: name, version: version }, 'unpublishing @{name}@@{version}');

          // FIXME: I prefer return a new object rather mutate the metadata
          delete localData.versions[version];
          delete localData.time![version];

          for (const file in localData._attachments) {
            if (localData._attachments[file].version === version) {
              delete localData._attachments[file].version;
            }
          }
        } else if (Object.prototype.hasOwnProperty.call(incomingVersion, 'deprecated')) {
          const incomingDeprecated = incomingVersion.deprecated;
          if (incomingDeprecated != localData.versions[version].deprecated) {
            if (!incomingDeprecated) {
              this.logger.info(
                { name: name, version: version },
                'undeprecating @{name}@@{version}'
              );
              delete localData.versions[version].deprecated;
            } else {
              this.logger.info({ name: name, version: version }, 'deprecating @{name}@@{version}');
              localData.versions[version].deprecated = incomingDeprecated;
            }
            localData.time!.modified = new Date().toISOString();
          }
        }
      }

      localData[USERS] = metadata[USERS];
      localData[DIST_TAGS] = metadata[DIST_TAGS];
      localData[MAINTAINERS] = metadata[MAINTAINERS];
      return localData;
    });
  }

  public async removePackage(name: string, revision: string, username: string): Promise<void> {
    debug('remove package %o', name);
    await this.removePackageByRevision(name, revision, username);
  }

  /**
   Remove a tarball from a system
   Function removes a tarball from local storage.
   Tarball in question should not be linked to in any existing
   versions, i.e. package version should be unpublished first.
   Used storage: local (write)
   */
  public async removeTarball(
    name: string,
    filename: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _revision: string,
    username: string
  ): Promise<Manifest> {
    debug('remove tarball %s for %s', filename, name);
    assert(validationUtils.validateName(filename));
    const storage: pluginUtils.StorageHandler = this.getPrivatePackageStorage(name);
    if (!storage) {
      debug(`method not implemented for storage`);
      this.logger.error('method for remove tarball not implemented');
      throw errorUtils.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR);
    }

    try {
      const cacheManifest = await storage.readPackage(name);
      if (!cacheManifest._attachments[filename]) {
        throw errorUtils.getNotFound('no such file available');
      }

      // check if logged in user is allowed to remove tarball
      await this.checkAllowedToChangePackage(cacheManifest, username);
    } catch (err: any) {
      if (err.code === noSuchFile) {
        throw errorUtils.getNotFound();
      }
      throw err;
    }

    const manifest = await this.updatePackage(name, async (data: Manifest): Promise<Manifest> => {
      let newData: Manifest = { ...data };
      delete data._attachments[filename];
      return newData;
    });

    try {
      const storage: pluginUtils.StorageHandler = this.getPrivatePackageStorage(name);
      if (!storage) {
        debug(`method not implemented for storage`);
        this.logger.error('method for remove tarball not implemented');
        throw errorUtils.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR);
      }

      await storage.deletePackage(filename);
      debug('package %s removed', filename);
    } catch (err: any) {
      this.logger.error({ err }, 'error removing from storage: @{err.message}');
      throw err;
    }
    return manifest;
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

  private async getTarballFromUpstream(name: string, filename: string, { signal }) {
    this.logger.info(
      { name, filename },
      'get tarball for package @{name} filename @{filename} from uplink'
    );
    let cachedManifest: Manifest | null = null;
    try {
      cachedManifest = await this.getPackageLocalMetadata(name);
    } catch (err) {
      debug('error on get package local metadata %o', err);
    }
    // dist url should be on local cache metadata
    if (
      cachedManifest?._distfiles &&
      typeof cachedManifest?._distfiles[filename]?.url === 'string'
    ) {
      debug('dist file found, using it %o', cachedManifest?._distfiles[filename].url);
      // dist file found, proceed to download
      const distFile = cachedManifest._distfiles[filename];

      let current_length = 0;
      let expected_length;
      const passThroughRemoteStream = new PassThrough();
      const proxy = this.getUpLinkForDistFile(name, distFile);
      const remoteStream = proxy.fetchTarball(distFile.url, {});

      remoteStream.on('request', async () => {
        try {
          debug('remote stream request');
          const storage = this.getPrivatePackageStorage(name) as any;
          if (proxy.config.cache === true && storage) {
            const localStorageWriteStream = await storage.writeTarball(filename, {
              signal,
            });

            await pipeline(remoteStream, passThroughRemoteStream, localStorageWriteStream, {
              signal,
            });
          } else {
            await pipeline(remoteStream, passThroughRemoteStream, {
              signal,
            });
          }
        } catch (err: any) {
          debug('error on pipeline downloading tarball for package %o', name);
          passThroughRemoteStream.emit('error', err);
        }
      });

      remoteStream
        .on('response', async (res) => {
          if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
            debug('remote stream response 404');
            passThroughRemoteStream.emit(
              'error',
              errorUtils.getNotFound(errorUtils.API_ERROR.NOT_FILE_UPLINK)
            );
            return;
          }

          if (res.statusCode === HTTP_STATUS.UNAUTHORIZED) {
            debug('remote stream response 401');
            passThroughRemoteStream.emit(
              'error',
              errorUtils.getUnauthorized(errorUtils.API_ERROR.UNAUTHORIZED_ACCESS)
            );
            return;
          }

          if (
            !(res.statusCode >= HTTP_STATUS.OK && res.statusCode < HTTP_STATUS.MULTIPLE_CHOICES)
          ) {
            debug('remote stream response %o', res.statusCode);
            passThroughRemoteStream.emit(
              'error',
              errorUtils.getInternalError(`bad uplink status code: ${res.statusCode}`)
            );
            return;
          }

          if (res.headers[HEADER_TYPE.CONTENT_LENGTH]) {
            expected_length = res.headers[HEADER_TYPE.CONTENT_LENGTH];
            debug('remote stream response content length %o', expected_length);
            passThroughRemoteStream.emit(
              HEADER_TYPE.CONTENT_LENGTH,
              res.headers[HEADER_TYPE.CONTENT_LENGTH]
            );
          }
        })
        .on('downloadProgress', (progress) => {
          current_length = progress.transferred;
          if (typeof expected_length === 'undefined' && progress.total) {
            expected_length = progress.total;
          }
        })
        .on('end', () => {
          if (expected_length && current_length != expected_length) {
            debug('stream end, but length mismatch %o %o', current_length, expected_length);
            passThroughRemoteStream.emit(
              'error',
              errorUtils.getInternalError(API_ERROR.CONTENT_MISMATCH)
            );
          }
          debug('remote stream end');
        })
        .on('error', (err) => {
          debug('remote stream error %o', err);
          passThroughRemoteStream.emit('error', err);
        });
      return passThroughRemoteStream;
    } else {
      debug('dist file not found, proceed update upstream');
      // no dist url found, proceed to fetch from upstream
      // should not be the case
      const passThroughRemoteStream = new PassThrough();
      // ensure get the latest data
      const [updatedManifest] = await this.syncUplinksMetadata(name, cachedManifest, {
        uplinksLook: true,
      });
      const distFile = (updatedManifest as Manifest)?._distfiles?.[filename];

      if (updatedManifest === null || !distFile) {
        debug('remote tarball not found');
        throw errorUtils.getNotFound(API_ERROR.NO_SUCH_FILE);
      }

      const proxy = this.getUpLinkForDistFile(name, distFile);
      const remoteStream = proxy.fetchTarball(distFile.url, {});
      remoteStream.on('response', async () => {
        try {
          const storage = this.getPrivatePackageStorage(name);
          if (proxy.config.cache === true && storage) {
            debug('cache remote tarball enabled');
            const localStorageWriteStream = await storage.writeTarball(filename, {
              signal,
            });
            await pipeline(remoteStream, passThroughRemoteStream, localStorageWriteStream, {
              signal,
            });
          } else {
            debug('cache remote tarball disabled');
            await pipeline(remoteStream, passThroughRemoteStream, { signal });
          }
        } catch (err) {
          debug('error on pipeline downloading tarball for package %o', name);
          passThroughRemoteStream.emit('error', err);
        }
      });
      return passThroughRemoteStream;
    }
  }

  /**
   *
   * @param name
   * @param filename
   * @param param2
   * @returns
   */
  public async getTarball(name: string, filename: string, { signal }): Promise<PassThrough> {
    this.logger.info({ name, filename }, 'get tarball for package @{name} filename @{filename}');
    debug('get tarball for package %o filename %o', name, filename);
    // TODO: check if isOpen is need it after all.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let isOpen = false;
    const localTarballStream = new PassThrough();
    const localStream = await this.getLocalTarball(name, filename, { signal });
    localStream.on('open', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isOpen = true;
      await pipeline(localStream, localTarballStream, { signal });
    });

    localStream.on('error', (err: any) => {
      // eslint-disable-next-line no-console
      if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
        this.getTarballFromUpstream(name, filename, { signal })
          .then((uplinkStream) => {
            pipeline(uplinkStream, localTarballStream, { signal })
              .then(() => {
                debug('successfully downloaded tarball for package %o filename %o', name, filename);
              })
              .catch((err) => {
                localTarballStream.emit('error', err);
              });
          })
          .catch((err) => {
            localTarballStream.emit('error', err);
          });
      } else {
        this.logger.error({ err }, 'some error on fatal: @{err.message}');
        localTarballStream.emit('error', err);
      }
    });

    return localTarballStream;
  }

  public async getPackageByVersion(options: IGetPackageOptionsNext): Promise<Version> {
    const queryVersion = options.version as string;
    if (_.isNil(queryVersion)) {
      throw errorUtils.getNotFound(`${API_ERROR.VERSION_NOT_EXIST}: ${queryVersion}`);
    }

    // we have version, so we need to return specific version
    const [convertedManifest] = await this.getPackage(options);

    const version: Version | undefined = getVersion(convertedManifest.versions, queryVersion);

    debug('query by latest version %o and result %o', queryVersion, version);
    if (typeof version !== 'undefined') {
      debug('latest version found %o', version);
      return convertDistVersionToLocalTarballsUrl(
        convertedManifest.name,
        version,
        options.requestOptions,
        this.config.url_prefix
      );
    }

    // the version could be a dist-tag eg: beta, alpha, so we find the matched version
    // on disg-tag list
    if (_.isNil(convertedManifest[DIST_TAGS]) === false) {
      if (_.isNil(convertedManifest[DIST_TAGS][queryVersion]) === false) {
        // the version found as a distag
        const matchedDisTagVersion: string = convertedManifest[DIST_TAGS][queryVersion];
        debug('dist-tag version found %o', matchedDisTagVersion);
        const disTagVersion: Version | undefined = getVersion(
          convertedManifest.versions,
          matchedDisTagVersion
        );
        if (typeof disTagVersion !== 'undefined') {
          debug('dist-tag found %o', disTagVersion);
          return convertDistVersionToLocalTarballsUrl(
            convertedManifest.name,
            disTagVersion,
            options.requestOptions,
            this.config.url_prefix
          );
        }
      }
    } else {
      debug('dist tag not detected');
    }

    // we didn't find the version, not found error
    debug('package version not found %o', queryVersion);
    throw errorUtils.getNotFound(`${API_ERROR.VERSION_NOT_EXIST}: ${queryVersion}`);
  }

  public async getPackageManifest(options: IGetPackageOptionsNext): Promise<Manifest> {
    // convert dist remotes to local bars
    const [manifest] = await this.getPackage(options);

    // If change access is requested (?write=true), then check if logged in user is allowed to change package
    if (options.byPassCache === true) {
      try {
        await this.checkAllowedToChangePackage(manifest, options.requestOptions.username);
      } catch (err: any) {
        this.logger.error({ err }, 'getting package has failed: @{err.message}');
        throw errorUtils.getBadRequest(err.message);
      }
    }

    const convertedManifest = convertDistRemoteToLocalTarballUrls(
      manifest,
      options.requestOptions,
      this.config.url_prefix
    );

    return convertedManifest;
  }

  private convertAbbreviatedManifest(manifest: Manifest): AbbreviatedManifest {
    const abbreviatedVersions = Object.keys(manifest.versions).reduce(
      (acc: AbbreviatedVersions, version: string) => {
        const _version = manifest.versions[version];
        // This should be align with this document
        // https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-version-object
        const _version_abbreviated = {
          name: _version.name,
          version: _version.version,
          deprecated: _version.deprecated,
          bin: _version.bin,
          dist: _version.dist,
          engines: _version.engines,
          funding: _version.funding,
          directories: _version.directories,
          dependencies: _version.dependencies,
          devDependencies: _version.devDependencies,
          peerDependencies: _version.peerDependencies,
          optionalDependencies: _version.optionalDependencies,
          bundleDependencies: _version.bundleDependencies,
          cpu: _version.cpu,
          os: _version.os,
          peerDependenciesMeta: _version.peerDependenciesMeta,
          acceptDependencies: _version.acceptDependencies,
          // npm cli specifics
          _hasShrinkwrap: _version._hasShrinkwrap,
          hasInstallScript: _version.hasInstallScript,
        };
        acc[version] = _version_abbreviated;
        return acc;
      },
      {}
    );
    const convertedManifest = {
      name: manifest['name'],
      [DIST_TAGS]: manifest[DIST_TAGS],
      versions: abbreviatedVersions,
      modified: manifest.time.modified,
      // NOTE: special case for pnpm https://github.com/pnpm/rfcs/pull/2
      time: manifest.time,
      _id: manifest._id,
      readme: manifest.readme,
      // TODO: not sure if this is used in some way
      readmeFilename: '',
      _rev: manifest._rev,
    };

    return convertedManifest;
  }

  /**
   * Return a manifest or version based on the options.
   * @param options {Object}
   * @returns A package manifest or specific version
   */
  public async getPackageByOptions(
    options: IGetPackageOptionsNext
  ): Promise<Manifest | AbbreviatedManifest | Version> {
    // if no version we return the whole manifest
    if (_.isNil(options.version) === false) {
      debug('get package by version %o', options.version);
      return this.getPackageByVersion(options);
    } else {
      debug('get full package manifest');
      const manifest = await this.getPackageManifest(options);
      if (options.abbreviated === true) {
        debug('get abbreviated manifest');
        return this.convertAbbreviatedManifest(manifest);
      }
      return manifest;
    }
  }

  public async getLocalDatabase(): Promise<Version[]> {
    debug('get local database');
    const storage = this.localStorage.getStoragePlugin();
    const database = await storage.get();
    const packages: Version[] = [];
    for (const pkg of database) {
      debug('get local database %o', pkg);
      const manifest = await this.getPackageLocalMetadata(pkg);
      const latest = manifest[DIST_TAGS].latest;
      if (latest && manifest.versions[latest]) {
        const version: Version = manifest.versions[latest];
        const timeList = manifest.time as GenericBody;
        const time = timeList[latest];
        // @ts-ignore
        version.time = time;

        // Add for stars api
        // @ts-ignore
        version.users = manifest.users;

        packages.push(version);
      } else {
        this.logger.warn({ package: pkg }, 'package @{package} does not have a "latest" tag?');
      }
    }
    return packages;
  }

  public saveToken(token: Token): Promise<any> {
    if (_.isFunction(this.localStorage.getStoragePlugin().saveToken) === false) {
      return Promise.reject(
        errorUtils.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE)
      );
    }

    return this.localStorage.getStoragePlugin().saveToken(token);
  }

  public deleteToken(user: string, tokenKey: string): Promise<any> {
    if (_.isFunction(this.localStorage.getStoragePlugin().deleteToken) === false) {
      return Promise.reject(
        errorUtils.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE)
      );
    }

    return this.localStorage.getStoragePlugin().deleteToken(user, tokenKey);
  }

  public readTokens(filter: TokenFilter): Promise<Token[]> {
    if (_.isFunction(this.localStorage.getStoragePlugin().readTokens) === false) {
      return Promise.reject(
        errorUtils.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE)
      );
    }

    return this.localStorage.getStoragePlugin().readTokens(filter);
  }

  /**
   * Initialize the storage asynchronously.
   * @param config Config
   * @param filters Filters
   * @returns Storage instance
   */
  public async init(config: Config): Promise<void> {
    if (this.localStorage === null) {
      this.localStorage = new LocalStorage(this.config, this.logger);
      await this.localStorage.init();
      debug('local init storage initialized');
      await this.localStorage.getSecret(config);
      debug('local storage secret initialized');
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
        false,
        this.config?.serverSettings?.pluginPrefix,
        PLUGIN_CATEGORY.FILTER
      );
      debug('filters available %o', this.filters.length);
    }
    return;
  }

  /**
   * Retrieve a wrapper that provide access to the package location.
   * @param {Object} pkgName package name.
   * @return {Object}
   */
  private getPrivatePackageStorage(pkgName: string): pluginUtils.StorageHandler {
    debug('get local storage for %o', pkgName);
    return this.localStorage.getStoragePlugin().getPackageStorage(pkgName);
  }

  /**
   * Create a tarball stream from a package.
   * @param name
   * @param filename
   * @param options
   * @returns
   */
  public async getLocalTarball(
    pkgName: string,
    filename: string,
    { signal }: { signal: AbortSignal }
  ): Promise<Readable> {
    assert(validationUtils.validateName(filename));
    const storage: pluginUtils.StorageHandler = this.getPrivatePackageStorage(pkgName);
    if (typeof storage === 'undefined') {
      return this.createFailureStreamResponseNext();
    }

    return await storage.readTarball(filename, { signal });
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

    this.logger.info(
      { t: query.text, q: query.quality, p: query.popularity, m: query.maintenance, s: query.size },
      'search by text @{t}| maintenance @{m}| quality @{q}| popularity @{p}'
    );

    if (typeof this.localStorage.getStoragePlugin().search === 'undefined') {
      this.logger.info('plugin search not implemented yet');
    } else {
      debug('search on each package by plugin query');
      const items = await this.localStorage.getStoragePlugin().search(query);
      try {
        for (const searchItem of items) {
          const manifest = await this.getPackageLocalMetadata(searchItem.package.name);
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
        this.logger.error(
          { err, query },
          'error on search by plugin for @{query.text}: @{err.message}'
        );
        throw err;
      }
    }
    return results;
  }

  private async removePackageByRevision(
    pkgName: string,
    revision: string,
    username: string
  ): Promise<void> {
    const storage: pluginUtils.StorageHandler = this.getPrivatePackageStorage(pkgName);
    debug('get package metadata for %o', pkgName);
    if (typeof storage === 'undefined') {
      throw errorUtils.getServiceUnavailable('storage not initialized');
    }
    let manifest;
    try {
      manifest = await storage.readPackage(pkgName);
      manifest = normalizePackage(manifest);
    } catch (err: any) {
      if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
        this.logger.info({ pkgName, revision }, 'package not found');
        throw errorUtils.getNotFound();
      }
      this.logger.error(
        { pkgName, revision, err },
        'error while reading package @{pkgName}-{revision}: @{err.message}'
      );
      throw err;
    }

    // TODO:  move this to another method
    try {
      // check if logged in user is allowed to remove package
      await this.checkAllowedToChangePackage(manifest, username);

      await this.localStorage.getStoragePlugin().remove(pkgName);
      // remove each attachment
      const attachments = Object.keys(manifest._attachments);
      debug('attachments to remove %s', attachments?.length);
      for (let attachment of attachments) {
        debug('remove attachment %s', attachment);
        await storage.deletePackage(attachment);
        this.logger.info({ attachment }, 'attachment @{attachment} removed');
      }
      // remove package.json
      debug('remove package.json');
      await storage.deletePackage(STORAGE.PACKAGE_FILE_NAME);
      // remove folder
      debug('remove package folder');
      await storage.removePackage(pkgName);
      this.logger.info({ pkgName }, 'package @{pkgName} removed');
    } catch (err: any) {
      this.logger.error({ err }, 'removed package has failed: @{err.message}');
      throw errorUtils.getBadData(err.message);
    }
  }

  /**
   * Get a package local manifest.
   *
   * Fails if package is not found.
   * @param name package name
   * @param revision of package
   * @returns local manifest
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getPackageLocalMetadata(name: string, _revision?: string): Promise<Manifest> {
    const storage: pluginUtils.StorageHandler = this.getPrivatePackageStorage(name);
    debug('get package metadata for %o', name);
    if (typeof storage === 'undefined') {
      throw errorUtils.getServiceUnavailable('storage not initialized');
    }

    try {
      const result: Manifest = await storage.readPackage(name);
      return normalizePackage(result);
    } catch (err: any) {
      if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
        debug('package %s not found', name);
        throw errorUtils.getNotFound();
      }
      this.logger.error(
        { err, file: STORAGE.PACKAGE_FILE_NAME },
        'error reading  @{file}: @{err.message}'
      );

      throw errorUtils.getInternalError();
    }
  }

  /**
   * Fail the stream response with an not found error.
   * @returns
   */
  private createFailureStreamResponseNext(): PassThrough {
    const stream: PassThrough = new PassThrough();

    // we ensure fails on the next tick into the event loop
    process.nextTick((): void => {
      stream.emit('error', errorUtils.getNotFound(API_ERROR.NO_SUCH_FILE));
    });

    return stream;
  }

  /**
   * Update a package and merge tags
   * @param name package name
   * @param tags list of dist-tags
   */
  public async mergeTagsNext(name: string, tags: MergeTags): Promise<Manifest> {
    return await this.updatePackage(name, async (data: Manifest): Promise<Manifest> => {
      let newData: Manifest = { ...data };
      for (const tag of Object.keys(tags)) {
        // this handle dist-tag rm command
        if (_.isNull(tags[tag])) {
          delete newData[DIST_TAGS][tag];
          continue;
        }

        if (_.isNil(newData.versions[tags[tag]])) {
          throw errorUtils.getNotFound(API_ERROR.VERSION_NOT_EXIST);
        }
        const version: string = tags[tag];
        newData = tagVersionNext(newData, version, tag);
      }

      return newData;
    });
  }

  private getUpLinkForDistFile(pkgName: string, distFile: DistFile): IProxy {
    let uplink: IProxy | null = null;

    for (const uplinkName in this.uplinks) {
      // refer to https://github.com/verdaccio/verdaccio/issues/1642
      if (hasProxyTo(pkgName, uplinkName, this.config.packages)) {
        uplink = this.uplinks[uplinkName];
      }
    }

    if (uplink == null) {
      debug('upstream not found, creating one for %o', pkgName);
      uplink = new ProxyStorage(
        `verdaccio-${pkgName}`,
        {
          url: distFile.url,
          cache: true,
        },
        this.config,
        this.logger
      );
    }
    return uplink;
  }

  public async updateManifest(
    manifest: Manifest | StarManifestBody | OwnerManifestBody | UnPublishManifest,
    options: UpdateManifestOptions
  ): Promise<string | undefined> {
    debug('update manifest %o for user %o', manifest._id, options.requestOptions.username);
    if (isDeprecatedManifest(manifest as Manifest)) {
      debug('update manifest deprecate');
      // if the manifest is deprecated, we need to update the package.json
      await this.deprecate(manifest as Manifest, {
        ...options,
      });
    } else if (
      isPublishablePackage(manifest as Manifest) === false &&
      validationUtils.isObject((manifest as StarManifestBody).users)
    ) {
      debug('update manifest star');
      // if user request to apply a star to the manifest
      await this.star(manifest as StarManifestBody, {
        ...options,
      });
      return API_MESSAGE.PKG_CHANGED;
    } else if (
      isPublishablePackage(manifest as Manifest) === false &&
      Array.isArray((manifest as OwnerManifestBody).maintainers)
    ) {
      debug('update manifest owners');
      // if user request to change owners of package
      await this.changeOwners(manifest as OwnerManifestBody, {
        ...options,
      });
      return API_MESSAGE.PKG_CHANGED;
    } else if (validationUtils.validatePublishSingleVersion(manifest)) {
      // if continue, the version to be published does not exist
      // we create a new package
      debug('publish a new version');
      const [mergedManifest, version, message] = await this.publishANewVersion(
        manifest as Manifest,
        {
          ...options,
        }
      );
      // send notification of publication (notification step, non transactional)
      try {
        const { name } = mergedManifest;
        await this.notify(mergedManifest, `${name}@${version}`);
        this.logger.info({ name, version }, 'notify for @{name}@@{version} has been sent');
      } catch (err: any) {
        this.logger.error({ err }, 'notify batch service has failed: @{err.message}');
      }
      return message;
    } else if (validationUtils.validateUnPublishSingleVersion(manifest)) {
      debug('unpublish a version');

      await this.unPublishAPackage(manifest as UnPublishManifest, {
        ...options,
      });
    } else {
      debug('invalid body format');
      this.logger.warn(
        { packageName: options.name },
        `wrong package format on publish a package @{packageName}`
      );
      throw errorUtils.getBadRequest(API_ERROR.UNSUPORTED_REGISTRY_CALL);
    }
  }

  private async deprecate(manifest: Manifest, options: UpdateManifestOptions): Promise<void> {
    const { name } = manifest;
    debug('deprecating %s', name);
    return this.changePackage(name, manifest, options.revision as string);
  }

  private async star(manifest: StarManifestBody, options: UpdateManifestOptions): Promise<string> {
    const { users } = manifest;
    const { requestOptions, name } = options;
    debug('star %s', name);
    const { username } = requestOptions;
    if (!username) {
      throw errorUtils.getBadRequest('update users only allowed to logged users');
    }

    const localPackage = await this.getPackageManifest({
      name,
      requestOptions,
      uplinksLook: false,
    });
    // backward compatible in case users are not in the storage.
    const localStarUsers = localPackage.users || {};
    // if trying to add a star
    const userIsAddingStar = Object.keys(users as PackageUsers).includes(username);
    if (!isExecutingStarCommand(localPackage?.users as PackageUsers, username, userIsAddingStar)) {
      return API_MESSAGE.PKG_CHANGED;
    }

    const newUsers = userIsAddingStar
      ? {
          ...localStarUsers,
          [username]: true,
        }
      : _.reduce(
          localStarUsers,
          (users, value, key) => {
            if (key !== username) {
              users[key] = value;
            }
            return users;
          },
          {}
        );

    await this.changePackage(
      name,
      { ...localPackage, users: newUsers },
      options.revision as string
    );

    return API_MESSAGE.PKG_CHANGED;
  }

  private async unPublishAPackage(manifest: UnPublishManifest, options: UpdateManifestOptions) {
    const { requestOptions, name } = options;
    debug('unpublish a package of %o', name);

    const localPackage = await this.getPackageManifest({
      name,
      requestOptions,
      uplinksLook: false,
    });
    if (localPackage._rev === manifest._rev) {
      await this.changePackage(name, manifest as Manifest, options.revision as string);
    }

    return API_MESSAGE.PKG_CHANGED;
  }

  private async changeOwners(
    manifest: OwnerManifestBody,
    options: UpdateManifestOptions
  ): Promise<string> {
    const { maintainers } = manifest;
    const { requestOptions, name } = options;
    debug('change owners of %o', name);
    const { username } = requestOptions;
    if (!username) {
      throw errorUtils.getBadRequest('update owners only allowed for logged in users');
    }
    if (!maintainers || maintainers.length === 0) {
      throw errorUtils.getBadRequest('maintainers field is required and must not be empty');
    }

    const localPackage = await this.getPackageManifest({
      name,
      requestOptions,
      uplinksLook: false,
    });

    await this.changePackage(
      name,
      { ...localPackage, maintainers: maintainers as Author[] },
      options.revision as string
    );

    return API_MESSAGE.PKG_CHANGED;
  }

  /**
   * Get local package, on fails return null.
   * Errors are considered package not found.
   * @param name
   * @returns
   */
  private async getPackagelocalByName(name: string): Promise<Manifest | null> {
    try {
      return await this.getPackageLocalMetadata(name);
    } catch (err: any) {
      debug('local package %s not found', name);
      return null;
    }
  }

  /**
   * Convert tarball as string into a Buffer and validate the length.
   * @param data the tarball data as string
   * @returns
   */
  private getBufferManifest(data: string): Buffer {
    const buffer = Buffer.from(data, 'base64');
    if (buffer.length === 0) {
      throw errorUtils.getBadData('refusing to accept zero-length file');
    }
    return buffer;
  }

  /**
   * Verify if the package exists in the local storage
   * (the package refers to the package.json), directory would return false.
   * @param pkgName package name
   * @returns boolean
   */
  private async hasPackage(pkgName: string): Promise<boolean> {
    const storage: pluginUtils.StorageHandler = this.getPrivatePackageStorage(pkgName);
    if (typeof storage === 'undefined') {
      throw errorUtils.getNotFound();
    }
    const hasPackage = await storage.hasPackage(pkgName);
    debug('has package %o is %o', pkgName, hasPackage);
    return hasPackage;
  }

  /**
   * Create a new package.
   * This situation happens only of the package does not exist on the cache.
   *
   * @param body package metadata
   * @param options
   * @returns
   */
  private async publishANewVersion(
    body: Manifest,
    options: PublishOptions
  ): Promise<[Manifest, string, string]> {
    const { name } = options;
    const username = options.requestOptions.username;
    debug('publishing a new package for %o as %o', name, username);
    let successResponseMessage;
    const manifest: Manifest = { ...validationUtils.normalizeMetadata(body, name) };
    const { _attachments, versions } = manifest;

    // validation step, if _attachments is not an object throw error
    // _attachments is need it for holding the tarball buffer in the local storage as file
    // versions is need it for holding the version in the local storage as file
    // _attachments and validation are required otherwise cannot continue.
    if (isEmpty(_attachments)) {
      debug('attachments are empty, cannot continue');
      throw errorUtils.getBadRequest(API_ERROR.UNSUPORTED_REGISTRY_CALL);
    }

    // get the unique version available
    const [versionToPublish] = Object.keys(versions);

    // at this point document is either created or existed before
    const [firstAttachmentKey] = Object.keys(_attachments);
    const buffer = this.getBufferManifest(body._attachments[firstAttachmentKey].data as string);

    try {
      // we check if package exist already locally
      const localManifest = await this.getPackagelocalByName(name);
      // if continue, the version to be published does not exist
      if (localManifest?.versions[versionToPublish] != null) {
        debug('%s version %s already exists (locally)', name, versionToPublish);
        throw errorUtils.getConflict();
      }
      const uplinksLook = this.config?.publish?.allow_offline === false;
      // if execution get here, package does not exist locally, we search upstream
      const remoteManifest = await this.checkPackageRemote(name, uplinksLook);
      if (remoteManifest?.versions[versionToPublish] != null) {
        debug('%s version %s already exists (upstream)', name, versionToPublish);
        throw errorUtils.getConflict();
      }

      const hasPackageInStorage = await this.hasPackage(name);
      if (!hasPackageInStorage) {
        await this.createNewLocalCachePackage(name, username);
        successResponseMessage = API_MESSAGE.PKG_CREATED;
      } else {
        await this.checkAllowedToChangePackage(localManifest as Manifest, username);
        successResponseMessage = API_MESSAGE.PKG_CHANGED;
      }
    } catch (err: any) {
      debug('error on change or update a package with %o', err.message);
      this.logger.error({ err }, 'error on publish new version: @{err.message}');
      throw err;
    }

    // 1. after tarball has been successfully uploaded, we update the version
    try {
      const tarballStats = await this.getTarballStats(versions[versionToPublish], buffer);
      // Older package managers like npm6 do not send readme content as part of version but include it on root level
      if (_.isEmpty(versions[versionToPublish].readme)) {
        versions[versionToPublish].readme =
          _.isNil(manifest.readme) === false ? String(manifest.readme) : '';
      }
      // addVersion will move the readme from the the published version to the root level
      await this.addVersion(name, versionToPublish, versions[versionToPublish], null, tarballStats);
    } catch (err: any) {
      this.logger.error({ err }, 'updated version has failed: @{err.message}');
      debug('error on create a version for %o with error %o', name, err.message);
      throw err;
    }

    // 2. update and merge tags
    let mergedManifest;
    try {
      // note: I could merge this with addVersion()
      // 1. add version
      // 2. merge versions
      // 3. upload tarball
      // 4. update once to the storage (easy peasy)
      mergedManifest = await this.mergeTagsNext(name, manifest[DIST_TAGS]);
    } catch (err: any) {
      this.logger.error({ err }, 'merge version has failed: @{err.message}');
      debug('error on create a version for %o with error %o', name, err.message);
      // TODO: undo if this fails
      // 1. remove updated version
      throw err;
    }

    // 3. upload the tarball to the storage
    try {
      const readable = Readable.from(buffer);
      await this.uploadTarball(name, basename(firstAttachmentKey), readable, {
        signal: options.signal,
      });
    } catch (err: any) {
      this.logger.error({ err }, 'upload tarball has failed: @{err.message}');
      // TODO: undo if this fails
      // 1. remove updated version
      // 2. remove new dist tags
      throw err;
    }

    this.logger.info(
      { name, version: versionToPublish },
      'package @{name}@@{version} has been published'
    );

    return [mergedManifest, versionToPublish, successResponseMessage];
  }

  // TODO: pending implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async notify(_manifest: Manifest, _message: string): Promise<void> {
    return;
  }

  /**
   * Wrap uploadTarballAsStream into a promise.
   * @param name package name
   * @param fileName tarball name
   * @param contentReadable content as readable stream
   * @param options
   * @returns
   */
  public uploadTarball(
    name: string,
    fileName: string,
    contentReadable: Readable,
    { signal }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.uploadTarballAsStream(name, fileName, {
        signal,
      })
        .then((stream) => {
          stream.on('error', (err) => {
            debug(
              'error on stream a tarball %o for %o with error %o',
              'foo.tar.gz',
              name,
              err.message
            );
            reject(err);
          });
          stream.on('success', () => {
            this.logger.debug(
              { fileName, name },
              'file @{fileName} for package @{name} has been successfully uploaded'
            );
            resolve();
          });
          return stream;
        })
        .then((stream) => {
          pipeline(contentReadable, stream, { signal })
            .then(() => {
              debug('success pipe upload tarball');
            })
            .catch(reject);
        });
    });
  }

  private async uploadTarballAsStream(
    pkgName: string,
    filename: string,
    { signal }
  ): Promise<PassThrough> {
    debug(`add a tarball for %o`, pkgName);
    assert(validationUtils.validateName(filename));

    const shaOneHash = createTarballHash();
    const transformHash = new Transform({
      transform(chunk: any, _encoding: string, callback: any): void {
        // measure the length for validation reasons
        shaOneHash.update(chunk);
        callback(null, chunk);
      },
    });
    const uploadStream = new PassThrough();
    const storage = this.getPrivatePackageStorage(pkgName);

    // FUTURE: this validation could happen even before
    if (pkgName === PROTO_NAME) {
      process.nextTick((): void => {
        uploadStream.emit('error', errorUtils.getForbidden());
      });
      return uploadStream;
    }

    // FIXME: this condition will never met, storage is always defined
    if (!storage) {
      process.nextTick((): void => {
        uploadStream.emit('error', "can't upload this package storage is missing");
      });
      return uploadStream;
    }

    const fileDoesExist = await storage.hasTarball(filename);
    if (fileDoesExist) {
      process.nextTick((): void => {
        uploadStream.emit('error', errorUtils.getConflict());
      });
    } else {
      const localStorageWriteStream = await storage.writeTarball(filename, { signal });

      localStorageWriteStream.on('open', async () => {
        await pipeline(uploadStream, transformHash, localStorageWriteStream, { signal });
      });

      // once the file descriptor has been closed
      localStorageWriteStream.on('close', async () => {
        try {
          debug('uploaded tarball %o for %o', filename, pkgName);
          // update the package metadata
          await this.updatePackage(pkgName, async (data: Manifest): Promise<Manifest> => {
            const newData: Manifest = { ...data };
            debug('added _attachment for %o', pkgName);
            newData._attachments[filename] = {
              // TODO:  add integrity hash here
              shasum: shaOneHash.digest('hex'),
            };

            return newData;
          });
          debug('emit success for %o', pkgName);
          uploadStream.emit('success');
        } catch (err: any) {
          // FUTURE: if the update package fails, remove tarball to avoid left
          // orphan tarballs
          debug(
            'something has failed on upload tarball %o for %o : %s',
            filename,
            pkgName,
            err.message
          );
          uploadStream.emit('error', err);
        }
      });

      // something went wrong writing into the local storage
      localStorageWriteStream.on('error', async (err: any) => {
        uploadStream.emit('error', err);
      });
    }

    return uploadStream;
  }

  /**
   * Add a new version to a package.
   * @param name package name
   * @param version version
   * @param metadata version metadata
   * @param tag tag of the version
   */
  private async addVersion(
    name: string,
    version: string,
    metadata: Version,
    tag: StringValue,
    tarballStats: TarballDetails
  ): Promise<void> {
    debug(`add version %s package for %s`, version, name);
    await this.updatePackage(name, async (data: Manifest): Promise<Manifest> => {
      // keep latest readme in manifest (on root level)
      data.readme = metadata.readme;
      debug('%s readme mutated', name);
      // removing other readmes depends on config
      metadata = cleanUpReadme(metadata, metadata[DIST_TAGS], this.config?.publish?.keep_readmes);
      metadata.contributors = normalizeContributors(metadata.contributors as Author[]);
      debug('%s contributors normalized', name);

      // Copy current owners to version
      metadata.maintainers = data.maintainers;

      // Update tarball stats
      if (metadata.dist) {
        metadata.dist.fileCount = tarballStats.fileCount;
        metadata.dist.unpackedSize = tarballStats.unpackedSize;
      }

      // if uploaded tarball has a different shasum, it's very likely that we
      // have some kind of error
      if (validationUtils.isObject(metadata.dist) && _.isString(metadata.dist.tarball)) {
        const tarball = tarballUtils.extractTarballFromUrl(metadata.dist.tarball);
        if (validationUtils.isObject(data._attachments[tarball])) {
          if (
            _.isNil(data._attachments[tarball].shasum) === false &&
            _.isNil(metadata.dist.shasum) === false
          ) {
            if (data._attachments[tarball].shasum != metadata.dist.shasum) {
              const errorMessage =
                `shasum error, ` +
                `${data._attachments[tarball].shasum} != ${metadata.dist.shasum}`;
              throw errorUtils.getBadRequest(errorMessage);
            }
          }
          if (tarball === '__proto__' || tarball === 'constructor' || tarball === 'prototype') {
            throw errorUtils.getBadRequest('tarball name is not allowed');
          }
          data._attachments[tarball].version = version;
        }

        // if the time field doesn't exist, we create it, some old storage
        // might not have it
        // https://github.com/verdaccio/verdaccio/issues/740
        if (_.isNil(data.time)) {
          this.logger.warn(
            { name },
            'time field could not be found, it has been recreated for @{name}'
          );
          data.time = {};
        }

        // populate the time field  with the date of the version
        const currentDate = new Date().toISOString();
        data.time.modified = currentDate;
        if (!data.time?.created) {
          data.time.created = currentDate;
        }

        if (typeof data.time[version] === 'string') {
          // this should not h appen, but we keep this check to avoid or easy bug report
          this.logger.warn(
            { name, version },
            'the time for the version @{version} already exists, it has been overwritten for package @{name}'
          );
        }
        data.time[version] = currentDate;
        debug('time added for %s version %s', name, version);
      }

      data.versions[version] = metadata;
      // TODO: review this method, it's a bit ugly
      tagVersion(data, version, tag);

      try {
        debug('%s add on database', name);
        await this.localStorage.getStoragePlugin().add(name);
        this.logger.debug({ name, version }, 'version @{version} added to database for @{name}');
      } catch (err: any) {
        throw errorUtils.getBadData(err.message);
      }
      return data;
    });
  }

  /**
   * Create an empty new local cache package without versions.
   * @param name name of the package
   * @returns
   */
  private async createNewLocalCachePackage(
    name: string,
    username: string | undefined
  ): Promise<void> {
    debug('creating new package %o for user %o', name, username);
    const storage: pluginUtils.StorageHandler = this.getPrivatePackageStorage(name);

    if (!storage) {
      debug(`storage is missing for %o package cannot be added`, name);
      throw errorUtils.getNotFound('this package cannot be added');
    }

    const currentTime = new Date().toISOString();
    const defaultManifest = generatePackageTemplate(name);
    const packageData: Manifest = {
      ...defaultManifest,
      _rev: generateRevision(defaultManifest._rev),
      time: {
        created: currentTime,
        modified: currentTime,
      },
    };

    // Set initial package owner
    // TODO: Add email of user
    packageData.maintainers =
      username && username.length > 0
        ? [{ name: username, email: '' }]
        : [{ name: DEFAULT_USER, email: '' }];

    try {
      await storage.createPackage(name, packageData);
      this.logger.info({ name }, 'created new package @{name}');
      return;
    } catch (err: any) {
      if (
        _.isNull(err) === false &&
        (err.code === STORAGE.FILE_EXIST_ERROR || err.code === HTTP_STATUS.CONFLICT)
      ) {
        debug(`error on creating a package for %o with error %o`, name, err.message);
        throw errorUtils.getConflict();
      }
      return;
    }
  }

  /**
   *
   * @param name package name
   * @param uplinksLook
   * @returns
   */
  private async checkPackageRemote(name: string, uplinksLook: boolean): Promise<Manifest | null> {
    try {
      // we provide a null manifest, thus the manifest returned will be the remote one
      const [remoteManifest, upLinksErrors] = await this.syncUplinksMetadata(name, null, {
        uplinksLook,
      });

      // checking package exist already
      if (isNil(remoteManifest) === false) {
        throw errorUtils.getConflict(API_ERROR.PACKAGE_EXIST);
      }

      for (let errorItem = 0; errorItem < upLinksErrors.length; errorItem++) {
        // checking error
        // if uplink fails with a status other than 404, we report failure
        if (isNil(upLinksErrors[errorItem][0]) === false) {
          if (upLinksErrors[errorItem][0].status !== HTTP_STATUS.NOT_FOUND) {
            if (upLinksErrors) {
              return null;
            }

            throw errorUtils.getServiceUnavailable(API_ERROR.UPLINK_OFFLINE_PUBLISH);
          }
        }
      }
      return remoteManifest;
    } catch (err: any) {
      if (err && err.status !== HTTP_STATUS.NOT_FOUND) {
        throw err;
      }
      return null;
    }
  }

  private setDefaultRevision(json: Manifest): Manifest {
    // calculate revision from couch db
    if (_.isString(json._rev) === false) {
      json._rev = STORAGE.DEFAULT_REVISION;
    }

    // this is intended in debug mode we do not want modify the store revision
    if (_.isNil(this.config._debug)) {
      const prev = json._rev;
      json._rev = generateRevision(json._rev);
      debug('revision metadata for %s updated from %s to %s', json.name, prev, json._rev);
    }

    return json;
  }

  private async writePackage(name: string, json: Manifest): Promise<void> {
    const storage: any = this.getPrivatePackageStorage(name);
    if (_.isNil(storage)) {
      // TODO: replace here 500 error
      throw errorUtils.getBadData();
    }
    await storage.savePackage(name, this.setDefaultRevision(json));
  }

  /**
   * @param {*} name package name
   * @param {*} updateHandler function(package, cb) - update function
   * @param {*} callback callback that gets invoked after it's all updated
   * @return {Function}
   */
  private async updatePackage(
    name: string,
    updateHandler: (manifest: Manifest) => Promise<Manifest>
  ): Promise<Manifest> {
    const storage: pluginUtils.StorageHandler = this.getPrivatePackageStorage(name);

    if (!storage) {
      throw errorUtils.getNotFound();
    }

    // we update the package on the local storage
    const updatedManifest: Manifest = await storage.updatePackage(name, updateHandler);
    // after correctly updated write to the storage
    try {
      await this.writePackage(name, normalizePackage(updatedManifest));
      return updatedManifest;
    } catch (err: any) {
      if (err.code === resourceNotAvailable) {
        throw errorUtils.getInternalError('resource temporarily unavailable');
      } else if (err.code === noSuchFile) {
        throw errorUtils.getNotFound();
      } else {
        throw err;
      }
    }
  }

  /**
   *
   * @protected
   * @param {IGetPackageOptionsNext} options
   * @return {*}  {Promise<[Manifest, any[]]>}
   * @memberof AbstractStorage
   */
  private async getPackage(options: IGetPackageOptionsNext): Promise<[Manifest, any[]]> {
    const { name } = options;
    debug('get package for %o', name);
    let data: Manifest | null = null;

    try {
      data = await this.getPackageLocalMetadata(name);
    } catch (err: any) {
      // if error code is higher than 500 stop here
      if (err && (!err.status || err.status >= HTTP_STATUS.INTERNAL_ERROR)) {
        throw err;
      }
    }

    // if we can't get the local metadata, we try to get the remote metadata
    // if we do to have local metadata, we try to update it with the upstream registry
    debug('sync uplinks for %o', name);
    const [remoteManifest, upLinksErrors] = await this.syncUplinksMetadata(name, data, {
      uplinksLook: options.uplinksLook,
      retry: options.retry,
      remoteAddress: options.requestOptions.remoteAddress,
      // etag??
    });

    // if both local data and upstream data are empty, we throw an error
    if (!remoteManifest && _.isNull(data)) {
      throw errorUtils.getNotFound(`${API_ERROR.NOT_PACKAGE_UPLINK}: ${name}`);
      // if the remote manifest is empty, we return local data
    } else if (!remoteManifest && !_.isNull(data)) {
      // no data on uplinks
      return [data as Manifest, upLinksErrors];
    }

    // if we have local data, we try to update it with the upstream registry
    const normalizedPkg = Object.assign({}, remoteManifest, {
      // FIXME: clean up  mutation within cleanUpLinksRef method
      ...normalizeDistTags(cleanUpLinksRef(remoteManifest as Manifest, options.keepUpLinkData)),
      _attachments: {},
    });

    debug('no sync uplinks errors %o for %s', upLinksErrors?.length, name);
    return [normalizedPkg, upLinksErrors];
  }

  /**
   * Function fetches package metadata from uplinks and synchronizes it with local data
     if package is available locally, it MUST be provided in pkginfo.

    Using this example:

    "jquery":
      access: $all
      publish: $authenticated
      unpublish: $authenticated
      # two uplinks setup
      proxy: ver npmjs
      # one uplink setup
      proxy: npmjs

    A package requires uplinks syncronization if the proxy section is defined. There can be
    more than one uplink. The more uplinks are defined, the longer the request will take.
    The requests are made in serial and if 1st call fails, the second will be triggered, otherwise
    the 1st will reply and others will be discarded. The order is important.

    Errors on uplinks that are considered are time outs, connection fails, and http status 304.
    In these cases the request returns empty body and we want ask next on the list if has fresh
    updates.
   */
  public async syncUplinksMetadata(
    name: string,
    localManifest: Manifest | null,
    options: Partial<ISyncUplinksOptions> = {}
  ): Promise<[Manifest | null, any]> {
    let found = localManifest !== null;
    let syncManifest: Manifest | null = null;
    let upLinks: string[] = [];
    const hasToLookIntoUplinks = _.isNil(options.uplinksLook) || options.uplinksLook;
    debug('is sync uplink enabled %o', hasToLookIntoUplinks);

    if (hasToLookIntoUplinks) {
      upLinks = getProxiesForPackage(name, this.config.packages);
      debug('uplinks found for %o: %o', name, upLinks);
    }

    //  if no uplinks match we return the local manifest
    if (upLinks.length === 0) {
      debug('no uplinks found for %o, upstream update aborted', name);
      return [localManifest, []];
    }

    const uplinksErrors: any[] = [];
    // we resolve uplinks async in series, first come first serve
    for (const uplink of upLinks) {
      try {
        const tempManifest = _.isNil(localManifest)
          ? generatePackageTemplate(name)
          : { ...localManifest };
        syncManifest = await this.mergeCacheRemoteMetadata(
          this.uplinks[uplink],
          tempManifest,
          options
        );
        debug('syncing on uplink %o', syncManifest.name);
        if (_.isNil(syncManifest) === false) {
          found = true;
          break;
        }
      } catch (err: any) {
        debug('error captured on uplink %o', err.message);
        uplinksErrors.push(err);
        // enforce use next uplink on the list
        continue;
      }
    }

    if (found && syncManifest !== null) {
      // updates the local cache manifest with fresh data
      let updatedCacheManifest = await this.updateVersionsNext(name, syncManifest);
      // plugin filter applied to the manifest
      const [filteredManifest, filtersErrors] = await this.applyFilters(updatedCacheManifest);
      return [
        { ...updatedCacheManifest, ...filteredManifest },
        [...uplinksErrors, ...filtersErrors],
      ];
    } else if (found && _.isNil(localManifest) === false) {
      return [localManifest, uplinksErrors];
    } else {
      // if is not found, calculate the right error to return
      debug('uplinks sync failed with %o errors', uplinksErrors.length);
      for (const err of uplinksErrors) {
        const { code } = err;
        if (code === HTTP_STATUS.SERVICE_UNAVAILABLE) {
          debug('uplinks sync failed with timeout error');
          throw err;
        }
        // we bubble up the 304 special error case
        if (code === HTTP_STATUS.NOT_MODIFIED) {
          debug('uplinks sync failed with 304 error');
          throw err;
        }
      }
      debug('uplinks sync failed with no package found');

      throw errorUtils.getNotFound(API_ERROR.NO_PACKAGE);
    }
  }

  /**
   * Merge a manifest with a remote manifest.
   *
   * If the uplinks are not available, the local manifest is returned.
   * If the uplinks are available, the local manifest is merged with the remote one.
   *
   *
   * @param uplink uplink instance
   * @param cachedManifest the local cached manifest
   * @param options options
   * @returns Returns a promise that resolves with the merged manifest.
   */
  private async mergeCacheRemoteMetadata(
    uplink: IProxy,
    cachedManifest: Manifest,
    options: Partial<ISyncUplinksOptions>
  ): Promise<Manifest> {
    // we store which uplink is updating the manifest
    const upLinkMeta = cachedManifest._uplinks[uplink.uplinkName];
    let _cacheManifest = { ...cachedManifest };

    if (validationUtils.isObject(upLinkMeta)) {
      const fetched = upLinkMeta.fetched;

      // we check the uplink cache is fresh
      if (fetched && Date.now() - fetched < uplink.maxage) {
        debug('returning cached manifest for %o', uplink.uplinkName);
        return cachedManifest;
      }
    }

    const remoteOptions = Object.assign({}, options, {
      etag: upLinkMeta?.etag,
    });

    // get the latest metadata from the uplink
    const [remoteManifest, etag] = await uplink.getRemoteMetadata(
      _cacheManifest.name,
      remoteOptions
    );

    try {
      _cacheManifest = validationUtils.normalizeMetadata(_cacheManifest, _cacheManifest.name);
    } catch (err: any) {
      this.logger.error({ err }, 'package.json validating error @{!err?.message}\n@{err.stack}');
      throw err;
    }
    // updates the _uplink metadata fields, cache, etc
    _cacheManifest = updateUpLinkMetadata(uplink.uplinkName, _cacheManifest, etag);
    // merge time field cache and remote
    _cacheManifest = mergeUplinkTimeIntoLocalNext(_cacheManifest, remoteManifest);
    // update the _uplinks field in the cache
    _cacheManifest = updateVersionsHiddenUpLinkNext(_cacheManifest, uplink);
    try {
      // merge versions from remote into the cache
      _cacheManifest = mergeVersions(_cacheManifest, remoteManifest);
      return _cacheManifest;
    } catch (err: any) {
      this.logger.error({ err }, 'package.json merge has failed @{!err?.message}\n@{err.stack}');
      throw err;
    }
  }

  /**
   * Apply filters to manifest.
   * @param manifest
   * @returns
   */
  public async applyFilters(manifest: Manifest): Promise<[Manifest, any]> {
    if (this.filters === null || this.filters.length === 0) {
      return [manifest, []];
    }

    let filterPluginErrors: any[] = [];
    let filteredManifest = { ...manifest };
    for (const filter of this.filters) {
      // These filters can assume it's save to modify packageJsonLocal
      // and return it directly for
      // performance (i.e. need not be pure)
      try {
        filteredManifest = await filter.filter_metadata(manifest);
      } catch (err: any) {
        this.logger.error({ err }, 'filter has failed: @{err.message}');
        filterPluginErrors.push(err);
      }
    }
    return [filteredManifest, filterPluginErrors];
  }

  private _createNewPackage(name: string): Manifest {
    return normalizePackage(generatePackageTemplate(name));
  }

  /**
   * Ensure the dist file remains as the same protocol
   * @param {Object} hash metadata
   * @param {String} upLinkKey registry key
   * @private
   * @deprecated use _updateUplinkToRemoteProtocolNext (???)
   */
  private updateUplinkToRemoteProtocol(hash: DistFile, upLinkKey: string): void {
    // if we got this information from a known registry,
    // use the same protocol for the tarball
    const tarballUrl: any = URL.parse(hash.url);
    const uplinkUrl: any = URL.parse(this.config.uplinks[upLinkKey].url);

    if (uplinkUrl.host === tarballUrl.host) {
      tarballUrl.protocol = uplinkUrl.protocol;
      hash.registry = upLinkKey;
      hash.url = URL.format(tarballUrl);
    }
  }

  /**
   * Create or read a package.
   *
   * If the package already exists, it will be read.
   * If the package is not found, it will be created.
   * If the error is anything else will throw an error
   *
   * @param {*} pkgName
   * @param {*} callback
   * @return {Function}
   */
  private async readCreatePackage(pkgName: string): Promise<Manifest> {
    const storage: any = this.getPrivatePackageStorage(pkgName);
    if (_.isNil(storage)) {
      throw errorUtils.getInternalError('storage could not be found');
    }

    try {
      const result: Manifest = await storage.readPackage(pkgName);
      return normalizePackage(result);
    } catch (err: any) {
      if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
        return this._createNewPackage(pkgName);
      } else {
        this.logger.error(
          { err, file: STORAGE.PACKAGE_FILE_NAME },
          'error reading @{file}: @{err.message}'
        );

        throw errorUtils.getInternalError();
      }
    }
  }

  /**
    Updates the local cache with the merge from the remote/client manifest.

    The steps are the following.
    1. Get the latest version of the package from the cache.
    2. If does not exist will return a

    @param name
    @param remoteManifest
    @returns return a merged manifest.
  */
  public async updateVersionsNext(name: string, remoteManifest: Manifest): Promise<Manifest> {
    debug(`updating versions for package %o`, name);
    let cacheManifest: Manifest = await this.readCreatePackage(name);
    let change = false;
    // updating readme
    cacheManifest.readme = getLatestReadme(remoteManifest);
    if (remoteManifest.readme !== cacheManifest.readme) {
      debug('manifest readme updated for %o', name);
      change = true;
    }

    debug('updating new remote versions');
    for (const versionId in remoteManifest.versions) {
      // if detect a new remote version does not exist cache
      if (_.isNil(cacheManifest.versions[versionId])) {
        debug('new version from upstream %o', versionId);
        let version = remoteManifest.versions[versionId];

        // removing readmes depends on config
        version = cleanUpReadme(
          version,
          remoteManifest[DIST_TAGS],
          this.config?.publish?.keep_readmes
        );
        debug('clean up readme for %o', versionId);
        version.contributors = normalizeContributors(version.contributors as Author[]);

        change = true;
        cacheManifest.versions[versionId] = version;

        if (version?.dist?.tarball) {
          const filename = tarballUtils.extractTarballFromUrl(version.dist.tarball);
          // store a fast access to the dist file by tarball name
          // it does NOT overwrite any existing records
          if (_.isNil(cacheManifest?._distfiles[filename])) {
            const hash: DistFile = (cacheManifest._distfiles[filename] = {
              url: version.dist.tarball,
              sha: version.dist.shasum,
            });
            // store cache metadata this the manifest
            const upLink: string = version[Symbol.for('__verdaccio_uplink')];
            if (_.isNil(upLink) === false) {
              this.updateUplinkToRemoteProtocol(hash, upLink);
            }
          }
        }
      } else {
        debug('no new versions from upstream %s', name);
      }
    }

    debug('update dist-tags');
    for (const tag in remoteManifest[DIST_TAGS]) {
      if (
        !cacheManifest[DIST_TAGS][tag] ||
        cacheManifest[DIST_TAGS][tag] !== remoteManifest[DIST_TAGS][tag]
      ) {
        change = true;
        cacheManifest[DIST_TAGS][tag] = remoteManifest[DIST_TAGS][tag];
      }
    }

    for (const up in remoteManifest._uplinks) {
      if (Object.prototype.hasOwnProperty.call(remoteManifest._uplinks, up)) {
        const need_change =
          !validationUtils.isObject(cacheManifest._uplinks[up]) ||
          remoteManifest._uplinks[up].etag !== cacheManifest._uplinks[up].etag ||
          remoteManifest._uplinks[up].fetched !== cacheManifest._uplinks[up].fetched;

        if (need_change) {
          change = true;
          cacheManifest._uplinks[up] = remoteManifest._uplinks[up];
        }
      }
    }

    debug('update time');
    if ('time' in remoteManifest && !_.isEqual(cacheManifest.time, remoteManifest.time)) {
      cacheManifest.time = remoteManifest.time;
      change = true;
    }

    if (change) {
      debug('updating package info %o', name);
      await this.writePackage(name, cacheManifest);
      return cacheManifest;
    } else {
      return cacheManifest;
    }
  }

  private async getTarballStats(version: Version, buffer: Buffer): Promise<TarballDetails> {
    if (
      version.dist == undefined ||
      version.dist?.fileCount == undefined ||
      version.dist?.unpackedSize == undefined
    ) {
      debug('tarball stats not found, calculating');
      return await getTarballDetails(buffer);
    } else {
      debug('tarball stats found');
      return { fileCount: version.dist.fileCount, unpackedSize: version.dist.unpackedSize };
    }
  }

  private async checkAllowedToChangePackage(manifest: Manifest, username: string | undefined) {
    // Checks to perform if config "publish:check_owners" is true
    debug('check if user %o is an owner and allowed to change package', username);
    // if name of owner is not included in list of maintainers, then throw an error
    if (
      this.config?.publish?.check_owners === true &&
      manifest.maintainers &&
      manifest.maintainers.length > 0 &&
      !manifest.maintainers.some((maintainer) => maintainer.name === username)
    ) {
      this.logger.error({ username }, '@{username} is not a maintainer (package owner)');
      throw Error('only owners are allowed to change package');
    }
  }
}

export { Storage };
