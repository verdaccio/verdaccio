// @flow

import _ from 'lodash';
import {allow} from '../../middleware';
import {DIST_TAGS, filter_tarball_urls, get_version, ErrorCode} from '../../../lib/utils';
import type {Router} from 'express';
import type {Config} from '@verdaccio/types';
import type {IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler} from '../../../../types';

export default function(route: Router, auth: IAuth, storage: IStorageHandler, config: Config) {
  const can = allow(auth);
  // TODO: anonymous user?
  route.get('/:package/:version?', can('access'), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const getPackageMetaCallback = function(err, info) {
      if (err) {
        return next(err);
      }
      info = filter_tarball_urls(info, req, config);

      let queryVersion = req.params.version;
      if (_.isNil(queryVersion)) {
        return next(info);
      }

      let t = get_version(info, queryVersion);
      if (_.isNil(t) === false) {
        return next(t);
      }

      if (_.isNil(info[DIST_TAGS]) === false) {
        if (_.isNil(info[DIST_TAGS][queryVersion]) === false) {
          queryVersion = info[DIST_TAGS][queryVersion];
          t = get_version(info, queryVersion);
          if (_.isNil(t) === false) {
            return next(t);
          }
        }
      }
      return next(ErrorCode.get404('version not found: ' + req.params.version));
    };

    storage.getPackage({
      name: req.params.package,
      req,
      callback: getPackageMetaCallback,
    });
  });

  route.get('/:package/-/:filename', can('access'), function(req: $RequestExtend, res: $ResponseExtend) {
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
