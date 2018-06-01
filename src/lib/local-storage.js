// @flow

/* eslint prefer-rest-params: 0 */

import assert from 'assert';
import fs from 'fs';
import Path from 'path';
import UrlNode from 'url';
import _ from 'lodash';
// $FlowFixMe
import async from 'async';
import {ErrorCode, isObject, getLatestVersion, tagVersion, validate_name, semverSort, DIST_TAGS} from './utils';
import {
  generatePackageTemplate, normalizePackage, generateRevision, getLatestReadme, cleanUpReadme,
fileExist, noSuchFile, DEFAULT_REVISION, pkgFileName,
} from './storage-utils';
import {createTarballHash} from './crypto-utils';
import {loadPlugin} from '../lib/plugin-loader';
import LocalDatabase from '@verdaccio/local-storage';
import {UploadTarball, ReadTarball} from '@verdaccio/streams';
import type {
Package,
Config,
MergeTags,
Version,
DistFile,
Callback,
Logger,
} from '@verdaccio/types';
import type {
ILocalData,
IPackageStorage,
} from '@verdaccio/local-storage';
import type {
IUploadTarball,
IReadTarball,
} from '@verdaccio/streams';
import type {IStorage, StringValue} from '../../types';

/**
 * Implements Storage interface (same for storage.js, local-storage.js, up-storage.js).
 */
class LocalStorage implements IStorage {
  config: Config;
  localData: ILocalData;
  logger: Logger;

  constructor(config: Config, logger: Logger) {
    this.logger = logger.child({sub: 'fs'});
    this.config = config;
    this.localData = this._loadStorage(config, logger);
  }

  addPackage(name: string, pkg: Package, callback: Callback) {
    const storage: any = this._getLocalStorage(name);

    if (_.isNil(storage)) {
      return callback( ErrorCode.get404('this package cannot be added'));
    }

    storage.createPackage(name, generatePackageTemplate(name), (err) => {
      if (_.isNull(err) === false && err.code === fileExist) {
        return callback( ErrorCode.get409());
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
      return callback( ErrorCode.get404());
    }

    storage.readPackage(name, (err, data) => {
      if (_.isNil(err) === false) {
        if (err.code === noSuchFile) {
          return callback( ErrorCode.get404());
        } else {
          return callback(err);
        }
      }

      data = normalizePackage(data);

      this.localData.remove(name, (removeFailed) => {
        if (removeFailed) {
          // This will happen when database is locked
          return callback(ErrorCode.get422(removeFailed.message));
        }

        storage.deletePackage(pkgFileName, (err) => {
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

          // we don't keep readmes for package versions,
          // only one readme per package
          version = cleanUpReadme(version);

          change = true;
          packageLocalJson.versions[versionId] = version;

          if (version.dist && version.dist.tarball) {
            const urlObject: any = UrlNode.parse(version.dist.tarball);
            const filename = urlObject.pathname.replace(/^.*\//, '');

            // we do NOT overwrite any existing records
            if (_.isNil(packageLocalJson._distfiles[filename])) {
              let hash: DistFile = packageLocalJson._distfiles[filename] = {
                url: version.dist.tarball,
                sha: version.dist.shasum,
              };
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
          const need_change = !isObject(packageLocalJson._uplinks[up])
            || packageInfo._uplinks[up].etag !== packageLocalJson._uplinks[up].etag
            || packageInfo._uplinks[up].fetched !== packageLocalJson._uplinks[up].fetched;

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
        this.logger.debug({name}, 'updating package @{name} info');
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
  addVersion(name: string,
             version: string,
             metadata: Version,
             tag: StringValue,
             callback: Callback) {
    this._updatePackage(name, (data, cb) => {
      // keep only one readme per package
      data.readme = metadata.readme;

      // TODO: lodash remove
      metadata = cleanUpReadme(metadata);

      if (data.versions[version] != null) {
        return cb( ErrorCode.get409() );
      }

      // if uploaded tarball has a different shasum, it's very likely that we have some kind of error
      if (isObject(metadata.dist) && _.isString(metadata.dist.tarball)) {
        let tarball = metadata.dist.tarball.replace(/.*\//, '');

        if (isObject(data._attachments[tarball])) {
          if (_.isNil(data._attachments[tarball].shasum) === false && _.isNil(metadata.dist.shasum) === false) {
            if (data._attachments[tarball].shasum != metadata.dist.shasum) {
              const errorMessage = `shasum error, ${data._attachments[tarball].shasum} != ${metadata.dist.shasum}`;
              return cb( ErrorCode.get400(errorMessage) );
            }
          }

          let currentDate = new Date().toISOString();
          data.time['modified'] = currentDate;

          if (('created' in data.time) === false) {
            data.time.created = currentDate;
          }

          data.time[version] = currentDate;
          data._attachments[tarball].version = version;
        }
      }

      data.versions[version] = metadata;
      tagVersion(data, version, tag);

      this.localData.add(name, (addFailed) => {
        if (addFailed) {
          return cb(ErrorCode.get422(addFailed.message));
        }

        cb();
      });
    }, callback);
  }

  /**
   * Merge a new list of tags for a local packages with the existing one.
   * @param {*} name
   * @param {*} tags
   * @param {*} callback
   */
  mergeTags(name: string, tags: MergeTags, callback: Callback) {
    this._updatePackage(name, (data, cb) => {
      /* eslint guard-for-in: 0 */
      for (let tag: string in tags) {
        // this handle dist-tag rm command
        if (_.isNull(tags[tag])) {
          delete data[DIST_TAGS][tag];
          continue;
        }

        if (_.isNil(data.versions[tags[tag]])) {
          return cb( this._getVersionNotFound() );
        }
        const version: string = tags[tag];
        tagVersion(data, version, tag);
      }
      cb();
    }, callback);
  }

  /**
   * Return version not found
   * @return {String}
   * @private
   */
  _getVersionNotFound() {
    return ErrorCode.get404('this version doesn\'t exist');
  }

  /**
   * Return file no available
   * @return {String}
   * @private
   */
  _getFileNotAvailable() {
    return ErrorCode.get404('no such file available');
  }

  /**
   * Update the package metadata, tags and attachments (tarballs).
   * Note: Currently supports unpublishing only.
   * @param {*} name
   * @param {*} pkg
   * @param {*} revision
   * @param {*} callback
   * @return {Function}
   */
  changePackage(name: string,
                pkg: Package,
                revision?: string, callback: Callback) {
    if (!isObject(pkg.versions) || !isObject(pkg[DIST_TAGS])) {
      return callback( ErrorCode.get422());
    }

    this._updatePackage(name, (jsonData, cb) => {
      for (let ver in jsonData.versions) {
        if (_.isNil(pkg.versions[ver])) {
          this.logger.info( {name: name, version: ver}, 'unpublishing @{name}@@{version}');

          delete jsonData.versions[ver];

          for (let file in jsonData._attachments) {
            if (jsonData._attachments[file].version === ver) {
              delete jsonData._attachments[file].version;
            }
          }
        }
      }

      jsonData[DIST_TAGS] = pkg[DIST_TAGS];
      cb();
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  }
  /**
   * Remove a tarball.
   * @param {*} name
   * @param {*} filename
   * @param {*} revision
   * @param {*} callback
   */
  removeTarball(name: string, filename: string,
                revision: string, callback: Callback) {
    assert(validate_name(filename));

    this._updatePackage(name, (data, cb) => {
      if (data._attachments[filename]) {
        delete data._attachments[filename];
        cb();
      } else {
        cb(this._getFileNotAvailable());
      }
    }, (err) => {
      if (err) {
        return callback(err);
      }
      const storage = this._getLocalStorage(name);

      if (storage) {
        storage.deletePackage(filename, callback);
      }
    });
  }

  /**
   * Add a tarball.
   * @param {String} name
   * @param {String} filename
   * @return {Stream}
   */
  addTarball(name: string, filename: string) {
    assert(validate_name(filename));

    let length = 0;
    const shaOneHash = createTarballHash();
    const uploadStream: IUploadTarball = new UploadTarball();
    const _transform = uploadStream._transform;
    const storage = this._getLocalStorage(name);

    uploadStream.abort = function() {};
    uploadStream.done = function() {};

    uploadStream._transform = function(data) {
      shaOneHash.update(data);
      // measure the length for validation reasons
      length += data.length;
      _transform.apply(uploadStream, arguments);
    };

    if (name === pkgFileName || name === '__proto__') {
      process.nextTick(() => {
        uploadStream.emit('error', ErrorCode.get403());
      });
      return uploadStream;
    }

    if (!storage) {
      process.nextTick(() => {
        uploadStream.emit('error', ('can\'t upload this package'));
      });
      return uploadStream;
    }

    const writeStream: IUploadTarball = storage.writeTarball(filename);

    writeStream.on('error', (err) => {
      if (err.code === fileExist) {
        uploadStream.emit('error', ErrorCode.get409());
      } else if (err.code === noSuchFile) {
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
      this._updatePackage(name, function updater(data, cb) {
        data._attachments[filename] = {
          shasum: shaOneHash.digest('hex'),
        };
        cb();
      }, function(err) {
        if (err) {
          uploadStream.emit('error', err);
        } else {
          uploadStream.emit('success');
        }
      });
    });

    uploadStream.abort = function() {
      writeStream.abort();
    };

    uploadStream.done = function() {
      if (!length) {
        uploadStream.emit('error', ErrorCode.get422('refusing to accept zero-length file'));
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
    assert(validate_name(filename));

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
    const e404 = ErrorCode.get404;

    stream.abort = function() {
      if (_.isNil(readTarballStream) === false) {
        readTarballStream.abort();
      }
    };

    readTarballStream.on('error', function(err) {
      if (err && err.code === noSuchFile) {
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
      return callback( ErrorCode.get404() );
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
    const stream = new UploadTarball({objectMode: true});

    this._eachPackage((item, cb) => {
      fs.stat(item.path, (err, stats) => {
        if (_.isNil(err) === false) {
          return cb(err);
        }

        if (stats.mtime.getTime() > parseInt(startKey, 10)) {
          this.getPackageMetadata(item.name, (err: Error, data: Package) => {
            if (err) {
              return cb(err);
            }

            const listVersions: Array<string> = Object.keys(data.versions);
            const versions: Array<string> = semverSort(listVersions);
            const latest: string = data[DIST_TAGS] && data[DIST_TAGS].latest ? data[DIST_TAGS].latest : versions.pop();

            if (data.versions[latest]) {
              const version: Version = data.versions[latest];
              const pkg: any = {
                name: version.name,
                description: version.description,
                'dist-tags': {latest},
                maintainers: version.maintainers || [version.author].filter(Boolean),
                author: version.author,
                repository: version.repository,
                readmeFilename: version.readmeFilename || '',
                homepage: version.homepage,
                keywords: version.keywords,
                bugs: version.bugs,
                license: version.license,
                time: {
                  modified: item.time ? new Date(item.time).toISOString() : stats.mtime,
                },
                versions: {[latest]: 'latest'},
              };

              stream.push(pkg);
            }

            cb();
          });
        } else {
          cb();
        }
      });
    }, function onEnd(err) {
      if (err) {
        return stream.emit('error', err);
      }
      stream.end();
    });

    return stream;
  }

  /**
   * Retrieve a wrapper that provide access to the package location.
   * @param {Object} packageInfo package name.
   * @return {Object}
   */
  _getLocalStorage(packageInfo: string): IPackageStorage {
    return this.localData.getPackageStorage(packageInfo);
  }

  /**
   * Read a json file from storage.
   * @param {Object} storage
   * @param {Function} callback
   */
  _readPackage(name: string, storage: any, callback: Callback) {
    storage.readPackage(name, (err, result) => {
      if (err) {
        if (err.code === noSuchFile) {
          return callback( ErrorCode.get404() );
        } else {
          return callback(this._internalError(err, pkgFileName, 'error reading'));
        }
      }

      callback(err, normalizePackage(result));
    });
  }

  /**
   * Walks through each package and calls `on_package` on them.
   * @param {*} onPackage
   * @param {*} onEnd
   */
  _eachPackage(onPackage: Callback, onEnd: Callback) {
    const storages = {};

    storages[this.config.storage] = true;
    if (this.config.packages) {
      Object.keys(this.config.packages || {}).map( (pkg) => {
        if (this.config.packages[pkg].storage) {
          storages[this.config.packages[pkg].storage] = true;
        }
      });
    }
    const base = Path.dirname(this.config.self_path);

    async.eachSeries(Object.keys(storages), function(storage, cb) {
      fs.readdir(Path.resolve(base, storage), function(err, files) {
        if (err) {
          return cb(err);
        }

        async.eachSeries(files, function(file, cb) {
          if (file.match(/^@/)) {
            // scoped
            fs.readdir(Path.resolve(base, storage, file), function(err, files) {
              if (err) {
                return cb(err);
              }

              async.eachSeries(files, (file2, cb) => {
                if (validate_name(file2)) {
                  onPackage({
                    name: `${file}/${file2}`,
                    path: Path.resolve(base, storage, file, file2),
                  }, cb);
                } else {
                  cb();
                }
              }, cb);
            });
          } else if (validate_name(file)) {
            onPackage({
              name: file,
              path: Path.resolve(base, storage, file),
            }, cb);
          } else {
            cb();
          }
        }, cb);
      });
    }, onEnd);
  }

  /**
   * Retrieve either a previous created local package or a boilerplate.
   * @param {*} name
   * @param {*} callback
   * @return {Function}
   */
  _readCreatePackage(name: string, callback: Callback) {
    const storage: any = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return this._createNewPackage(name, callback);
    }

    storage.readPackage(name, (err, data) => {
      // TODO: race condition
      if (_.isNil(err) === false) {
        if (err.code === noSuchFile) {
          data = generatePackageTemplate(name);
        } else {
          return callback(this._internalError(err, pkgFileName, 'error reading'));
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
    this.logger.error( {err: err, file: file}, `${message}  @{file}: @{!err.message}` );

    return ErrorCode.get500();
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
      return callback( ErrorCode.get404() );
    }

    storage.updatePackage(name, updateHandler, this._writePackage.bind(this), normalizePackage,
      callback);
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
    // calculate revision a la couchdb
    if (_.isString(json._rev) === false) {
      json._rev = DEFAULT_REVISION;
    }

    json._rev = generateRevision(json._rev);

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

  _loadStorage(config: Config, logger: Logger) {
    const Storage = this._loadStorePlugin();

    if (_.isNil(Storage)) {
      assert(this.config.storage, 'CONFIG: storage path not defined');
      return new LocalDatabase(this.config, logger);
    } else {
      return Storage;
    }
  }

  _loadStorePlugin() {
    const plugin_params = {
      config: this.config,
      logger: this.logger,
    };

    return _.head(loadPlugin(this.config, this.config.store, plugin_params, function(plugin) {
      return plugin.getPackageStorage;
    }));
  }
}

export default LocalStorage;
