'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _upStorage = require('./up-storage');

var _upStorage2 = _interopRequireDefault(_upStorage);

var _search = require('./search');

var _search2 = _interopRequireDefault(_search);

var _constants = require('./constants');

var _localStorage = require('./local-storage');

var _localStorage2 = _interopRequireDefault(_localStorage);

var _streams = require('@verdaccio/streams');

var _storageUtils = require('./storage-utils');

var _uplinkUtil = require('./uplink-util');

var _metadataUtils = require('./metadata-utils');

var _utils = require('./utils');

var _configUtils = require('./config-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const LoggerApi = require('../lib/logger');

class Storage {

  constructor(config) {
    this.config = config;
    this.uplinks = (0, _uplinkUtil.setupUpLinks)(config);
    this.logger = LoggerApi.logger.child();
  }

  init(config) {
    this.localStorage = new _localStorage2.default(this.config, LoggerApi.logger);

    return this.localStorage.getSecret(config);
  }

  /**
   *  Add a {name} package to a system
   Function checks if package with the same name is available from uplinks.
   If it isn't, we create package locally
   Used storages: local (write) && uplinks
   */
  addPackage(name, metadata, callback) {
    var _this = this;

    return _asyncToGenerator(function* () {
      try {
        yield (0, _storageUtils.checkPackageLocal)(name, _this.localStorage);
        yield (0, _storageUtils.checkPackageRemote)(name, _this._isAllowPublishOffline(), _this._syncUplinksMetadata.bind(_this));
        yield (0, _storageUtils.publishPackage)(name, metadata, _this.localStorage);
        callback();
      } catch (err) {
        callback(err);
      }
    })();
  }

  _isAllowPublishOffline() {
    return typeof this.config.publish !== 'undefined' && _lodash2.default.isBoolean(this.config.publish.allow_offline) && this.config.publish.allow_offline;
  }

  /**
   * Add a new version of package {name} to a system
   Used storages: local (write)
   */
  addVersion(name, version, metadata, tag, callback) {
    this.localStorage.addVersion(name, version, metadata, tag, callback);
  }

  /**
   * Tags a package version with a provided tag
   Used storages: local (write)
   */
  mergeTags(name, tagHash, callback) {
    this.localStorage.mergeTags(name, tagHash, callback);
  }

  /**
   * Change an existing package (i.e. unpublish one version)
   Function changes a package info from local storage and all uplinks with write access./
   Used storages: local (write)
   */
  changePackage(name, metadata, revision, callback) {
    this.localStorage.changePackage(name, metadata, revision, callback);
  }

  /**
   * Remove a package from a system
   Function removes a package from local storage
   Used storages: local (write)
   */
  removePackage(name, callback) {
    this.localStorage.removePackage(name, callback);
    // update the indexer
    _search2.default.remove(name);
  }

  /**
   Remove a tarball from a system
   Function removes a tarball from local storage.
   Tarball in question should not be linked to in any existing
   versions, i.e. package version should be unpublished first.
   Used storage: local (write)
   */
  removeTarball(name, filename, revision, callback) {
    this.localStorage.removeTarball(name, filename, revision, callback);
  }

  /**
   * Upload a tarball for {name} package
   Function is syncronous and returns a WritableStream
   Used storages: local (write)
   */
  addTarball(name, filename) {
    return this.localStorage.addTarball(name, filename);
  }

  /**
   Get a tarball from a storage for {name} package
   Function is syncronous and returns a ReadableStream
   Function tries to read tarball locally, if it fails then it reads package
   information in order to figure out where we can get this tarball from
   Used storages: local || uplink (just one)
   */
  getTarball(name, filename) {
    let readStream = new _streams.ReadTarball();
    readStream.abort = function () {};

    let self = this;

    // if someone requesting tarball, it means that we should already have some
    // information about it, so fetching package info is unnecessary

    // trying local first
    // flow: should be IReadTarball
    let localStream = self.localStorage.getTarball(name, filename);
    let isOpen = false;
    localStream.on('error', err => {
      if (isOpen || err.status !== _constants.HTTP_STATUS.NOT_FOUND) {
        return readStream.emit('error', err);
      }

      // local reported 404
      let err404 = err;
      localStream.abort();
      // $FlowFixMe
      localStream = null; // we force for garbage collector
      self.localStorage.getPackageMetadata(name, (err, info) => {
        if (_lodash2.default.isNil(err) && info._distfiles && _lodash2.default.isNil(info._distfiles[filename]) === false) {
          // information about this file exists locally
          serveFile(info._distfiles[filename]);
        } else {
          // we know nothing about this file, trying to get information elsewhere
          self._syncUplinksMetadata(name, info, {}, (err, info) => {
            if (_lodash2.default.isNil(err) === false) {
              return readStream.emit('error', err);
            }
            if (_lodash2.default.isNil(info._distfiles) || _lodash2.default.isNil(info._distfiles[filename])) {
              return readStream.emit('error', err404);
            }
            serveFile(info._distfiles[filename]);
          });
        }
      });
    });
    localStream.on('content-length', function (v) {
      readStream.emit('content-length', v);
    });
    localStream.on('open', function () {
      isOpen = true;
      localStream.pipe(readStream);
    });
    return readStream;

    /**
     * Fetch and cache local/remote packages.
     * @param {Object} file define the package shape
     */
    function serveFile(file) {
      let uplink = null;

      for (let uplinkId in self.uplinks) {
        // $FlowFixMe
        if (self.uplinks[uplinkId].isUplinkValid(file.url)) {
          uplink = self.uplinks[uplinkId];
        }
      }

      if (uplink == null) {
        uplink = new _upStorage2.default({
          url: file.url,
          cache: true,
          _autogenerated: true
        }, self.config);
      }

      let savestream = null;
      if (uplink.config.cache) {
        savestream = self.localStorage.addTarball(name, filename);
      }

      let on_open = function () {
        // prevent it from being called twice
        on_open = function () {};
        let rstream2 = uplink.fetchTarball(file.url);
        rstream2.on('error', function (err) {
          if (savestream) {
            savestream.abort();
          }
          savestream = null;
          readStream.emit('error', err);
        });
        rstream2.on('end', function () {
          if (savestream) {
            savestream.done();
          }
        });

        rstream2.on('content-length', function (v) {
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
        savestream.on('open', function () {
          on_open();
        });

        savestream.on('error', function (err) {
          self.logger.warn({ err: err, fileName: file }, 'error saving file @{fileName}: @{err.message}\n@{err.stack}');
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
  getPackage(options) {
    this.localStorage.getPackageMetadata(options.name, (err, data) => {
      if (err && (!err.status || err.status >= _constants.HTTP_STATUS.INTERNAL_ERROR)) {
        // report internal errors right away
        return options.callback(err);
      }

      this._syncUplinksMetadata(options.name, data, { req: options.req }, function getPackageSynUpLinksCallback(err, result, uplinkErrors) {
        if (err) {
          return options.callback(err);
        }

        (0, _utils.normalizeDistTags)((0, _storageUtils.cleanUpLinksRef)(options.keepUpLinkData, result));

        // npm can throw if this field doesn't exist
        result._attachments = {};

        options.callback(null, result, uplinkErrors);
      });
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
  search(startkey, options) {
    let self = this;
    // stream to write a tarball
    let stream = new _stream2.default.PassThrough({ objectMode: true });

    _async2.default.eachSeries(Object.keys(this.uplinks), function (up_name, cb) {
      // shortcut: if `local=1` is supplied, don't call uplinks
      if (options.req.query.local !== undefined) {
        return cb();
      }
      // search by keyword for each uplink
      let lstream = self.uplinks[up_name].search(options);
      // join streams
      lstream.pipe(stream, { end: false });
      lstream.on('error', function (err) {
        self.logger.error({ err: err }, 'uplink error: @{err.message}');
        cb(), cb = function () {};
      });
      lstream.on('end', function () {
        cb(), cb = function () {};
      });

      stream.abort = function () {
        if (lstream.abort) {
          lstream.abort();
        }
        cb(), cb = function () {};
      };
    },
    // executed after all series
    function () {
      // attach a local search results
      let lstream = self.localStorage.search(startkey, options);
      stream.abort = function () {
        lstream.abort();
      };
      lstream.pipe(stream, { end: true });
      lstream.on('error', function (err) {
        self.logger.error({ err: err }, 'search error: @{err.message}');
        stream.end();
      });
    });

    return stream;
  }

  /**
   * Retrieve only private local packages
   * @param {*} callback
   */
  getLocalDatabase(callback) {
    let self = this;
    this.localStorage.localData.get((err, locals) => {
      if (err) {
        callback(err);
      }

      let packages = [];
      const getPackage = function (itemPkg) {
        self.localStorage.getPackageMetadata(locals[itemPkg], function (err, info) {
          if (_lodash2.default.isNil(err)) {
            const latest = info[_utils.DIST_TAGS].latest;

            if (latest && info.versions[latest]) {
              const version = info.versions[latest];
              const time = info.time[latest];
              version.time = time;

              packages.push(version);
            } else {
              self.logger.warn({ package: locals[itemPkg] }, 'package @{package} does not have a "latest" tag?');
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
  _syncUplinksMetadata(name, packageInfo, options, callback) {
    let exists = true;
    const self = this;
    const upLinks = [];

    if (!packageInfo || packageInfo === null) {
      exists = false;
      packageInfo = (0, _storageUtils.generatePackageTemplate)(name);
    }

    for (let uplink in this.uplinks) {
      if ((0, _configUtils.hasProxyTo)(name, uplink, this.config.packages)) {
        upLinks.push(this.uplinks[uplink]);
      }
    }

    _async2.default.map(upLinks, (upLink, cb) => {
      const _options = Object.assign({}, options);
      let upLinkMeta = packageInfo._uplinks[upLink.upname];

      if ((0, _utils.isObject)(upLinkMeta)) {
        const fetched = upLinkMeta.fetched;

        if (fetched && Date.now() - fetched < upLink.maxage) {
          return cb();
        }

        _options.etag = upLinkMeta.etag;
      }

      upLink.getRemoteMetadata(name, _options, (err, upLinkResponse, eTag) => {
        if (err && err.remoteStatus === 304) {
          upLinkMeta.fetched = Date.now();
        }

        if (err || !upLinkResponse) {
          // $FlowFixMe
          return cb(null, [err || _utils.ErrorCode.getInternalError('no data')]);
        }

        try {
          (0, _utils.validate_metadata)(upLinkResponse, name);
        } catch (err) {
          self.logger.error({
            sub: 'out',
            err: err
          }, 'package.json validating error @{!err.message}\n@{err.stack}');
          return cb(null, [err]);
        }

        packageInfo._uplinks[upLink.upname] = {
          etag: eTag,
          fetched: Date.now()
        };

        packageInfo.time = (0, _storageUtils.mergeUplinkTimeIntoLocal)(packageInfo, upLinkResponse);

        (0, _uplinkUtil.updateVersionsHiddenUpLink)(upLinkResponse.versions, upLink);

        try {
          (0, _metadataUtils.mergeVersions)(packageInfo, upLinkResponse);
        } catch (err) {
          self.logger.error({
            sub: 'out',
            err: err
          }, 'package.json parsing error @{!err.message}\n@{err.stack}');
          return cb(null, [err]);
        }

        // if we got to this point, assume that the correct package exists
        // on the uplink
        exists = true;
        cb();
      });
    }, (err, upLinksErrors) => {
      (0, _assert2.default)(!err && Array.isArray(upLinksErrors));
      if (!exists) {
        return callback(_utils.ErrorCode.getNotFound(_constants.API_ERROR.NO_PACKAGE), null, upLinksErrors);
      }

      self.localStorage.updateVersions(name, packageInfo, function (err, packageJsonLocal) {
        if (err) {
          return callback(err);
        }
        return callback(null, packageJsonLocal, upLinksErrors);
      });
    });
  }

  /**
   * Set a hidden value for each version.
   * @param {Array} versions list of version
   * @param {String} upLink uplink name
   * @private
   */
  _updateVersionsHiddenUpLink(versions, upLink) {
    for (let i in versions) {
      if (Object.prototype.hasOwnProperty.call(versions, i)) {
        const version = versions[i];

        // holds a "hidden" value to be used by the package storage.
        // $FlowFixMe
        version[Symbol.for('__verdaccio_uplink')] = upLink.upname;
      }
    }
  }
}

exports.default = Storage;