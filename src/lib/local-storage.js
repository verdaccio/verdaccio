/**
 * @prettier
 * @flow
 */

import assert from 'assert';
import UrlNode from 'url';
import _ from 'lodash';
// $FlowFixMe
import { ErrorCode, isObject, getLatestVersion, tagVersion, validateName } from './utils';
import { generatePackageTemplate, normalizePackage, generateRevision, getLatestReadme, cleanUpReadme, normalizeContributors } from './storage-utils';
import { API_ERROR, DIST_TAGS, STORAGE } from './constants';
import { createTarballHash } from './crypto-utils';
import { prepareSearchPackage } from './storage-utils';
import loadPlugin from '../lib/plugin-loader';
import LocalDatabase from '@verdaccio/local-storage';
import { UploadTarball, ReadTarball } from '@verdaccio/streams';
import type { Package, Config, MergeTags, Version, DistFile, Callback, Logger } from '@verdaccio/types';
import type { ILocalData, IPackageStorage } from '@verdaccio/local-storage';
import type { IUploadTarball, IReadTarball } from '@verdaccio/streams';
import type { IStorage, StringValue } from '../../types';

/**
 * Implements Storage interface (same for storage.js, local-storage.js, up-storage.js).
 */
class LocalStorage implements IStorage {
  config: Config;
  localData: ILocalData;
  logger: Logger;

  constructor(config: Config, logger: Logger) {
    this.logger = logger.child({ sub: 'fs' });
    this.config = config;
    this.localData = this._loadStorage(config, logger);
  }

  addPackage(name: string, pkg: Package, callback: Callback) {
    const storage: any = this._getLocalStorage(name);

    if (_.isNil(storage)) {
      return callback(ErrorCode.getNotFound('this package cannot be added'));
    }

    storage.createPackage(name, generatePackageTemplate(name), err => {
      if (_.isNull(err) === false && err.code === STORAGE.FILE_EXIST_ERROR) {
        return callback(ErrorCode.getConflict());
      }

      const latest = getLatestVersion(pkg);
      if (_.isNil(latest) === false && pkg.versions[latest]) {
        return callback(null, pkg.versions[latest]);
      }

      return callback();
    });
  }

  /**
   * Remove package.
   * @param {*} name
   * @param {*} callback
   * @return {Function}
   */
  removePackage(name: string, callback: Callback) {
    let storage: any = this._getLocalStorage(name);

    if (_.isNil(storage)) {
      return callback(ErrorCode.getNotFound());
    }

    storage.readPackage(name, (err, data) => {
      if (_.isNil(err) === false) {
        if (err.code === STORAGE.NO_SUCH_FILE_ERROR) {
          return callback(ErrorCode.getNotFound());
        } else {
          return callback(err);
        }
      }

      data = normalizePackage(data);

      this.localData.remove(name, removeFailed => {
        if (removeFailed) {
          // This will happen when database is locked
          return callback(ErrorCode.getBadData(removeFailed.message));
        }

        storage.deletePackage(STORAGE.PACKAGE_FILE_NAME, err => {
          if (err) {
            return callback(err);
          }
          const attachments = Object.keys(data._attachments);

          this._deleteAttachments(storage, attachments, callback);
        });
      });
    });
  }

  /**
   * Synchronize remote package info with the local one
   * @param {*} name
   * @param {*} packageInfo
   * @param {*} callback
   */
  updateVersions(name: string, packageInfo: Package, callback: Callback) {
    this._readCreatePackage(name, (err, packageLocalJson) => {
      if (err) {
        return callback(err);
      }

      let change = false;
      // updating readme
      packageLocalJson.readme = getLatestReadme(packageInfo);
      if (packageInfo.readme !== packageLocalJson.readme) {
        change = true;
      }
      for (let versionId in packageInfo.versions) {
        if (_.isNil(packageLocalJson.versions[versionId])) {
          let version = packageInfo.versions[versionId];

          // we don't keep readme for package versions,
          // only one readme per package
          version = cleanUpReadme(version);
          version.contributors = normalizeContributors(version.contributors);

          change = true;
          packageLocalJson.versions[versionId] = version;

          if (version.dist && version.dist.tarball) {
            const urlObject: any = UrlNode.parse(version.dist.tarball);
            const filename = urlObject.pathname.replace(/^.*\//, '');

            // we do NOT overwrite any existing records
            if (_.isNil(packageLocalJson._distfiles[filename])) {
              let hash: DistFile = (packageLocalJson._distfiles[filename] = {
                url: version.dist.tarball,
                sha: version.dist.shasum,
              });
              /* eslint spaced-comment: 0 */
              // $FlowFixMe
              const upLink: string = version[Symbol.for('__verdaccio_uplink')];

              if (_.isNil(upLink) === false) {
                this._updateUplinkToRemoteProtocol(hash, upLink);
              }
            }
          }
        }
      }

      for (let tag in packageInfo[DIST_TAGS]) {
        if (!packageLocalJson[DIST_TAGS][tag] || packageLocalJson[DIST_TAGS][tag] !== packageInfo[DIST_TAGS][tag]) {
          change = true;
          packageLocalJson[DIST_TAGS][tag] = packageInfo[DIST_TAGS][tag];
        }
      }

      for (let up in packageInfo._uplinks) {
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

      if ('time' in packageInfo) {
        packageLocalJson.time = packageInfo.time;
        change = true;
      }

      if (change) {
        this.logger.debug({ name }, 'updating package @{name} info');
        this._writePackage(name, packageLocalJson, function(err) {
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
  addVersion(name: string, version: string, metadata: Version, tag: StringValue, callback: Callback) {
    this._updatePackage(
      name,
      (data, cb) => {
        // keep only one readme per package
        data.readme = metadata.readme;

        // TODO: lodash remove
        metadata = cleanUpReadme(metadata);
        metadata.contributors = normalizeContributors(metadata.contributors);

        if (data.versions[version] != null) {
          return cb(ErrorCode.getConflict());
        }

        // if uploaded tarball has a different shasum, it's very likely that we have some kind of error
        if (isObject(metadata.dist) && _.isString(metadata.dist.tarball)) {
          let tarball = metadata.dist.tarball.replace(/.*\//, '');

          if (isObject(data._attachments[tarball])) {
            if (_.isNil(data._attachments[tarball].shasum) === false && _.isNil(metadata.dist.shasum) === false) {
              if (data._attachments[tarball].shasum != metadata.dist.shasum) {
                const errorMessage = `shasum error, ${data._attachments[tarball].shasum} != ${metadata.dist.shasum}`;
                return cb(ErrorCode.getBadRequest(errorMessage));
              }
            }

            let currentDate = new Date().toISOString();

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

        this.localData.add(name, addFailed => {
          if (addFailed) {
            return cb(ErrorCode.getBadData(addFailed.message));
          }

          cb();
        });
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
  mergeTags(pkgName: string, tags: MergeTags, callback: Callback) {
    this._updatePackage(
      pkgName,
      (data, cb) => {
        /* eslint guard-for-in: 0 */
        for (let tag: string in tags) {
          // this handle dist-tag rm command
          if (_.isNull(tags[tag])) {
            delete data[DIST_TAGS][tag];
            continue;
          }

          if (_.isNil(data.versions[tags[tag]])) {
            return cb(this._getVersionNotFound());
          }
          const version: string = tags[tag];
          tagVersion(data, version, tag);
        }
        cb();
      },
      callback
    );
  }

  /**
   * Return version not found
   * @return {String}
   * @private
   */
  _getVersionNotFound() {
    return ErrorCode.getNotFound(API_ERROR.VERSION_NOT_EXIST);
  }

  /**
   * Return file no available
   * @return {String}
   * @private
   */
  _getFileNotAvailable() {
    return ErrorCode.getNotFound('no such file available');
  }

  /**
   * Update the package metadata, tags and attachments (tarballs).
   * Note: Currently supports unpublishing only.
   * @param {*} name
   * @param {*} incomingPkg
   * @param {*} revision
   * @param {*} callback
   * @return {Function}
   */
  changePackage(name: string, incomingPkg: Package, revision?: string, callback: Callback) {
    if (!isObject(incomingPkg.versions) || !isObject(incomingPkg[DIST_TAGS])) {
      return callback(ErrorCode.getBadData());
    }

    this._updatePackage(
      name,
      (localData, cb) => {
        for (let version in localData.versions) {
          if (_.isNil(incomingPkg.versions[version])) {
            this.logger.info({ name: name, version: version }, 'unpublishing @{name}@@{version}');

            delete localData.versions[version];
            delete localData.time[version];

            for (let file in localData._attachments) {
              if (localData._attachments[file].version === version) {
                delete localData._attachments[file].version;
              }
            }
          }
        }

        localData[DIST_TAGS] = incomingPkg[DIST_TAGS];
        cb();
      },
      function(err) {
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
  removeTarball(name: string, filename: string, revision: string, callback: Callback) {
    assert(validateName(filename));

    this._updatePackage(
      name,
      (data, cb) => {
        if (data._attachments[filename]) {
          delete data._attachments[filename];
          cb();
        } else {
          cb(this._getFileNotAvailable());
        }
      },
      err => {
        if (err) {
          return callback(err);
        }
        const storage = this._getLocalStorage(name);

        if (storage) {
          storage.deletePackage(filename, callback);
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
  addTarball(name: string, filename: string) {
    assert(validateName(filename));

    let length = 0;
    const shaOneHash = createTarballHash();
    const uploadStream: IUploadTarball = new UploadTarball();
    const _transform = uploadStream._transform;
    const storage = this._getLocalStorage(name);

    (uploadStream: any).abort = function() {};
    (uploadStream: any).done = function() {};

    uploadStream._transform = function(data) {
      shaOneHash.update(data);
      // measure the length for validation reasons
      length += data.length;
      _transform.apply(uploadStream, arguments);
    };

    if (name === STORAGE.PACKAGE_FILE_NAME || name === '__proto__') {
      process.nextTick(() => {
        uploadStream.emit('error', ErrorCode.getForbidden());
      });
      return uploadStream;
    }

    if (!storage) {
      process.nextTick(() => {
        uploadStream.emit('error', "can't upload this package");
      });
      return uploadStream;
    }

    const writeStream: IUploadTarball = storage.writeTarball(filename);

    writeStream.on('error', err => {
      if (err.code === STORAGE.FILE_EXIST_ERROR) {
        uploadStream.emit('error', ErrorCode.getConflict());
        uploadStream.abort();
      } else if (err.code === STORAGE.NO_SUCH_FILE_ERROR) {
        // check if package exists to throw an appropriate message
        this.getPackageMetadata(name, function(_err, res) {
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

    writeStream.on('open', function() {
      // re-emitting open because it's handled in storage.js
      uploadStream.emit('open');
    });

    writeStream.on('success', () => {
      this._updatePackage(
        name,
        function updater(data, cb) {
          data._attachments[filename] = {
            shasum: shaOneHash.digest('hex'),
          };
          cb();
        },
        function(err) {
          if (err) {
            uploadStream.emit('error', err);
          } else {
            uploadStream.emit('success');
          }
        }
      );
    });

    (uploadStream: any).abort = function() {
      writeStream.abort();
    };

    (uploadStream: any).done = function() {
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
  getTarball(name: string, filename: string): IReadTarball {
    assert(validateName(filename));

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
  _createFailureStreamResponse(): IReadTarball {
    const stream: IReadTarball = new ReadTarball();

    process.nextTick(() => {
      stream.emit('error', this._getFileNotAvailable());
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
  _streamSuccessReadTarBall(storage: any, filename: string): IReadTarball {
    const stream: IReadTarball = new ReadTarball();
    const readTarballStream = storage.readTarball(filename);
    const e404 = ErrorCode.getNotFound;

    (stream: any).abort = function() {
      if (_.isNil(readTarballStream) === false) {
        readTarballStream.abort();
      }
    };

    readTarballStream.on('error', function(err) {
      if (err && err.code === STORAGE.NO_SUCH_FILE_ERROR) {
        stream.emit('error', e404('no such file available'));
      } else {
        stream.emit('error', err);
      }
    });

    readTarballStream.on('content-length', function(v) {
      stream.emit('content-length', v);
    });

    readTarballStream.on('open', function() {
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
  getPackageMetadata(name: string, callback?: Callback = () => {}): void {
    const storage: IPackageStorage = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return callback(ErrorCode.getNotFound());
    }

    this._readPackage(name, storage, callback);
  }

  /**
   * Search a local package.
   * @param {*} startKey
   * @param {*} options
   * @return {Function}
   */
  search(startKey: string, options: any) {
    const stream = new ReadTarball({ objectMode: true });

    this._searchEachPackage(
      (item, cb) => {
        if (item.time > parseInt(startKey, 10)) {
          this.getPackageMetadata(item.name, (err: Error, data: Package) => {
            if (err) {
              return cb(err);
            }
            const time = new Date(item.time).toISOString();
            const result = prepareSearchPackage(data, time);
            if (_.isNil(result) === false) {
              stream.push(result);
            }
            cb();
          });
        } else {
          cb();
        }
      },
      function onEnd(err) {
        if (err) {
          return stream.emit('error', err);
        }
        stream.end();
      }
    );

    return stream;
  }

  /**
   * Retrieve a wrapper that provide access to the package location.
   * @param {Object} pkgName package name.
   * @return {Object}
   */
  _getLocalStorage(pkgName: string): IPackageStorage {
    return this.localData.getPackageStorage(pkgName);
  }

  /**
   * Read a json file from storage.
   * @param {Object} storage
   * @param {Function} callback
   */
  _readPackage(name: string, storage: any, callback: Callback) {
    storage.readPackage(name, (err, result) => {
      if (err) {
        if (err.code === STORAGE.NO_SUCH_FILE_ERROR) {
          return callback(ErrorCode.getNotFound());
        } else {
          return callback(this._internalError(err, STORAGE.PACKAGE_FILE_NAME, 'error reading'));
        }
      }

      callback(err, normalizePackage(result));
    });
  }

  _getCustomPackageLocalStorages() {
    const storages = {};

    // add custom storage if exist
    if (this.config.storage) {
      storages[this.config.storage] = true;
    }

    const { packages } = this.config;

    if (packages) {
      const listPackagesConf = Object.keys(packages || {});

      listPackagesConf.map(pkg => {
        if (packages[pkg].storage) {
          storages[packages[pkg].storage] = true;
        }
      });
    }

    return storages;
  }

  /**
   * Walks through each package and calls `on_package` on them.
   * @param {*} onPackage
   * @param {*} onEnd
   */
  _searchEachPackage(onPackage: Callback, onEnd: Callback) {
    // save wait whether plugin still do not support search functionality
    if (_.isNil(this.localData.search)) {
      this.logger.warn('plugin search not implemented yet');
      onEnd();
    } else {
      this.localData.search(onPackage, onEnd, validateName);
    }
  }

  /**
   * Retrieve either a previous created local package or a boilerplate.
   * @param {*} pkgName
   * @param {*} callback
   * @return {Function}
   */
  _readCreatePackage(pkgName: string, callback: Callback) {
    const storage: any = this._getLocalStorage(pkgName);
    if (_.isNil(storage)) {
      return this._createNewPackage(pkgName, callback);
    }

    storage.readPackage(pkgName, (err, data) => {
      // TODO: race condition
      if (_.isNil(err) === false) {
        if (err.code === STORAGE.NO_SUCH_FILE_ERROR) {
          data = generatePackageTemplate(pkgName);
        } else {
          return callback(this._internalError(err, STORAGE.PACKAGE_FILE_NAME, 'error reading'));
        }
      }

      callback(null, normalizePackage(data));
    });
  }

  _createNewPackage(name: string, callback: Callback): Callback {
    return callback(null, normalizePackage(generatePackageTemplate(name)));
  }

  /**
   * Handle internal error
   * @param {*} err
   * @param {*} file
   * @param {*} message
   * @return {Object} Error instance
   */
  _internalError(err: string, file: string, message: string) {
    this.logger.error({ err: err, file: file }, `${message}  @{file}: @{!err.message}`);

    return ErrorCode.getInternalError();
  }

  /**
   * @param {*} name package name
   * @param {*} updateHandler function(package, cb) - update function
   * @param {*} callback callback that gets invoked after it's all updated
   * @return {Function}
   */
  _updatePackage(name: string, updateHandler: Callback, callback: Callback) {
    const storage: IPackageStorage = this._getLocalStorage(name);

    if (!storage) {
      return callback(ErrorCode.getNotFound());
    }

    storage.updatePackage(name, updateHandler, this._writePackage.bind(this), normalizePackage, callback);
  }

  /**
   * Update the revision (_rev) string for a package.
   * @param {*} name
   * @param {*} json
   * @param {*} callback
   * @return {Function}
   */
  _writePackage(name: string, json: Package, callback: Callback) {
    const storage: any = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return callback();
    }
    storage.savePackage(name, this._setDefaultRevision(json), callback);
  }

  _setDefaultRevision(json: Package) {
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

  _deleteAttachments(storage: any, attachments: string[], callback: Callback): void {
    const unlinkNext = function(cb) {
      if (_.isEmpty(attachments)) {
        return cb();
      }

      const attachment = attachments.shift();
      storage.deletePackage(attachment, function() {
        unlinkNext(cb);
      });
    };

    unlinkNext(function() {
      // try to unlink the directory, but ignore errors because it can fail
      storage.removePackage(function(err) {
        callback(err);
      });
    });
  }

  /**
   * Ensure the dist file remains as the same protocol
   * @param {Object} hash metadata
   * @param {String} upLinkKey registry key
   * @private
   */
  _updateUplinkToRemoteProtocol(hash: DistFile, upLinkKey: string): void {
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

  async getSecret(config: Config) {
    const secretKey = await this.localData.getSecret();

    return this.localData.setSecret(config.checkSecretKey(secretKey));
  }

  _loadStorage(config: Config, logger: Logger): ILocalData {
    const Storage = this._loadStorePlugin();

    if (_.isNil(Storage)) {
      assert(this.config.storage, 'CONFIG: storage path not defined');
      return new LocalDatabase(this.config, logger);
    } else {
      return Storage;
    }
  }

  _loadStorePlugin(): ILocalData {
    const plugin_params = {
      config: this.config,
      logger: this.logger,
    };

    return _.head(
      loadPlugin(this.config, this.config.store, plugin_params, plugin => {
        return plugin.getPackageStorage;
      })
    );
  }
}

export default LocalStorage;
