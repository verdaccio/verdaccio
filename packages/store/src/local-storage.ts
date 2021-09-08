import assert from 'assert';
import UrlNode from 'url';
import { PassThrough } from 'stream';
import _ from 'lodash';
import buildDebug from 'debug';

import { ErrorCode, isObject, getLatestVersion } from '@verdaccio/utils';
import { searchUtils, pluginUtils, pkgUtils, validatioUtils } from '@verdaccio/core';
import { API_ERROR, DIST_TAGS, HTTP_STATUS, SUPPORT_ERRORS, USERS } from '@verdaccio/commons-api';
import { createTarballHash } from '@verdaccio/utils';
import { loadPlugin } from '@verdaccio/loaders';
import LocalDatabase from '@verdaccio/local-storage';
import { UploadTarball, ReadTarball } from '@verdaccio/streams';
import {
  Token,
  TokenFilter,
  Package,
  Config,
  IUploadTarball,
  IReadTarball,
  MergeTags,
  Version,
  DistFile,
  Callback,
  Logger,
  IPackageStorage,
  Author,
  CallbackAction,
  StringValue,
  StorageUpdateCallback,
} from '@verdaccio/types';
import { VerdaccioError } from '@verdaccio/commons-api';

import {
  generatePackageTemplate,
  normalizePackage,
  generateRevision,
  getLatestReadme,
  cleanUpReadme,
  normalizeContributors,
  STORAGE,
  tagVersion,
} from './storage-utils';

const debug = buildDebug('verdaccio:storage:local');

export type IPluginStorage = pluginUtils.IPluginStorage<Config>;

export function normalizeSearchPackage(
  pkg: Package,
  searchItem: searchUtils.SearchItem
): searchUtils.SearchPackageBody {
  const latest = pkgUtils.getLatest(pkg);
  const version: Version = pkg.versions[latest];
  const result: searchUtils.SearchPackageBody = {
    name: version.name,
    scope: '',
    description: version.description,
    version: latest,
    keywords: version.keywords,
    date: pkg.time[latest],
    // FIXME: type
    author: version.author as any,
    // FIXME: not possible fill this out from a private package
    publisher: {},
    // FIXME: type
    maintainers: version.maintainers as any,
    links: {
      npm: '',
      homepage: version.homepage,
      repository: version.repository,
      bugs: version.bugs,
    },
  };

  if (typeof searchItem.package.scoped === 'string') {
    result.scope = searchItem.package.scoped;
  }

  return result;
}

export const PROTO_NAME = '__proto__';

/**
 * Implements Storage interface (same for storage.js, local-storage.js, up-storage.js).
 */
class LocalStorage {
  public config: Config;
  public storagePlugin: IPluginStorage;
  public logger: Logger;

  public constructor(config: Config, logger: Logger) {
    debug('local storage created');
    this.logger = logger.child({ sub: 'fs' });
    this.config = config;
    // @ts-expect-error
    this.storagePlugin = null;
  }

  public async init() {
    if (this.storagePlugin === null) {
      this.storagePlugin = this._loadStorage(this.config, this.logger);
      debug('storage plugin init');
      await this.storagePlugin.init();
      debug('storage plugin initialized');
    } else {
      this.logger.warn('storage plugin has been already initialized');
    }
    return;
  }

  public addPackage(name: string, pkg: Package, callback: Callback): void {
    debug(`creating a package for`, name);
    const storage: any = this._getLocalStorage(name);

    if (_.isNil(storage)) {
      debug(`storage is missing for %o package cannot be added`, name);
      return callback(ErrorCode.getNotFound('this package cannot be added'));
    }

    storage.createPackage(name, generatePackageTemplate(name), (err) => {
      if (
        _.isNull(err) === false &&
        (err.code === STORAGE.FILE_EXIST_ERROR || err.code === HTTP_STATUS.CONFLICT)
      ) {
        debug(`error on creating a package for %o with error %o`, name, err.message);
        return callback(ErrorCode.getConflict());
      }

      const latest = getLatestVersion(pkg);
      if (_.isNil(latest) === false && pkg.versions[latest]) {
        debug('latest version found %o for %o', latest, name);
        return callback(null, pkg.versions[latest]);
      }

      debug('no latest version found for %o', name);
      return callback();
    });
  }

  /**
   * Remove package with all it contents.
   */
  public async removePackage(name: string): Promise<void> {
    debug('remove package %s', name);
    const storage: any = this._getLocalStorage(name);

    if (_.isNil(storage)) {
      throw ErrorCode.getNotFound();
    }

    return new Promise((resolve, reject) => {
      storage.readPackage(name, async (err, data: Package): Promise<void> => {
        if (_.isNil(err) === false) {
          if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
            debug(`error on not found %o with error %o`, name, err.message);
            return reject(ErrorCode.getNotFound());
          }
          return reject(err);
        }

        data = normalizePackage(data);

        try {
          await this.storagePlugin.remove(name);
          // remove each attachment
          const attachments = Object.keys(data._attachments);
          debug('attachments to remove %s', attachments?.length);
          for (let attachment of attachments) {
            debug('remove attachment %s', attachment);
            await storage.deletePackage(attachment);
          }
          // remove package.json
          debug('remove package.json');
          await storage.deletePackage(STORAGE.PACKAGE_FILE_NAME);
          // remove folder
          debug('remove package folder');
          await storage.removePackage();
          resolve();
        } catch (err: any) {
          this.logger.error({ err }, 'removed package has failed @{err.message}');
          throw ErrorCode.getBadData(err.message);
        }
      });
    });
  }

  /**
   * Synchronize remote package info with the local one
   * @param {*} name
   * @param {*} packageInfo
   * @param {*} callback
   */
  public updateVersions(name: string, packageInfo: Package, callback: Callback): void {
    debug(`updating versions for package %o`, name);
    this._readCreatePackage(name, (err, packageLocalJson): void => {
      if (err) {
        return callback(err);
      }

      let change = false;
      // updating readme
      packageLocalJson.readme = getLatestReadme(packageInfo);
      if (packageInfo.readme !== packageLocalJson.readme) {
        change = true;
      }

      debug('update versions');
      for (const versionId in packageInfo.versions) {
        if (_.isNil(packageLocalJson.versions[versionId])) {
          let version = packageInfo.versions[versionId];

          // we don't keep readme for package versions,
          // only one readme per package
          version = cleanUpReadme(version);
          debug('clean up readme for %o', versionId);
          version.contributors = normalizeContributors(version.contributors as Author[]);

          change = true;
          packageLocalJson.versions[versionId] = version;

          if (version?.dist?.tarball) {
            const urlObject: any = UrlNode.parse(version.dist.tarball);
            const filename = urlObject.pathname.replace(/^.*\//, '');

            // we do NOT overwrite any existing records
            if (_.isNil(packageLocalJson._distfiles[filename])) {
              const hash: DistFile = (packageLocalJson._distfiles[filename] = {
                url: version.dist.tarball,
                sha: version.dist.shasum,
              });
              const upLink: string = version[Symbol.for('__verdaccio_uplink')];

              if (_.isNil(upLink) === false) {
                this._updateUplinkToRemoteProtocol(hash, upLink);
              }
            }
          }
        }
      }

      debug('update dist-tags');
      for (const tag in packageInfo[DIST_TAGS]) {
        if (
          !packageLocalJson[DIST_TAGS][tag] ||
          packageLocalJson[DIST_TAGS][tag] !== packageInfo[DIST_TAGS][tag]
        ) {
          change = true;
          packageLocalJson[DIST_TAGS][tag] = packageInfo[DIST_TAGS][tag];
        }
      }

      for (const up in packageInfo._uplinks) {
        if (Object.prototype.hasOwnProperty.call(packageInfo._uplinks, up)) {
          const need_change =
            !isObject(packageLocalJson._uplinks[up]) ||
            packageInfo._uplinks[up].etag !== packageLocalJson._uplinks[up].etag ||
            packageInfo._uplinks[up].fetched !== packageLocalJson._uplinks[up].fetched;

          if (need_change) {
            change = true;
            packageLocalJson._uplinks[up] = packageInfo._uplinks[up];
          }
        }
      }

      debug('update time');
      if ('time' in packageInfo && !_.isEqual(packageLocalJson.time, packageInfo.time)) {
        packageLocalJson.time = packageInfo.time;
        change = true;
      }

      if (change) {
        debug('updating package info %o', name);
        this._writePackage(name, packageLocalJson, function (err): void {
          callback(err, packageLocalJson);
        });
      } else {
        callback(null, packageLocalJson);
      }
    });
  }

  /**
   * Add a new version to a previous local package.
   * @param {*} name
   * @param {*} version
   * @param {*} metadata
   * @param {*} tag
   * @param {*} callback
   */
  public addVersion(
    name: string,
    version: string,
    metadata: Version,
    tag: StringValue,
    callback: Callback
  ): void {
    debug(`add version %s package for %s`, version, name);
    this._updatePackage(
      name,
      async (data, cb: Callback): Promise<void> => {
        debug('%s package is being updated', name);
        // keep only one readme per package
        data.readme = metadata.readme;
        debug('%s` readme mutated', name);
        // TODO: lodash remove
        metadata = cleanUpReadme(metadata);
        metadata.contributors = normalizeContributors(metadata.contributors as Author[]);
        debug('%s` contributors normalized', name);
        const hasVersion = data.versions[version] != null;
        if (hasVersion) {
          debug('%s version %s already exists', name, version);
          return cb(ErrorCode.getConflict());
        }

        // if uploaded tarball has a different shasum, it's very likely that we
        // have some kind of error
        if (validatioUtils.isObject(metadata.dist) && _.isString(metadata.dist.tarball)) {
          const tarball = metadata.dist.tarball.replace(/.*\//, '');

          if (validatioUtils.isObject(data._attachments[tarball])) {
            if (
              _.isNil(data._attachments[tarball].shasum) === false &&
              _.isNil(metadata.dist.shasum) === false
            ) {
              if (data._attachments[tarball].shasum != metadata.dist.shasum) {
                const errorMessage =
                  `shasum error, ` +
                  `${data._attachments[tarball].shasum} != ${metadata.dist.shasum}`;
                return cb(ErrorCode.getBadRequest(errorMessage));
              }
            }

            const currentDate = new Date().toISOString();

            // some old storage do not have this field #740
            if (_.isNil(data.time)) {
              data.time = {};
            }

            data.time['modified'] = currentDate;

            if ('created' in data.time === false) {
              data.time.created = currentDate;
            }

            data.time[version] = currentDate;
            data._attachments[tarball].version = version;
          }
        }

        data.versions[version] = metadata;
        tagVersion(data, version, tag);

        try {
          debug('%s` add on database', name);
          await this.storagePlugin.add(name);
          cb();
        } catch (err: any) {
          cb(ErrorCode.getBadData(err.message));
        }
      },
      callback
    );
  }

  /**
   * Merge a new list of tags for a local packages with the existing one.
   * @param {*} pkgName
   * @param {*} tags
   * @param {*} callback
   */
  public mergeTags(pkgName: string, tags: MergeTags, callback: Callback): void {
    debug(`merge tags for`, pkgName);
    this._updatePackage(
      pkgName,
      (data, cb): void => {
        /* eslint guard-for-in: 0 */
        for (const tag in tags) {
          // this handle dist-tag rm command
          if (_.isNull(tags[tag])) {
            delete data[DIST_TAGS][tag];
            continue;
          }

          if (_.isNil(data.versions[tags[tag]])) {
            return cb(ErrorCode.getNotFound(API_ERROR.VERSION_NOT_EXIST));
          }
          const version: string = tags[tag];
          tagVersion(data, version, tag);
        }
        cb(null);
      },
      callback
    );
  }

  /**
   * Update the package metadata, tags and attachments (tarballs).
   * Note: Currently supports unpublishing and deprecation.
   * @param {*} name
   * @param {*} incomingPkg
   * @param {*} revision
   * @param {*} callback
   * @return {Function}
   */
  public changePackage(
    name: string,
    incomingPkg: Package,
    revision: string | void,
    callback: Callback
  ): void {
    debug(`change package tags for %o revision %s`, name, revision);
    if (
      !validatioUtils.isObject(incomingPkg.versions) ||
      !validatioUtils.isObject(incomingPkg[DIST_TAGS])
    ) {
      debug(`change package bad data for %o`, name);
      return callback(ErrorCode.getBadData());
    }

    debug(`change package udapting package for %o`, name);
    this._updatePackage(
      name,
      (localData: Package, cb: CallbackAction): void => {
        for (const version in localData.versions) {
          const incomingVersion = incomingPkg.versions[version];
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
                this.logger.info(
                  { name: name, version: version },
                  'deprecating @{name}@@{version}'
                );
                localData.versions[version].deprecated = incomingDeprecated;
              }
              localData.time!.modified = new Date().toISOString();
            }
          }
        }

        localData[USERS] = incomingPkg[USERS];
        localData[DIST_TAGS] = incomingPkg[DIST_TAGS];
        cb(null);
      },
      function (err): void {
        if (err) {
          return callback(err);
        }
        callback();
      }
    );
  }
  /**
   * Remove a tarball.
   * @param {*} name
   * @param {*} filename
   * @param {*} revision
   * @param {*} callback
   */
  public removeTarball(
    name: string,
    filename: string,
    revision: string,
    callback: CallbackAction
  ): void {
    debug('remove tarball %s for %s', filename, name);
    assert(validatioUtils.validateName(filename));
    this._updatePackage(
      name,
      (data, cb): void => {
        if (data._attachments[filename]) {
          // TODO: avoid using delete
          delete data._attachments[filename];
          cb(null);
        } else {
          cb(ErrorCode.getNotFound('no such file available'));
        }
      },
      (err: VerdaccioError) => {
        if (err) {
          this.logger.error({ err }, 'remove tarball error @{err.message}');
          return callback(err);
        }
        const storage = this._getLocalStorage(name);

        if (storage) {
          debug('removing %s from storage', filename);
          storage
            .deletePackage(filename)
            .then((): void => {
              debug('package %s removed', filename);
              return callback(null);
            })
            .catch((err) => {
              this.logger.error({ err }, 'error removing %s from storage');
              return callback(null);
            });
        } else {
          callback(ErrorCode.getInternalError());
        }
      }
    );
  }

  /**
   * Add a tarball.
   * @param {String} name
   * @param {String} filename
   * @return {Stream}
   */
  public addTarball(name: string, filename: string): IUploadTarball {
    debug(`add a tarball for %o`, name);
    assert(validatioUtils.validateName(filename));

    let length = 0;
    const shaOneHash = createTarballHash();
    const uploadStream: IUploadTarball = new UploadTarball({});
    const _transform = uploadStream._transform;
    const storage = this._getLocalStorage(name);

    uploadStream.abort = function (): void {};
    uploadStream.done = function (): void {};

    uploadStream._transform = function (data, ...args): void {
      shaOneHash.update(data);
      // measure the length for validation reasons
      length += data.length;
      const appliedData = [data, ...args];
      // FIXME: not sure about this approach, tsc complains
      // @ts-ignore
      _transform.apply(uploadStream, appliedData);
    };

    if (name === PROTO_NAME) {
      process.nextTick((): void => {
        uploadStream.emit('error', ErrorCode.getForbidden());
      });
      return uploadStream;
    }

    // FIXME: this condition will never met, storage is always defined
    if (!storage) {
      process.nextTick((): void => {
        uploadStream.emit('error', "can't upload this package");
      });
      return uploadStream;
    }

    const writeStream: IUploadTarball = storage.writeTarball(filename);

    writeStream.on('error', (err) => {
      // @ts-ignore
      if (err.code === STORAGE.FILE_EXIST_ERROR || err.code === HTTP_STATUS.CONFLICT) {
        uploadStream.emit('error', ErrorCode.getConflict());
        uploadStream.abort();
        // @ts-ignore
      } else if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
        // check if package exists to throw an appropriate message
        this.getPackageMetadata(name, function (_err: VerdaccioError): void {
          if (_err) {
            uploadStream.emit('error', _err);
          } else {
            uploadStream.emit('error', err);
          }
        });
      } else {
        uploadStream.emit('error', err);
      }
    });

    writeStream.on('open', function (): void {
      // re-emitting open because it's handled in storage.js
      uploadStream.emit('open');
    });

    writeStream.on('success', (): void => {
      this._updatePackage(
        name,
        function updater(data, cb): void {
          // FUTURE: move this to tarballUtils
          data._attachments[filename] = {
            shasum: shaOneHash.digest('hex'),
          };
          cb(null);
        },
        function (err): void {
          if (err) {
            // FIXME: if the update package fails, remove tarball to avoid left
            // orphan tarballs
            uploadStream.emit('error', err);
          } else {
            uploadStream.emit('success');
          }
        }
      );
    });

    uploadStream.abort = function (): void {
      writeStream.abort();
    };

    uploadStream.done = function (): void {
      if (!length) {
        uploadStream.emit('error', ErrorCode.getBadData('refusing to accept zero-length file'));
        writeStream.abort();
      } else {
        writeStream.done();
      }
    };

    uploadStream.pipe(writeStream);

    return uploadStream;
  }

  /**
   * Get a tarball.
   * @param {*} name
   * @param {*} filename
   * @return {ReadTarball}
   */
  public getTarball(name: string, filename: string): IReadTarball {
    assert(validatioUtils.validateName(filename));

    const storage: IPackageStorage = this._getLocalStorage(name);

    if (_.isNil(storage)) {
      return this._createFailureStreamResponse();
    }

    return this._streamSuccessReadTarBall(storage, filename);
  }

  /**
   * Return a stream that emits a read failure.
   * @private
   * @return {ReadTarball}
   */
  private _createFailureStreamResponse(): IReadTarball {
    const stream: IReadTarball = new ReadTarball({});

    process.nextTick((): void => {
      stream.emit('error', ErrorCode.getNotFound('no such file available'));
    });
    return stream;
  }

  /**
   * Return a stream that emits the tarball data
   * @param {Object} storage
   * @param {String} filename
   * @private
   * @return {ReadTarball}
   */
  private _streamSuccessReadTarBall(storage: any, filename: string): IReadTarball {
    const stream: IReadTarball = new ReadTarball({});
    const readTarballStream = storage.readTarball(filename);
    const e404 = ErrorCode.getNotFound;

    stream.abort = function (): void {
      if (_.isNil(readTarballStream) === false) {
        readTarballStream.abort();
      }
    };

    readTarballStream.on('error', function (err) {
      // @ts-ignore
      if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
        stream.emit('error', e404('no such file available'));
      } else {
        stream.emit('error', err);
      }
    });

    readTarballStream.on('content-length', function (content): void {
      stream.emit('content-length', content);
    });

    readTarballStream.on('open', function (): void {
      // re-emitting open because it's handled in storage.js
      stream.emit('open');
      readTarballStream.pipe(stream);
    });

    return stream;
  }

  /**
   * Retrieve a package by name.
   * @param {*} name
   * @param {*} callback
   * @return {Function}
   */
  public getPackageMetadata(name: string, callback: Callback = (): void => {}): void {
    const storage: IPackageStorage = this._getLocalStorage(name);
    debug('get package metadata for %o', name);
    if (typeof storage === 'undefined') {
      return callback(ErrorCode.getNotFound());
    }

    this._readPackage(name, storage, callback);
  }

  public async search(searchStream: PassThrough, query: searchUtils.SearchQuery): Promise<void> {
    debug('search on each package');
    this.logger.info(
      { t: query.text, q: query.quality, p: query.popularity, m: query.maintenance, s: query.size },
      'search by text @{t}| maintenance @{m}| quality @{q}| popularity @{p}'
    );
    const getMetadata = (searchItem: searchUtils.SearchItem) => {
      return new Promise((resolve, reject) => {
        this.getPackageMetadata(
          searchItem?.package?.name,
          (err: VerdaccioError, pkg: Package): void => {
            if (err) {
              this.logger.error(
                { err, pkgName: searchItem?.package?.name },
                'error on load package @{pkgName} metaadata @{err.message}'
              );
              reject(err);
            }

            const searchPackage = normalizeSearchPackage(pkg, searchItem);
            const searchPackageItem: searchUtils.SearchPackageItem = {
              package: searchPackage,
              score: searchItem.score,
              flags: searchItem?.flags,
              // FUTURE: find a better way to calculate the score
              searchScore: 1,
            };
            debug('push to stream %o', searchItem?.package?.name);
            resolve(searchPackageItem);
          }
        );
      });
    };

    if (typeof this.storagePlugin.search === 'undefined') {
      this.logger.info('plugin search not implemented yet');
      searchStream.end();
    } else {
      debug('search on each package by plugin');
      const items = await this.storagePlugin.search(query);
      try {
        for (const item of items) {
          const metadata = await getMetadata(item);
          searchStream.write(metadata);
        }
        debug('search local stream end');
        searchStream.end();
      } catch (err) {
        this.logger.error({ err, query }, 'error on search by plugin @{err.message}');
        searchStream.emit('error', err);
      }
    }
  }

  /**
   * Retrieve a wrapper that provide access to the package location.
   * @param {Object} pkgName package name.
   * @return {Object}
   */
  private _getLocalStorage(pkgName: string): IPackageStorage {
    debug('get local storage for %o', pkgName);
    return this.storagePlugin.getPackageStorage(pkgName);
  }

  /**
   * Read a json file from storage.
   * @param {Object} storage
   * @param {Function} callback
   */
  private _readPackage(name: string, storage: any, callback: Callback): void {
    storage.readPackage(name, (err, result): void => {
      if (err) {
        if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
          debug('package %s not found', name);
          return callback(ErrorCode.getNotFound());
        }
        return callback(this._internalError(err, STORAGE.PACKAGE_FILE_NAME, 'error reading'));
      }

      callback(err, normalizePackage(result));
    });
  }

  /**
   * Retrieve either a previous created local package or a boilerplate.
   * @param {*} pkgName
   * @param {*} callback
   * @return {Function}
   */
  private _readCreatePackage(pkgName: string, callback: Callback): void {
    const storage: any = this._getLocalStorage(pkgName);
    if (_.isNil(storage)) {
      this._createNewPackage(pkgName, callback);
      return;
    }

    storage.readPackage(pkgName, (err, data): void => {
      // TODO: race condition
      if (_.isNil(err) === false) {
        if (err.code === STORAGE.NO_SUCH_FILE_ERROR || err.code === HTTP_STATUS.NOT_FOUND) {
          data = generatePackageTemplate(pkgName);
        } else {
          return callback(this._internalError(err, STORAGE.PACKAGE_FILE_NAME, 'error reading'));
        }
      }

      callback(null, normalizePackage(data));
    });
  }

  private _createNewPackage(name: string, callback: Callback): Callback {
    return callback(null, normalizePackage(generatePackageTemplate(name)));
  }

  /**
   * Handle internal error
   * @param {*} err
   * @param {*} file
   * @param {*} message
   * @return {Object} Error instance
   */
  private _internalError(err: string, file: string, message: string): VerdaccioError {
    this.logger.error({ err: err, file: file }, `${message}  @{file}: @{!err.message}`);

    return ErrorCode.getInternalError();
  }

  /**
   * @param {*} name package name
   * @param {*} updateHandler function(package, cb) - update function
   * @param {*} callback callback that gets invoked after it's all updated
   * @return {Function}
   */
  private _updatePackage(
    name: string,
    updateHandler: StorageUpdateCallback,
    callback: Callback
  ): void {
    const storage: IPackageStorage = this._getLocalStorage(name);

    if (!storage) {
      return callback(ErrorCode.getNotFound());
    }

    storage.updatePackage(
      name,
      updateHandler,
      this._writePackage.bind(this),
      normalizePackage,
      callback
    );
  }

  /**
   * Update the revision (_rev) string for a package.
   * @param {*} name
   * @param {*} json
   * @param {*} callback
   * @return {Function}
   */
  private _writePackage(name: string, json: Package, callback: Callback): void {
    const storage: any = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return callback();
    }
    storage.savePackage(name, this._setDefaultRevision(json), callback);
  }

  private _setDefaultRevision(json: Package): Package {
    // calculate revision from couch db
    if (_.isString(json._rev) === false) {
      json._rev = STORAGE.DEFAULT_REVISION;
    }

    // this is intended in debug mode we do not want modify the store revision
    if (_.isNil(this.config._debug)) {
      json._rev = generateRevision(json._rev);
    }

    return json;
  }

  // private _deleteAttachments(storage: any, attachments: string[], callback: Callback): void {
  //   debug('deleting %o attachments total %o', attachments?.length);
  //   const unlinkNext = function (cb): void {
  //     if (_.isEmpty(attachments)) {
  //       return cb();
  //     }

  //     const attachment = attachments.shift();
  //     storage.deletePackage(attachment, function (): void {
  //       unlinkNext(cb);
  //     });
  //   };

  //   unlinkNext(function (): void {
  //     // try to unlink the directory, but ignore errors because it can fail
  //     storage.removePackage(function (err): void {
  //       callback(err);
  //     });
  //   });
  // }

  /**
   * Ensure the dist file remains as the same protocol
   * @param {Object} hash metadata
   * @param {String} upLinkKey registry key
   * @private
   */
  private _updateUplinkToRemoteProtocol(hash: DistFile, upLinkKey: string): void {
    // if we got this information from a known registry,
    // use the same protocol for the tarball
    //
    // see https://github.com/rlidwka/sinopia/issues/166
    const tarballUrl: any = UrlNode.parse(hash.url);
    const uplinkUrl: any = UrlNode.parse(this.config.uplinks[upLinkKey].url);

    if (uplinkUrl.host === tarballUrl.host) {
      tarballUrl.protocol = uplinkUrl.protocol;
      hash.registry = upLinkKey;
      hash.url = UrlNode.format(tarballUrl);
    }
  }

  public async getSecret(config: Config): Promise<void> {
    const secretKey = await this.storagePlugin.getSecret();

    return this.storagePlugin.setSecret(config.checkSecretKey(secretKey));
  }

  private _loadStorage(config: Config, logger: Logger): IPluginStorage {
    const Storage = this._loadStorePlugin();

    if (_.isNil(Storage)) {
      assert(this.config.storage, 'CONFIG: storage path not defined');
      return new LocalDatabase(this.config, logger);
    }
    return Storage as IPluginStorage;
  }

  private _loadStorePlugin(): IPluginStorage | void {
    const plugin_params = {
      config: this.config,
      logger: this.logger,
    };

    const plugins: IPluginStorage[] = loadPlugin<IPluginStorage>(
      this.config,
      this.config.store,
      plugin_params,
      (plugin): IPluginStorage => {
        return plugin.getPackageStorage;
      }
    );

    return _.head(plugins);
  }

  public saveToken(token: Token): Promise<any> {
    if (_.isFunction(this.storagePlugin.saveToken) === false) {
      return Promise.reject(
        ErrorCode.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE)
      );
    }

    return this.storagePlugin.saveToken(token);
  }

  public deleteToken(user: string, tokenKey: string): Promise<any> {
    if (_.isFunction(this.storagePlugin.deleteToken) === false) {
      return Promise.reject(
        ErrorCode.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE)
      );
    }

    return this.storagePlugin.deleteToken(user, tokenKey);
  }

  public readTokens(filter: TokenFilter): Promise<Token[]> {
    if (_.isFunction(this.storagePlugin.readTokens) === false) {
      return Promise.reject(
        ErrorCode.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE)
      );
    }

    return this.storagePlugin.readTokens(filter);
  }
}

export { LocalStorage };
