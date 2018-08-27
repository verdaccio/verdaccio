'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (router, auth, storage, config) {
  const can = (0, _middleware.allow)(auth);

  // publishing a package
  router.put('/:package/:_rev?/:revision?', can('publish'), (0, _middleware.media)(_mime2.default.getType('json')), _middleware.expectJson, function (req, res, next) {
    const name = req.params.package;
    let metadata;
    const create_tarball = function (filename, data, cb) {
      let stream = storage.addTarball(name, filename);
      stream.on('error', function (err) {
        cb(err);
      });
      stream.on('success', function () {
        cb();
      });

      // this is dumb and memory-consuming, but what choices do we have?
      // flow: we need first refactor this file before decides which type use here
      // $FlowFixMe
      stream.end(new Buffer(data.data, 'base64'));
      stream.done();
    };

    const create_version = function (version, data, cb) {
      storage.addVersion(name, version, data, null, cb);
    };

    const add_tags = function (tags, cb) {
      storage.mergeTags(name, tags, cb);
    };

    const after_change = function (err, ok_message) {
      // old npm behaviour
      if (_lodash2.default.isNil(metadata._attachments)) {
        if (err) return next(err);
        res.status(201);
        return next({
          ok: ok_message,
          success: true
        });
      }

      // npm-registry-client 0.3+ embeds tarball into the json upload
      // https://github.com/isaacs/npm-registry-client/commit/e9fbeb8b67f249394f735c74ef11fe4720d46ca0
      // issue https://github.com/rlidwka/sinopia/issues/31, dealing with it here:

      if (typeof metadata._attachments !== 'object' || Object.keys(metadata._attachments).length !== 1 || typeof metadata.versions !== 'object' || Object.keys(metadata.versions).length !== 1) {
        // npm is doing something strange again
        // if this happens in normal circumstances, report it as a bug
        return next(_utils.ErrorCode.getBadRequest('unsupported registry call'));
      }

      if (err && err.status != 409) {
        return next(err);
      }

      // at this point document is either created or existed before
      const t1 = Object.keys(metadata._attachments)[0];
      create_tarball(_path2.default.basename(t1), metadata._attachments[t1], function (err) {
        if (err) {
          return next(err);
        }

        const versionToPublish = Object.keys(metadata.versions)[0];
        metadata.versions[versionToPublish].readme = _lodash2.default.isNil(metadata.readme) === false ? String(metadata.readme) : '';
        create_version(versionToPublish, metadata.versions[versionToPublish], function (err) {
          if (err) {
            return next(err);
          }

          add_tags(metadata[_utils.DIST_TAGS], (() => {
            var _ref = _asyncToGenerator(function* (err) {
              if (err) {
                return next(err);
              }

              try {
                yield (0, _notify.notify)(metadata, config, req.remote_user, `${metadata.name}@${versionToPublish}`);
              } catch (err) {
                _logger2.default.logger.error({ err }, 'notify batch service has failed: @{err}');
              }

              res.status(201);
              return next({ ok: ok_message, success: true });
            });

            return function (_x) {
              return _ref.apply(this, arguments);
            };
          })());
        });
      });
    };

    if (Object.keys(req.body).length === 1 && (0, _utils.isObject)(req.body.users)) {
      // 501 status is more meaningful, but npm doesn't show error message for 5xx
      return next(_utils.ErrorCode.getNotFound('npm star|unstar calls are not implemented'));
    }

    try {
      metadata = (0, _utils.validate_metadata)(req.body, name);
    } catch (err) {
      return next(_utils.ErrorCode.getBadData('bad incoming package data'));
    }

    if (req.params._rev) {
      storage.changePackage(name, metadata, req.params.revision, function (err) {
        after_change(err, _constants.API_MESSAGE.PKG_CHANGED);
      });
    } else {
      storage.addPackage(name, metadata, function (err) {
        after_change(err, _constants.API_MESSAGE.PKG_CREATED);
      });
    }
  });

  // unpublishing an entire package
  router.delete('/:package/-rev/*', can('publish'), function (req, res, next) {
    storage.removePackage(req.params.package, function (err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({ ok: _constants.API_MESSAGE.PKG_REMOVED });
    });
  });

  // removing a tarball
  router.delete('/:package/-/:filename/-rev/:revision', can('publish'), function (req, res, next) {
    storage.removeTarball(req.params.package, req.params.filename, req.params.revision, function (err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({ ok: _constants.API_MESSAGE.TARBALL_REMOVED });
    });
  });

  // uploading package tarball
  router.put('/:package/-/:filename/*', can('publish'), (0, _middleware.media)(_constants.HEADERS.OCTET_STREAM), function (req, res, next) {
    const name = req.params.package;
    const stream = storage.addTarball(name, req.params.filename);
    req.pipe(stream);

    // checking if end event came before closing
    let complete = false;
    req.on('end', function () {
      complete = true;
      stream.done();
    });

    req.on('close', function () {
      if (!complete) {
        stream.abort();
      }
    });

    stream.on('error', function (err) {
      return res.report_error(err);
    });

    stream.on('success', function () {
      res.status(201);
      return next({
        ok: 'tarball uploaded successfully'
      });
    });
  });

  // adding a version
  router.put('/:package/:version/-tag/:tag', can('publish'), (0, _middleware.media)(_mime2.default.getType('json')), _middleware.expectJson, function (req, res, next) {
    const { version, tag } = req.params;
    const name = req.params.package;

    storage.addVersion(name, version, req.body, tag, function (err) {
      if (err) {
        return next(err);
      }

      res.status(201);
      return next({
        ok: _constants.API_MESSAGE.PKG_PUBLISHED
      });
    });
  });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mime = require('mime');

var _mime2 = _interopRequireDefault(_mime);

var _constants = require('../../../lib/constants');

var _utils = require('../../../lib/utils');

var _middleware = require('../../middleware');

var _notify = require('../../../lib/notify');

var _logger = require('../../../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }