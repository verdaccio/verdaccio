/* eslint prefer-rest-params: "off" */
/* eslint prefer-spread: "off" */
'use strict';

const assert = require('assert');
const async = require('async');
const Crypto = require('crypto');
const fs = require('fs');
const Error = require('http-errors');
const Path = require('path');
const Stream = require('readable-stream');
const URL = require('url');

const fs_storage = require('./local-fs');
const LocalData = require('./local-data');
const Logger = require('./logger');
const Search = require('./search');
const MyStreams = require('./streams');
const Utils = require('./utils');
const info_file = 'package.json';

// returns the minimal package file
const get_boilerplate = function(name) {
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
class Storage {
  /**
   * Constructor
   * @param {Object} config config list of properties
   */
  constructor(config) {
    this.config = config;
    // local data handler is linked with the configuration handler
    this.localList = new LocalData(Path.join(Path.resolve(Path.dirname(config.self_path || ''), config.storage),
      // FUTURE: the database might be parameterizable from config.yaml
      '.sinopia-db.json'
      )
    );
    this.logger = Logger.logger.child({sub: 'fs'});
  }


  /**
   * Add a package.
   * @param {*} name
   * @param {*} info
   * @param {*} callback
   * @return {Function}
   */
  add_package(name, info, callback) {
    let storage = this.storage(name);
    if (!storage) return callback( Error[404]('this package cannot be added') );

    storage.create_json(info_file, get_boilerplate(name), function(err) {
      if (err && err.code === 'EEXISTS') {
        return callback( Error[409]('this package is already present') );
      }

      let latest = info['dist-tags'].latest;
      if (latest && info.versions[latest]) {
        Search.add(info.versions[latest]);
      }
      callback();
    });
  }

  /**
   * Remove package.
   * @param {*} name
   * @param {*} callback
   * @return {Function}
   */
  remove_package(name, callback) {
    this.logger.info( {name: name}
                    , 'unpublishing @{name} (all)');

    let storage = this.storage(name);
    if (!storage) {
      return callback( Error[404]('no such package available') );
    }

    storage.read_json(info_file, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return callback( Error[404]('no such package available') );
        } else {
          return callback(err);
        }
      }
      this._normalize_package(data);

      storage.unlink(info_file, function(err) {
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

    Search.remove(name);
    this.localList.remove(name);
  }

  /**
   * Synchronize remote package info with the local one
   * @param {*} name
   * @param {*} newdata
   * @param {*} callback
   */
  update_versions(name, newdata, callback) {
    this._read_create_package(name, (err, data) => {
      if (err) {
        return callback(err);
      }

      let change = false;
      for (let ver in newdata.versions) {
        if (data.versions[ver] == null) {
          let verdata = newdata.versions[ver];

          // we don't keep readmes for package versions,
          // only one readme per package
          delete verdata.readme;

          change = true;
          data.versions[ver] = verdata;

          if (verdata.dist && verdata.dist.tarball) {
            let filename = URL.parse(verdata.dist.tarball).pathname.replace(/^.*\//, '');
            // we do NOT overwrite any existing records
            if (data._distfiles[filename] == null) {
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
                let tarball_url = URL.parse(hash.url);
                let uplink_url = URL.parse(this.config.uplinks[verdata._verdaccio_uplink].url);
                if (uplink_url.host === tarball_url.host) {
                  tarball_url.protocol = uplink_url.protocol;
                  hash.registry = verdata._verdaccio_uplink;
                  hash.url = URL.format(tarball_url);
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
        this._write_package(name, data, function(err) {
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
  add_version(name, version, metadata, tag, callback) {
    this.update_package(name, (data, cb) => {
      // keep only one readme per package
      data.readme = metadata.readme;
      delete metadata.readme;

      if (data.versions[version] != null) {
        return cb( Error[409]('this version already present') );
      }

      // if uploaded tarball has a different shasum, it's very likely that we have some kind of error
      if (Utils.is_object(metadata.dist) && typeof(metadata.dist.tarball) === 'string') {
        let tarball = metadata.dist.tarball.replace(/.*\//, '');
        if (Utils.is_object(data._attachments[tarball])) {
          if (data._attachments[tarball].shasum != null && metadata.dist.shasum != null) {
            if (data._attachments[tarball].shasum != metadata.dist.shasum) {
              return cb( Error[400]('shasum error, '
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
  merge_tags(name, tags, callback) {
    this.update_package(name, function updater(data, cb) {
      for (let t in tags) {
        if (tags[t] === null) {
          delete data['dist-tags'][t];
          continue;
        }
        // be careful here with == (cast)
        if (data.versions[tags[t]] == null) {
          return cb( Error[404]('this version doesn\'t exist') );
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
  replace_tags(name, tags, callback) {
    this.update_package(name, function updater(data, cb) {
      data['dist-tags'] = {};

      for (let t in tags) {
        if (tags[t] === null) {
          delete data['dist-tags'][t];
          continue;
        }

        if (data.versions[tags[t]] == null) {
          return cb( Error[404]('this version doesn\'t exist') );
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
  change_package(name, metadata, revision, callback) {
    if (!Utils.is_object(metadata.versions) || !Utils.is_object(metadata['dist-tags'])) {
      return callback( Error[422]('bad data') );
    }

    this.update_package(name, (data, cb) => {
      for (let ver in data.versions) {
        if (metadata.versions[ver] == null) {
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
  remove_tarball(name, filename, revision, callback) {
    assert(Utils.validate_name(filename));

    this.update_package(name, (data, cb) => {
      if (data._attachments[filename]) {
        delete data._attachments[filename];
        cb();
      } else {
        cb(Error[404]('no such file available'));
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
   * @return {Function}
   */
  add_tarball(name, filename) {
    assert(Utils.validate_name(filename));

    let stream = MyStreams.uploadTarballStream();
    let _transform = stream._transform;
    let length = 0;
    let shasum = Crypto.createHash('sha1');

    stream.abort = stream.done = function() {};

    stream._transform = function(data) {
      shasum.update(data);
      length += data.length;
      _transform.apply(stream, arguments);
    };

    if (name === info_file || name === '__proto__') {
      process.nextTick(function() {
        stream.emit('error', Error[403]('can\'t use this filename'));
      });
      return stream;
    }

    let storage = this.storage(name);
    if (!storage) {
      process.nextTick(function() {
        stream.emit('error', Error[404]('can\'t upload this package'));
      });
      return stream;
    }

    let wstream = storage.write_stream(filename);

    wstream.on('error', (err) => {
      if (err.code === 'EEXISTS') {
        stream.emit('error', Error[409]('this tarball is already present'));
      } else if (err.code === 'ENOENT') {
        // check if package exists to throw an appropriate message
        this.get_package(name, function(_err, res) {
          if (_err) {
            stream.emit('error', _err);
          } else {
            stream.emit('error', err);
          }
        });
      } else {
        stream.emit('error', err);
      }
    });

    wstream.on('open', function() {
      // re-emitting open because it's handled in storage.js
      stream.emit('open');
    });
    wstream.on('success', () => {
      this.update_package(name, function updater(data, cb) {
        data._attachments[filename] = {
          shasum: shasum.digest('hex'),
        };
        cb();
      }, function(err) {
        if (err) {
          stream.emit('error', err);
        } else {
          stream.emit('success');
        }
      });
    });
    stream.abort = function() {
      wstream.abort();
    };
    stream.done = function() {
      if (!length) {
        stream.emit('error', Error[422]('refusing to accept zero-length file'));
        wstream.abort();
      } else {
        wstream.done();
      }
    };
    stream.pipe(wstream);

    return stream;
  }

  /**
   * Get a tarball.
   * @param {*} name
   * @param {*} filename
   * @param {*} callback
   * @return {Function}
   */
  get_tarball(name, filename, callback) {
    assert(Utils.validate_name(filename));
    const stream = MyStreams.readTarballStream();
    stream.abort = function() {
      if (rstream) {
        rstream.abort();
      }
    };

    let storage = this.storage(name);
    if (!storage) {
      process.nextTick(function() {
        stream.emit('error', Error[404]('no such file available'));
      });
      return stream;
    }
    /* eslint no-var: "off" */
    var rstream = storage.read_stream(filename);
    rstream.on('error', function(err) {
      if (err && err.code === 'ENOENT') {
        stream.emit('error', Error(404, 'no such file available'));
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
  get_package(name, options, callback) {
    if (typeof(options) === 'function') {
      callback = options, options = {};
    }

    let storage = this.storage(name);
    if (!storage) {
      return callback( Error[404]('no such package available') );
    }

    storage.read_json(info_file, (err, result) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return callback( Error[404]('no such package available') );
        } else {
          return callback(this._internal_error(err, info_file, 'error reading'));
        }
      }
      this._normalize_package(result);
      callback(err, result);
    });
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
    update_package(name, updateFn, _callback) {
      const storage = this.storage(name);
      if (!storage) {
        return _callback( Error[404]('no such package available') );
      }
      storage.lock_and_read_json(info_file, (err, json) => {
        let locked = false;

        // callback that cleans up lock first
        const callback = function(err) {
          let _args = arguments;
          if (locked) {
            storage.unlock_file(info_file, function() {
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
          if (err.code === 'EAGAIN') {
            return callback( Error[503]('resource temporarily unavailable') );
          } else if (err.code === 'ENOENT') {
            return callback( Error[404]('no such package available') );
          } else {
            return callback(err);
          }
        }

        this._normalize_package(json);
        updateFn(json, (err) => {
          if (err) {
            return callback(err);
          }
          this._write_package(name, json, callback);
        });
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

      this._each_package((item, cb) => {
        fs.stat(item.path, (err, stats) => {
          if (err) {
            return cb(err);
          }

          if (stats.mtime > startKey) {
            this.get_package(item.name, options, function(err, data) {
              if (err) {
                return cb(err);
              }

              let versions = Utils.semver_sort(Object.keys(data.versions));
              let latest = data['dist-tags'] && data['dist-tags'].latest ? data['dist-tags'].latest : versions.pop();

              if (data.versions[latest]) {
                stream.push({
                  'name': data.versions[latest].name,
                  'description': data.versions[latest].description,
                  'dist-tags': {latest: latest},
                  'maintainers': data.versions[latest].maintainers
                  || [data.versions[latest].author].filter(Boolean),
                  'author': data.versions[latest].author,
                  'repository': data.versions[latest].repository,
                  'readmeFilename': data.versions[latest].readmeFilename || '',
                  'homepage': data.versions[latest].homepage,
                  'keywords': data.versions[latest].keywords,
                  'bugs': data.versions[latest].bugs,
                  'license': data.versions[latest].license,
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
      let path = this.config.get_package_spec(pkg).storage;
      if (path == null) {
        path = this.config.storage;
      }
      if (path == null || path === false) {
        this.logger.debug( {name: pkg}
          , 'this package has no storage defined: @{name}' );
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
     * @param {*} on_package
     * @param {*} on_end
     */
    _each_package(on_package, on_end) {
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
                    on_package({
                      name: `${file}/${file2}`,
                      path: Path.resolve(base, storage, file, file2),
                    }, cb);
                  } else {
                    cb();
                  }
                }, cb);
              });
            } else if (Utils.validate_name(file)) {
              on_package({
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
    _normalize_package(pkg) {
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
    _read_create_package(name, callback) {
      const storage = this.storage(name);
      if (!storage) {
        let data = get_boilerplate(name);
        this._normalize_package(data);
        return callback(null, data);
      }
      storage.read_json(info_file, (err, data) => {
        // TODO: race condition
        if (err) {
          if (err.code === 'ENOENT') {
            // if package doesn't exist, we create it here
            data = get_boilerplate(name);
          } else {
            return callback(this._internal_error(err, info_file, 'error reading'));
          }
        }
        this._normalize_package(data);
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
    _internal_error(err, file, message) {
      this.logger.error( {err: err, file: file},
        message + ' @{file}: @{!err.message}' );
      return Error[500]();
    }

    /**
     * Update the revision (_rev) string for a package.
     * @param {*} name
     * @param {*} json
     * @param {*} callback
     * @return {Function}
     */
    _write_package(name, json, callback) {
      // calculate revision a la couchdb
      if (typeof(json._rev) !== 'string') {
        json._rev = '0-0000000000000000';
      }
      let rev = json._rev.split('-');
      json._rev = ((+rev[0] || 0) + 1) + '-' + Crypto.pseudoRandomBytes(8).toString('hex');

      let storage = this.storage(name);
      if (!storage) {
        return callback();
      }
      storage.write_json(info_file, json, callback);
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
      return fs_storage[method].apply(null, args);
    };
  };

  for (let i in fs_storage) {
    if (fs_storage.hasOwnProperty(i)) {
      Wrapper.prototype[i] = wrapLocalStorageMethods(i);
    }
  }

  return Wrapper;
})();

module.exports = Storage;
