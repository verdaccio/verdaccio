import { Router } from 'express';
import _ from 'lodash';
import mime from 'mime';

import { DIST_TAGS_API_ENDPOINTS, allow, media } from '@verdaccio/middleware';
import { Package } from '@verdaccio/types';

import Auth from '../../../lib/auth';
import { API_MESSAGE, DIST_TAGS, HTTP_STATUS } from '../../../lib/constants';
import { logger } from '../../../lib/logger';
import Storage from '../../../lib/storage';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../../types';

export default function (route: Router, auth: Auth, storage: Storage): void {
  const can = allow(auth, {
    beforeAll: (params, message) => logger.trace(params, message),
    afterAll: (params, message) => logger.trace(params, message),
  });
  const tag_package_version = function (
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer
  ): $NextFunctionVer {
    if (_.isString(req.body) === false) {
      return next('route');
    }

    const tags = {};
    tags[req.params.tag] = req.body;
    storage.mergeTags(req.params.package, tags, function (err: Error): $NextFunctionVer {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.CREATED);
      return next({ ok: API_MESSAGE.TAG_ADDED });
    });
  };

  // tagging a package
  route.put(
    DIST_TAGS_API_ENDPOINTS.tagging,
    can('publish'),
    media(mime.getType('json')),
    tag_package_version
  );

  route.post(
    DIST_TAGS_API_ENDPOINTS.tagging_package,
    can('publish'),
    media(mime.getType('json')),
    tag_package_version
  );

  route.put(
    DIST_TAGS_API_ENDPOINTS.tagging_package,
    can('publish'),
    media(mime.getType('json')),
    tag_package_version
  );

  route.delete(
    DIST_TAGS_API_ENDPOINTS.tagging_package,
    can('publish'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const tags = {};
      tags[req.params.tag] = null;
      storage.mergeTags(req.params.package, tags, function (err: any): $NextFunctionVer {
        if (err) {
          return next(err);
        }
        res.status(HTTP_STATUS.CREATED);
        return next({
          ok: API_MESSAGE.TAG_REMOVED,
        });
      });
    }
  );

  route.get(
    DIST_TAGS_API_ENDPOINTS.get_dist_tags,
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      storage.getPackage({
        name: req.params.package,
        uplinksLook: true,
        req,
        callback: function (err: any, info: Package): $NextFunctionVer {
          if (err) {
            return next(err);
          }

          next(info[DIST_TAGS]);
        },
      });
    }
  );

  route.post(
    DIST_TAGS_API_ENDPOINTS.get_dist_tags,
    can('publish'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      storage.mergeTags(req.params.package, req.body, function (err: any): $NextFunctionVer {
        if (err) {
          return next(err);
        }
        res.status(HTTP_STATUS.CREATED);
        return next({
          ok: API_MESSAGE.TAG_UPDATED,
        });
      });
    }
  );
}
