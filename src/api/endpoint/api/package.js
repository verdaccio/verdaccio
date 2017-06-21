'use strict';

const _ = require('lodash');
const createError = require('http-errors');

const Middleware = require('../../web/middleware');
const Utils = require('../../../lib/utils');

module.exports = function(route, auth, storage, config) {
  const can = Middleware.allow(auth);
  // TODO: anonymous user?
  route.get('/:package/:version?', can('access'), function(req, res, next) {
    storage.get_package(req.params.package, {req: req}, function(err, info) {
      if (err) {
        return next(err);
      }
      info = Utils.filter_tarball_urls(info, req, config);

      let version = req.params.version;
      if (_.isNil(version)) {
        return next(info);
      }

      let t = Utils.get_version(info, version);
      if (_.isNil(t) === false) {
        return next(t);
      }

      if (_.isNil(info['dist-tags']) === false) {
        if (_.isNil(info['dist-tags'][version]) === false) {
          version = info['dist-tags'][version];
          t = Utils.get_version(info, version);
          if (_.isNil(t)) {
            return next(t);
          }
        }
      }

      return next( createError[404]('version not found: ' + req.params.version) );
    });
  });

  route.get('/:package/-/:filename', can('access'), function(req, res) {
    const stream = storage.get_tarball(req.params.package, req.params.filename);
    stream.on('content-length', function(v) {
      res.header('Content-Length', v);
    });
    stream.on('error', function(err) {
      return res.report_error(err);
    });
    res.header('Content-Type', 'application/octet-stream');
    stream.pipe(res);
  });
};
