const _ = require('lodash');
const createError = require('http-errors');

const {allow} = require('../../web/middleware');
const Utils = require('../../../lib/utils');

export default function(route, auth, storage, config) {
  const can = allow(auth);
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
          if (_.isNil(t) === false) {
            return next(t);
          }
        }
      }

      return next( createError[404]('version not found: ' + req.params.version) );
    };

    storage.getPackage({
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
}
