/* eslint prefer-rest-params: "off" */
/* eslint prefer-spread: "off" */
'use strict';

const assert = require('assert');
const Crypto = require('crypto');
const fs = require('fs');
const Path = require('path');
const Stream = require('stream');
const url = require('url');
const async = require('async');
const createError = require('http-errors');
const _ = require('lodash');

const fsStorage = require('./local-fs');
const LocalData = require('./local-data');
const Logger = require('../../logger');
const customStream = require('../streams');
const Utils = require('../../utils');

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
   */
  constructor(config) {
    this.config = config;
    this.localList = new LocalData(this._buildStoragePath(this.config));
    this.logger = Logger.logger.child({sub: 'fs'});
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
    const storage = this.storage(name);

    if (!storage) {
      return callback( createError(404, 'this package cannot be added'));
    }

    storage.createJSON(pkgFileName, generatePackageTemplate(name), function(err) {
      if (err && err.code === fileExist) {
        return callback( createError(409, 'this package is already present'));
      }
      const latest = info['dist-tags'].latest;
      if (latest && info.versions[latest]) {
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

    let storage = this.storage(name);
    if (!storage) {
      return callback( createError(404, 'no such package available'));
    }

    storage.readJSON(pkgFileName, (err, data) => {
      if (err) {
        if (err.code === noSuchFile) {
          return callback( createError(404, 'no such package available'));
        } else {
          return callback(err);
        }
      }
      this._normalizePackage(data);

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
    this.localList.remove(name);
  }

  /**
   * Synchronize remote package info with the local one
   * @param {*} name
   * @param {*} newdata
   * @param {*} callback
   */
  updateVersions(name, newdata, callback) {
    this._readCreatePackage(name, (err, data) => {
      if (err) {
        return callback(err);
      }

      let change = false;
      for (let ver in newdata.versions) {
        if (_.isNil(data.versions[ver])) {
          let verdata = newdata.versions[ver];

          // we don't keep readmes for package versions,
          // only one readme per package
          delete verdata.readme;

          change = true;
          data.versions[ver] = verdata;

          if (verdata.dist && verdata.dist.tarball) {
            let filename = url.parse(verdata.dist.tarball).pathname.replace(/^.*\//, '');
            // we do NOT overwrite any existing records
            if (_.isNil(data._distfiles[filename])) {
              let hash = data._distfiles[filename] = {
                url: verdata.dist.tarball,
                sha: verdata.dist.shasum,
              };
              // if (verdata[Symbol('_verdaccio_uplink')]) {
              if (verdata._verdaccio_uplink) {
                // if we got this information from a known registry,
                // use the same protocol for the tarball
                //
                // see https://github.com/rlidwka/sinopia/issues/166
                const tarball_url = url.parse(hash.url);
                const uplink_url = url.parse(this.config.uplinks[verdata._verdaccio_uplink].url);
                if (uplink_url.host === tarball_url.host) {
                  tarball_url.protocol = uplink_url.protocol;
                  hash.registry = verdata._verdaccio_uplink;
                  hash.url = url.format(tarball_url);
                }
              }
            }
          }
        }
      }
      for (let tag in newdata['dist-tags']) {
        if (!data['dist-tags'][tag] || data['dist-tags'][tag] !== newdata['dist-tags'][tag]) {
          change = true;
          data['dist-tags'][tag] = newdata['dist-tags'][tag];
        }
      }
      for (let up in newdata._uplinks) {
        if (Object.prototype.hasOwnProperty.call(newdata._uplinks, up)) {
          const need_change = !Utils.is_object(data._uplinks[up])
                        || newdata._uplinks[up].etag !== data._uplinks[up].etag
                        || newdata._uplinks[up].fetched !== data._uplinks[up].fetched;

          if (need_change) {
            change = true;
            data._uplinks[up] = newdata._uplinks[up];
          }
        }
      }
      if (newdata.readme !== data.readme) {
        data.readme = newdata.readme;
        change = true;
      }

      if (change) {
        this.logger.debug('updating package info');
        this._writePackage(name, data, function(err) {
          callback(err, data);
        });
      } else {
        callback(null, data);
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
  addVersion(name, version, metadata, tag, callback) {
    this._updatePackage(name, (data, cb) => {
      // keep only one readme per package
      data.readme = metadata.readme;
      delete metadata.readme;

      if (data.versions[version] != null) {
        return cb( createError[409]('this version already present') );
      }

      // if uploaded tarball has a different shasum, it's very likely that we have some kind of error
      if (Utils.is_object(metadata.dist) && typeof(metadata.dist.tarball) === 'string') {
        let tarball = metadata.dist.tarball.replace(/.*\//, '');
        if (Utils.is_object(data._attachments[tarball])) {
          if (data._attachments[tarball].shasum != null && metadata.dist.shasum != null) {
            if (data._attachments[tarball].shasum != metadata.dist.shasum) {
              return cb( createError[400]('shasum error, '
                                  + data._attachments[tarball].shasum
                                  + ' != ' + metadata.dist.shasum) );
            }
          }
          data._attachments[tarball].version = version;
        }
      }

      data.versions[version] = metadata;
      Utils.tag_version(data, version, tag);
      this.localList.add(name);
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
    this._updatePackage(name, function updater(data, cb) {
      for (let t in tags) {
        if (tags[t] === null) {
          delete data['dist-tags'][t];
          continue;
        }
        // be careful here with == (cast)
        if (_.isNil(data.versions[tags[t]])) {
          return cb( createError[404]('this version doesn\'t exist') );
        }

        Utils.tag_version(data, tags[t], t);
      }
      cb();
    }, callback);
  }

 /**
   * Replace the complete list of tags for a local package.
   * @param {*} name
   * @param {*} tags
   * @param {*} callback
   */
  replaceTags(name, tags, callback) {
    this._updatePackage(name, function updater(data, cb) {
      data['dist-tags'] = {};

      for (let t in tags) {
        if (_.isNull(tags[t])) {
          delete data['dist-tags'][t];
          continue;
        }

        if (_.isNil(data.versions[tags[t]])) {
          return cb( createError[404]('this version doesn\'t exist') );
        }

        Utils.tag_version(data, tags[t], t);
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
    if (!Utils.is_object(metadata.versions) || !Utils.is_object(metadata['dist-tags'])) {
      return callback( createError[422]('bad data') );
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
    assert(Utils.validate_name(filename));

    this._updatePackage(name, (data, cb) => {
      if (data._attachments[filename]) {
        delete data._attachments[filename];
        cb();
      } else {
        cb(createError[404]('no such file available'));
      }
    }, (err) => {
      if (err) {
        return callback(err);
      }
      let storage = this.storage(name);
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
    assert(Utils.validate_name(filename));

    let length = 0;
    const shaOneHash = Crypto.createHash('sha1');
    const uploadStream = new customStream.UploadTarball();
    const _transform = uploadStream._transform;
    const storage = this.storage(name);
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
        uploadStream.emit('error', createError[403]('can\'t use this filename'));
      });
      return uploadStream;
    }

    if (!storage) {
      process.nextTick(function() {
        uploadStream.emit('error', createError[404]('can\'t upload this package'));
      });
      return uploadStream;
    }

    const writeStream = storage.createWriteStream(filename);

    writeStream.on('error', (err) => {
      if (err.code === fileExist) {
        uploadStream.emit('error', createError[409]('this tarball is already present'));
      } else if (err.code === noSuchFile) {
        // check if package exists to throw an appropriate message
        this.getPackage(name, function(_err, res) {
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
        uploadStream.emit('error', createError[422]('refusing to accept zero-length file'));
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
   * @param {*} callback
   * @return {Function}
   */
  getTarball(name, filename, callback) {
    assert(Utils.validate_name(filename));
    const stream = new customStream.ReadTarball();
    stream.abort = function() {
      if (rstream) {
        rstream.abort();
      }
    };

    let storage = this.storage(name);
    if (!storage) {
      process.nextTick(function() {
        stream.emit('error', createError[404]('no such file available'));
      });
      return stream;
    }
    /* eslint no-var: "off" */
    var rstream = storage.createReadStream(filename);
    rstream.on('error', function(err) {
      if (err && err.code === noSuchFile) {
        stream.emit('error', createError(404, 'no such file available'));
      } else {
        stream.emit('error', err);
      }
    });
    rstream.on('content-length', function(v) {
      stream.emit('content-length', v);
    });
    rstream.on('open', function() {
      // re-emitting open because it's handled in storage.js
      stream.emit('open');
      rstream.pipe(stream);
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
  getPackage(name, options, callback) {
    if (_.isFunction(options)) {
      callback = options || {};
    }

    let storage = this.storage(name);
    if (!storage) {
      return callback( createError[404]('no such package available') );
    }

    storage.readJSON(pkgFileName, (err, result) => {
      if (err) {
        if (err.code === noSuchFile) {
          return callback( createError[404]('no such package available') );
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
            this.getPackage(item.name, options, function(err, data) {
              if (err) {
                return cb(err);
              }

              const versions = Utils.semver_sort(Object.keys(data.versions));
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
                    modified: item.time ? new Date(item.time).toISOString() : undefined,
                  },
                  'versions': {},
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
     * @param {*} pkg package name.
     * @return {Object}
     */
    storage(pkg) {
      let path = this.config.getMatchedPackagesSpec(pkg).storage;
      if (_.isNil(path)) {
        path = this.config.storage;
      }
      if (_.isNil(path) || path === false) {
        this.logger.debug( {name: pkg}, 'this package has no storage defined: @{name}' );
        return null;
      }
      return new PathWrapper(
        Path.join(
          Path.resolve(Path.dirname(this.config.self_path || ''), path),
          pkg
        )
      );
    }

    /**
     * Walks through each package and calls `on_package` on them.
     * @param {*} onPackage
     * @param {*} on_end
     */
    _eachPackage(onPackage, on_end) {
      let storages = {};

      storages[this.config.storage] = true;
      if (this.config.packages) {
        Object.keys(this.packages || {}).map( (pkg) => {
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

                async.eachSeries(files, function(file2, cb) {
                  if (Utils.validate_name(file2)) {
                    onPackage({
                      name: `${file}/${file2}`,
                      path: Path.resolve(base, storage, file, file2),
                    }, cb);
                  } else {
                    cb();
                  }
                }, cb);
              });
            } else if (Utils.validate_name(file)) {
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

      // Object.keys(storages).reduce(() => {
      //
      // }, Promise.resolve());
    }

    /**
     * Normalise package properties, tags, revision id.
     * @param {Object} pkg package reference.
     */
    _normalizePackage(pkg) {
      ['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks'].forEach(function(key) {
        if (!Utils.is_object(pkg[key])) {
          pkg[key] = {};
        }
      });
      if (typeof(pkg._rev) !== 'string') {
        pkg._rev = '0-0000000000000000';
      }
      // normalize dist-tags
      Utils.normalize_dist_tags(pkg);
    }

    /**
     * Retrieve either a previous created local package or a boilerplate.
     * @param {*} name
     * @param {*} callback
     * @return {Function}
     */
    _readCreatePackage(name, callback) {
      const storage = this.storage(name);
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
      return createError[500]();
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
      const storage = this.storage(name);
      if (!storage) {
        return _callback( createError[404]('no such package available') );
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
            return callback( createError[503]('resource temporarily unavailable') );
          } else if (err.code === noSuchFile) {
            return callback( createError[404]('no such package available') );
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

      let storage = this.storage(name);
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
