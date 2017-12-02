'use strict';

const _ = require('lodash');
const createError = require('http-errors');

const Middleware = require('../../web/middleware');
const Utils = require('../../../lib/utils');

module.exports = function(route, auth, storage, config) {
  const can = Middleware.allow(auth);
  // TODO: anonymous user?
  route.get('/:package/:version?', can('access'), function(req, res, next) {
    const getPackageMetaCallback = function(err, info) {
      if (err) {
        return next(err);
      }
      info = Utils.filter_tarball_urls(info, req, config);

      let queryVersion = req.params.version;
      if (_.isNil(queryVersion)) {
        return next(info);
      }

      let t = Utils.get_version(info, queryVersion);
      if (_.isNil(t) === false) {
        return next(t);
      }

      if (_.isNil(info['dist-tags']) === false) {
        if (_.isNil(info['dist-tags'][queryVersion]) === false) {
          queryVersion = info['dist-tags'][queryVersion];
          t = Utils.get_version(info, queryVersion);
          if (_.isNil(t)) {
            return next(t);
          }
        }
      }

      return next( createError[404]('version not found: ' + req.params.version) );
    };

    storage.get_package({
      name: req.params.package,
      req,
      callback: getPackageMetaCallback,
    });
  });

  route.get('/:package/-/:filename', can('access'), function(req, res) {
    const stream = storage.get_tarball(req.params.package, req.params.filename);
    stream.on('content-length', function(content) {
      res.header('Content-Length', content);
    });
    stream.on('error', function(err) {
      return res.report_error(err);
    });
    res.header('Content-Type', 'application/octet-stream');
    stream.pipe(res);
  });
};
