/* eslint prefer-rest-params: "off" */
/* eslint prefer-spread: "off" */
'use strict';

const assert = require('assert');
const Crypto = require('crypto');
const fs = require('fs');
const Path = require('path');
const Stream = require('stream');
const URL = require('url');
const async = require('async');
const _ = require('lodash');

const fsStorage = require('./local-fs');
const LocalData = require('./local-data');
const customStream = require('@verdaccio/streams');

const pkgFileName = 'package.json';
const fileExist = 'EEXISTS';
const noSuchFile = 'ENOENT';
const resourceNotAvailable = 'EAGAIN';

const generatePackageTemplate = function(name) {
  return {
    // standard things
    'name': name,
    'versions': {},
    'dist-tags': {},
    'time': {},

    // our own object
    '_distfiles': {},
    '_attachments': {},
    '_uplinks': {},
  };
};

/**
 * Implements Storage interface (same for storage.js, local-storage.js, up-storage.js).
 */
class LocalStorage {
  /**
   * Constructor
   * @param {Object} config config list of properties
   * @param {Object} logger reference
   * @param {Object} utils package utilities
   */
  constructor(config, logger, utils) {
    this.config = config;
    this.utils = utils;
    this.localList = new LocalData(this._buildStoragePath(this.config));
    this.localList.on('data', (data) => {
      if (_.isNil(data) === false) {
        data.secret = this.config.checkSecretKey(data.secret);
      }
    });
    this.logger = logger.child({sub: 'fs'});
  }

  /**
   * Build the local database path.
   * @param {Object} config
   * @return {string|String|*}
   * @private
   */
  _buildStoragePath(config) {
    // FUTURE: the database might be parameterizable from config.yaml
    return Path.join(Path.resolve(Path.dirname(config.self_path || ''),
      config.storage,
      '.sinopia-db.json'
    ));
  }


  /**
   * Add a package.
   * @param {*} name
   * @param {*} info
   * @param {*} callback
   * @return {Function}
   */
  addPackage(name, info, callback) {
    const storage = this._getLocalStorage(name);

    if (!storage) {
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
  removePackage(name, callback) {
    this.logger.info( {name: name}, 'unpublishing @{name} (all)');

    let storage = this._getLocalStorage(name);
    if (!storage) {
      return callback( this.utils.ErrorCode.get404());
    }

    storage.readJSON(pkgFileName, (err, data) => {
      if (err) {
        if (err.code === noSuchFile) {
          return callback( this.utils.ErrorCode.get404());
        } else {
          return callback(err);
        }
      }
      this._normalizePackage(data);

      let removeFailed = this.localList.remove(name);
      if (removeFailed) {
        // This will happen when database is locked
        return callback(this.utils.ErrorCode.get422(removeFailed.message));
      }

      storage.unlink(pkgFileName, function(err) {
        if (err) {
          return callback(err);
        }

        const files = Object.keys(data._attachments);

        const unlinkNext = function(cb) {
          if (files.length === 0) {
            return cb();
          }

          let file = files.shift();
          storage.unlink(file, function() {
            unlinkNext(cb);
          });
        };

        unlinkNext(function() {
          // try to unlink the directory, but ignore errors because it can fail
          storage.rmdir('.', function(err) {
            callback(err);
          });
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
  updateVersions(name, packageInfo, callback) {
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
            let filename = URL.parse(version.dist.tarball).pathname.replace(/^.*\//, '');
            // we do NOT overwrite any existing records
            if (_.isNil(packageLocalJson._distfiles[filename])) {
              let hash = packageLocalJson._distfiles[filename] = {
                url: version.dist.tarball,
                sha: version.dist.shasum,
              };

              const upLink = version[Symbol.for('__verdaccio_uplink')];

              if (_.isNil(upLink) === false) {
                hash = this._updateUplinkToRemoteProtocol(hash, upLink);
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
   * @param {String} upLink registry key
   * @private
   */
  _updateUplinkToRemoteProtocol(hash, upLink) {
    // if we got this information from a known registry,
    // use the same protocol for the tarball
    //
    // see https://github.com/rlidwka/sinopia/issues/166
    const tarballUrl = URL.parse(hash.url);
    const uplinkUrl = URL.parse(this.config.uplinks[upLink].url);

    if (uplinkUrl.host === tarballUrl.host) {
      tarballUrl.protocol = uplinkUrl.protocol;
      hash.registry = upLink;
      hash.url = URL.format(tarballUrl);
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
  addVersion(name, version, metadata, tag, callback) {
    this._updatePackage(name, (data, cb) => {
      // keep only one readme per package
      data.readme = metadata.readme;
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

      let addFailed = this.localList.add(name);
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
  mergeTags(name, tags, callback) {
    this._updatePackage(name, (data, cb) => {
      for (let t in tags) {
        if (tags[t] === null) {
          delete data['dist-tags'][t];
          continue;
        }
        // be careful here with == (cast)
        if (_.isNil(data.versions[tags[t]])) {
          return cb( this._getVersionNotFound() );
        }

        this.utils.tag_version(data, tags[t], t);
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
   * Replace the complete list of tags for a local package.
   * @param {*} name
   * @param {*} tags
   * @param {*} callback
   */
  replaceTags(name, tags, callback) {
    this._updatePackage(name, (data, cb) => {
      data['dist-tags'] = {};

      for (let t in tags) {
        if (_.isNull(tags[t])) {
          delete data['dist-tags'][t];
          continue;
        }

        if (_.isNil(data.versions[tags[t]])) {
          return cb( this._getVersionNotFound() );
        }

        this.utils.tag_version(data, tags[t], t);
      }
      cb();
    }, callback);
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
  changePackage(name, metadata, revision, callback) {
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
  removeTarball(name, filename, revision, callback) {
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
        storage.unlink(filename, callback);
      }
    });
  }

  /**
   * Add a tarball.
   * @param {String} name
   * @param {String} filename
   * @return {Stream}
   */
  addTarball(name, filename) {
    assert(this.utils.validate_name(filename));

    let length = 0;
    const shaOneHash = Crypto.createHash('sha1');
    const uploadStream = new customStream.UploadTarball();
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
      process.nextTick(function() {
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
  getTarball(name, filename) {
    assert(this.utils.validate_name(filename));

    const storage = this._getLocalStorage(name);

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
    const stream = new customStream.ReadTarball();

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
  _streamSuccessReadTarBall(storage, filename) {
    const stream = new customStream.ReadTarball();
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
   * @param {*} options
   * @param {*} callback
   * @return {Function}
   */
  getPackageMetadata(name, options, callback) {
    if (_.isFunction(options)) {
      callback = options || {};
    }

    const storage = this._getLocalStorage(name);
    if (_.isNil(storage)) {
      return callback( this.utils.ErrorCode.get404() );
    }

    this.readJSON(storage, callback);
  }

  /**
   * Read a json file from storage.
   * @param {Object} storage
   * @param {Function} callback
   */
  readJSON(storage, callback) {
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
     * Search a local package.
     * @param {*} startKey
     * @param {*} options
     * @return {Function}
     */
    search(startKey, options) {
      const stream = new Stream.PassThrough({objectMode: true});

      this._eachPackage((item, cb) => {
        fs.stat(item.path, (err, stats) => {
          if (err) {
            return cb(err);
          }

          if (stats.mtime > startKey) {
            this.getPackageMetadata(item.name, options, (err, data) => {
              if (err) {
                return cb(err);
              }

              const versions = this.utils.semver_sort(Object.keys(data.versions));
              const latest = data['dist-tags'] && data['dist-tags'].latest ? data['dist-tags'].latest : versions.pop();

              if (data.versions[latest]) {
                const version = data.versions[latest];
                stream.push({
                  'name': version.name,
                  'description': version.description,
                  'dist-tags': {latest: latest},
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
                 });
              }

              cb();
            });
          } else {
            cb();
          }
        });
      }, function on_end(err) {
        if (err) return stream.emit('error', err);
        stream.end();
      });

      return stream;
    }

    /**
     * Retrieve a wrapper that provide access to the package location.
     * @param {Object} packageInfo package name.
     * @return {Object}
     */
     _getLocalStorage(packageInfo) {
      const path = this.__getLocalStoragePath(this.config.getMatchedPackagesSpec(packageInfo).storage);

      if (_.isNil(path) || path === false) {
        this.logger.debug( {name: packageInfo}, 'this package has no storage defined: @{name}' );
        return null;
      }

      return new PathWrapper(
        Path.join(
          Path.resolve(Path.dirname(this.config.self_path || ''), path),
          packageInfo
        )
      );
    }

  /**
   * Verify the right local storage location.
   * @param {String} path
   * @return {String}
   * @private
   */
    __getLocalStoragePath(path) {
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
    _eachPackage(onPackage, on_end) {
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
    _normalizePackage(pkg) {
      const pkgProperties = ['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks', 'time'];

      pkgProperties.forEach((key) => {
        if (!this.utils.is_object(pkg[key])) {
          pkg[key] = {};
        }
      });

      if (_.isString(pkg._rev) === false) {
        pkg._rev = '0-0000000000000000';
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
    _readCreatePackage(name, callback) {
      const storage = this._getLocalStorage(name);
      if (!storage) {
        const data = generatePackageTemplate(name);
        this._normalizePackage(data);
        return callback(null, data);
      }
      storage.readJSON(pkgFileName, (err, data) => {
        // TODO: race condition
        if (err) {
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

    /**
     * Handle internal error
     * @param {*} err
     * @param {*} file
     * @param {*} message
     * @return {Object} Error instance
     */
    _internalError(err, file, message) {
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
    _updatePackage(name, updateFn, _callback) {
      const storage = this._getLocalStorage(name);
      if (!storage) {
        return _callback( this.utils.ErrorCode.get404() );
      }
      storage.lockAndReadJSON(pkgFileName, (err, json) => {
        let locked = false;

        // callback that cleans up lock first
        const callback = function(err) {
          let _args = arguments;
          if (locked) {
            storage.unlock_file(pkgFileName, function() {
              // ignore any error from the unlock
              _callback.apply(err, _args);
            });
          } else {
            _callback.apply(null, _args);
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
    _writePackage(name, json, callback) {
      // calculate revision a la couchdb
      if (typeof(json._rev) !== 'string') {
        json._rev = '0-0000000000000000';
      }
      const rev = json._rev.split('-');
      json._rev = ((+rev[0] || 0) + 1) + '-' + Crypto.pseudoRandomBytes(8).toString('hex');

      let storage = this._getLocalStorage(name);
      if (!storage) {
        return callback();
      }
      storage.writeJSON(pkgFileName, json, callback);
    }
}

const PathWrapper = (function() {
  /**
   * A wrapper adding paths to fs_storage methods.
   */
  class Wrapper {

    /**
     * @param {*} path
     */
    constructor(path) {
      this.path = path;
    }
  }

  const wrapLocalStorageMethods = function(method) {
    return function() {
      let args = Array.prototype.slice.apply(arguments);
      /* eslint no-invalid-this: off */
      args[0] = Path.join(this.path, args[0] || '');
      return fsStorage[method].apply(null, args);
    };
  };

  for (let i in fsStorage) {
    if (fsStorage.hasOwnProperty(i)) {
      Wrapper.prototype[i] = wrapLocalStorageMethods(i);
    }
  }

  return Wrapper;
})();

module.exports = LocalStorage;
