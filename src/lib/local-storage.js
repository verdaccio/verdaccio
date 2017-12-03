// @flow

/* eslint prefer-rest-params: 0 */

import assert from 'assert';
import Crypto from 'crypto';
import fs from 'fs';
import Path from 'path';
import Stream from 'stream';
import UrlNode from 'url';
import _ from 'lodash';
// $FlowFixMe
import async from 'async';

import LocalDatabase from '@verdaccio/local-storage';
import {UploadTarball, ReadTarball} from '@verdaccio/streams';
import type {
  IStorage,
  Package,
  Config,
  MergeTags,
  Version,
  DistFile,
  Callback,
  Logger,
  Utils,
} from '@verdaccio/types';
import type {
  ILocalFS,
  ILocalData,
} from '@verdaccio/local-storage';

const pkgFileName = 'package.json';
const fileExist = 'EEXISTS';
const noSuchFile = 'ENOENT';
const resourceNotAvailable = 'EAGAIN';

const generatePackageTemplate = function(name: string): Package {
  return {
    // standard things
    'name': name,
    'versions': {},
    'dist-tags': {},
    'time': {},
    '_distfiles': {},
    '_attachments': {},
    '_uplinks': {},
  };
};

const DEFAULT_REVISION: string = `0-0000000000000000`;

/**
 * Implements Storage interface (same for storage.js, local-storage.js, up-storage.js).
 */
class Storage implements IStorage {

  config: Config;
  utils: Utils;
  localData: ILocalData;
  logger: Logger;

  constructor(config: Config, logger: Logger, utils: Utils) {
    this.localData = new LocalDatabase(config, logger);
    this.logger = logger.child({sub: 'fs'});
    this.config = config;
    this.utils = utils;
  }

  addPackage(name: string, info: Package, callback: Callback) {
    const storage: ILocalFS = this._getLocalStorage(name);

    if (_.isNil(storage)) {
      return callback( this.utils.ErrorCode.get404('this package cannot be added'));
    }

    storage.createJSON(pkgFileName, generatePackageTemplate(name), (err) => {
      if (err && err.code === fileExist) {
        return callback( this.utils.ErrorCode.get409());
      }

      const latest = this.utils.getLatestVersion(info);

      if (_.isNil(latest) === false && info.versions[latest]) {
        return callback(null, info.versions[latest]);
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
    let storage: ILocalFS = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return callback( this.utils.ErrorCode.get404());
    }

    storage.readJSON(pkgFileName, (err, data) => {
      if (_.isNil(err) === false) {
        if (err.code === noSuchFile) {
          return callback( this.utils.ErrorCode.get404());
        } else {
          return callback(err);
        }
      }
      this._normalizePackage(data);

      let removeFailed = this.localData.remove(name);

      if (removeFailed) {
        // This will happen when database is locked
        return callback(this.utils.ErrorCode.get422(removeFailed.message));
      }

      storage.deleteJSON(pkgFileName, (err) => {
        if (err) {
          return callback(err);
        }
        const attachments = Object.keys(data._attachments);

        this._deleteAttachments(storage, attachments, callback);
      });
    });
  }

  _deleteAttachments(storage: ILocalFS, attachments: string[], callback: Callback): void {
    const unlinkNext = function(cb) {
      if (_.isEmpty(attachments)) {
        return cb();
      }

      const attachment = attachments.shift();
      storage.deleteJSON(attachment, function() {
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
      for (let versionId in packageInfo.versions) {
        if (_.isNil(packageLocalJson.versions[versionId])) {
          const version = packageInfo.versions[versionId];

          // we don't keep readmes for package versions,
          // only one readme per package
          delete version.readme;

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
              //$FlowFixMe
              const upLink: string = version[Symbol.for('__verdaccio_uplink')];

              if (_.isNil(upLink) === false) {
                this._updateUplinkToRemoteProtocol(hash, upLink);
              }
            }
          }
        }
      }
      for (let tag in packageInfo['dist-tags']) {
        if (!packageLocalJson['dist-tags'][tag] || packageLocalJson['dist-tags'][tag] !== packageInfo['dist-tags'][tag]) {
          change = true;
          packageLocalJson['dist-tags'][tag] = packageInfo['dist-tags'][tag];
        }
      }
      for (let up in packageInfo._uplinks) {
        if (Object.prototype.hasOwnProperty.call(packageInfo._uplinks, up)) {
          const need_change = !this.utils.is_object(packageLocalJson._uplinks[up])
            || packageInfo._uplinks[up].etag !== packageLocalJson._uplinks[up].etag
            || packageInfo._uplinks[up].fetched !== packageLocalJson._uplinks[up].fetched;

          if (need_change) {
            change = true;
            packageLocalJson._uplinks[up] = packageInfo._uplinks[up];
          }
        }
      }

      if (packageInfo.readme !== packageLocalJson.readme) {
        packageLocalJson.readme = packageInfo.readme;
        change = true;
      }

      if ('time' in packageInfo) {
        packageLocalJson.time = packageInfo.time;
        change = true;
      }

      if (change) {
        this.logger.debug('updating package info');
        this._writePackage(name, packageLocalJson, function(err) {
          callback(err, packageLocalJson);
        });
      } else {
        callback(null, packageLocalJson);
      }
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

  /**
   * Add a new version to a previous local package.
   * @param {*} name
   * @param {*} version
   * @param {*} metadata
   * @param {*} tag
   * @param {*} callback
   */
  addVersion(name: string, version: string, metadata: Version,
             tag: string,
             callback: Callback) {
    this._updatePackage(name, (data, cb) => {
      // keep only one readme per package
      data.readme = metadata.readme;

      // TODO: lodash remove
      delete metadata.readme;

      if (data.versions[version] != null) {
        return cb( this.utils.ErrorCode.get409() );
      }

      // if uploaded tarball has a different shasum, it's very likely that we have some kind of error
      if (this.utils.is_object(metadata.dist) && _.isString(metadata.dist.tarball)) {
        let tarball = metadata.dist.tarball.replace(/.*\//, '');

        if (this.utils.is_object(data._attachments[tarball])) {

          if (_.isNil(data._attachments[tarball].shasum) === false && _.isNil(metadata.dist.shasum) === false) {
            if (data._attachments[tarball].shasum != metadata.dist.shasum) {
              const errorMessage = `shasum error, ${data._attachments[tarball].shasum} != ${metadata.dist.shasum}`;
              return cb( this.utils.ErrorCode.get400(errorMessage) );
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
      this.utils.tag_version(data, version, tag);

      let addFailed = this.localData.add(name);
      if (addFailed) {
        return cb(this.utils.ErrorCode.get422(addFailed.message));
      }

      cb();
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
      for (let t: string in tags) {
        if (_.isNull(tags[t])) {
          delete data['dist-tags'][t];
          continue;
        }

        if (_.isNil(data.versions[tags[t]])) {
          return cb( this._getVersionNotFound() );
        }
        const key: string = tags[t];
        this.utils.tag_version(data, key, t);
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
    return this.utils.ErrorCode.get404('this version doesn\'t exist');
  }
  /**
   * Return file no available
   * @return {String}
   * @private
   */
  _getFileNotAvailable() {
    return this.utils.ErrorCode.get404('no such file available');
  }

  /**
   * Update the package metadata, tags and attachments (tarballs).
   * Note: Currently supports unpublishing only.
   * @param {*} name
   * @param {*} metadata
   * @param {*} revision
   * @param {*} callback
   * @return {Function}
   */
  changePackage(name: string,
                metadata: Package,
                revision?: string, callback: Callback) {
    if (!this.utils.is_object(metadata.versions) || !this.utils.is_object(metadata['dist-tags'])) {
      return callback( this.utils.ErrorCode.get422());
    }

    this._updatePackage(name, (data, cb) => {
      for (let ver in data.versions) {
        if (_.isNil(metadata.versions[ver])) {
          this.logger.info( {name: name, version: ver},
            'unpublishing @{name}@@{version}');
          delete data.versions[ver];
          for (let file in data._attachments) {
            if (data._attachments[file].version === ver) {
              delete data._attachments[file].version;
            }
          }
        }
      }
      data['dist-tags'] = metadata['dist-tags'];
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
    assert(this.utils.validate_name(filename));

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
        storage.deleteJSON(filename, callback);
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
    assert(this.utils.validate_name(filename));

    let length = 0;
    const shaOneHash = Crypto.createHash('sha1');
    const uploadStream = new UploadTarball();
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
        uploadStream.emit('error', this.utils.ErrorCode.get403());
      });
      return uploadStream;
    }

    if (!storage) {
      process.nextTick(() => {
        uploadStream.emit('error', ('can\'t upload this package'));
      });
      return uploadStream;
    }

    const writeStream = storage.createWriteStream(filename);

    writeStream.on('error', (err) => {
      if (err.code === fileExist) {
        uploadStream.emit('error', this.utils.ErrorCode.get409());
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
        uploadStream.emit('error', this.utils.ErrorCode.get422('refusing to accept zero-length file'));
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
  getTarball(name: string, filename: string) {
    assert(this.utils.validate_name(filename));

    const storage: ILocalFS = this._getLocalStorage(name);

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
  _createFailureStreamResponse() {
    const stream = new ReadTarball();

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
  _streamSuccessReadTarBall(storage: ILocalFS, filename: string) {
    const stream = new ReadTarball();
    const readTarballStream = storage.createReadStream(filename);
    const e404 = this.utils.ErrorCode.get404;

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

    const storage = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return callback( this.utils.ErrorCode.get404() );
    }

    this._readJSON(storage, callback);
  }

  /**
   * Search a local package.
   * @param {*} startKey
   * @param {*} options
   * @return {Function}
   */
  search(startKey: string, options: any) {
    const stream = new Stream.PassThrough({objectMode: true});

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
            const versions: Array<string> = this.utils.semver_sort(listVersions);
            const latest: string = data['dist-tags'] && data['dist-tags'].latest ? data['dist-tags'].latest : versions.pop();

            if (data.versions[latest]) {
              const version: Version = data.versions[latest];
              const pkg: any = {
                'name': version.name,
                'description': version.description,
                'dist-tags': {latest},
                'maintainers': version.maintainers || [version.author].filter(Boolean),
                'author': version.author,
                'repository': version.repository,
                'readmeFilename': version.readmeFilename || '',
                'homepage': version.homepage,
                'keywords': version.keywords,
                'bugs': version.bugs,
                'license': version.license,
                'time': {
                  modified: item.time ? new Date(item.time).toISOString() : stats.mtime,
                },
                'versions': {[latest]: 'latest'},
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
  _getLocalStorage(packageInfo: string): any {
    const path = this.__getLocalStoragePath(this.config.getMatchedPackagesSpec(packageInfo).storage);

    if (_.isNil(path) || path === false) {
      this.logger.debug( {name: packageInfo}, 'this package has no storage defined: @{name}' );
      return null;
    }

    return this.localData.getPackageStorage(packageInfo, path);
  }

  /**
   * Read a json file from storage.
   * @param {Object} storage
   * @param {Function} callback
   */
  _readJSON(storage: ILocalFS, callback: Callback) {
    storage.readJSON(pkgFileName, (err, result) => {
      if (err) {
        if (err.code === noSuchFile) {
          return callback( this.utils.ErrorCode.get404() );
        } else {
          return callback(this._internalError(err, pkgFileName, 'error reading'));
        }
      }
      this._normalizePackage(result);
      callback(err, result);
    });
  }

  /**
   * Verify the right local storage location.
   * @param {String} path
   * @return {String}
   * @private
   */
  __getLocalStoragePath(path: string): string {
    if (_.isNil(path)) {
      path = this.config.storage;
    }
    return path;
  }

  /**
   * Walks through each package and calls `on_package` on them.
   * @param {*} onPackage
   * @param {*} on_end
   */
  _eachPackage(onPackage: Callback, on_end: Callback) {
    let storages = {};
    let utils = this.utils;

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
                if (utils.validate_name(file2)) {
                  onPackage({
                    name: `${file}/${file2}`,
                    path: Path.resolve(base, storage, file, file2),
                  }, cb);
                } else {
                  cb();
                }
              }, cb);
            });
          } else if (utils.validate_name(file)) {
            onPackage({
              name: file,
              path: Path.resolve(base, storage, file),
            }, cb);
          } else {
            cb();
          }
        }, cb);
      });
    }, on_end);
  }

  /**
   * Normalise package properties, tags, revision id.
   * @param {Object} pkg package reference.
   */
  _normalizePackage(pkg: Package) {
    const pkgProperties = ['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks', 'time'];

    pkgProperties.forEach((key) => {
      if (_.isNil(this.utils.is_object(pkg[key]))) {
        pkg[key] = {};
      }
    });

    if (_.isString(pkg._rev) === false) {
      pkg._rev = DEFAULT_REVISION;
    }
    // normalize dist-tags
    this.utils.normalize_dist_tags(pkg);


  }

  /**
   * Retrieve either a previous created local package or a boilerplate.
   * @param {*} name
   * @param {*} callback
   * @return {Function}
   */
  _readCreatePackage(name: string, callback: Callback) {
    const storage: ILocalFS = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return this._createNewPackage(name, callback);
    }

    storage.readJSON(pkgFileName, (err, data) => {
      // TODO: race condition
      if (_.isNil(err) === false) {
        if (err.code === noSuchFile) {
          // if package doesn't exist, we create it here
          data = generatePackageTemplate(name);
        } else {
          return callback(this._internalError(err, pkgFileName, 'error reading'));
        }
      }

      this._normalizePackage(data);
      callback(null, data);
    });
  }

  _createNewPackage(name: string, callback: Callback): Callback {
    const data = generatePackageTemplate(name);

    this._normalizePackage(data);
    return callback(null, data);
  }

  /**
   * Handle internal error
   * @param {*} err
   * @param {*} file
   * @param {*} message
   * @return {Object} Error instance
   */
  _internalError(err: string, file: string, message: string) {
    this.logger.error( {err: err, file: file},
      message + ' @{file}: @{!err.message}' );

    return this.utils.ErrorCode.get500();
  }

  /**
   * This function allows to update the package thread-safely
   Algorithm:
   1. lock package.json for writing
   2. read package.json
   3. updateFn(pkg, cb), and wait for cb
   4. write package.json.tmp
   5. move package.json.tmp package.json
   6. callback(err?)
   * @param {*} name package name
   * @param {*} updateFn function(package, cb) - update function
   * @param {*} _callback callback that gets invoked after it's all updated
   * @return {Function}
   */
  _updatePackage(name: string, updateFn: Callback, _callback: Callback) {
    const storage: ILocalFS = this._getLocalStorage(name);

    if (!storage) {
      return _callback( this.utils.ErrorCode.get404() );
    }

    storage.lockAndReadJSON(pkgFileName, (err, json) => {
      let locked = false;

      // callback that cleans up lock first
      const callback = function(err: Error) {
        let _args = arguments;
        if (locked) {
          storage.unlockJSON(pkgFileName, function() {
            // ignore any error from the unlock
            _callback.apply(err, _args);
          });
        } else {
          _callback(..._args);
        }
      };

      if (!err) {
        locked = true;
      }

      if (err) {
        if (err.code === resourceNotAvailable) {
          return callback( this.utils.ErrorCode.get503() );
        } else if (err.code === noSuchFile) {
          return callback( this.utils.ErrorCode.get404() );
        } else {
          return callback(err);
        }
      }

      this._normalizePackage(json);
      updateFn(json, (err) => {
        if (err) {
          return callback(err);
        }
        this._writePackage(name, json, callback);
      });
    });
  }

  /**
   * Update the revision (_rev) string for a package.
   * @param {*} name
   * @param {*} json
   * @param {*} callback
   * @return {Function}
   */
  _writePackage(name: string, json: Package, callback: Callback) {
    // calculate revision a la couchdb
    if (typeof(json._rev) !== 'string') {
      json._rev = DEFAULT_REVISION;
    }

    json._rev = this._generateRevision(json._rev);

    let storage: ILocalFS = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return callback();
    }
    storage.writeJSON(pkgFileName, json, callback);
  }

  _generateRevision(rev: string): string {
    const _rev = rev.split('-');

    return ((+_rev[0] || 0) + 1) + '-' + Crypto.pseudoRandomBytes(8).toString('hex');
  }
}

module.exports = Storage;
