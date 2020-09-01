import mime from 'mime';
import _ from 'lodash';
import { Router } from 'express';

import { media, allow } from '@verdaccio/middleware';
import { API_MESSAGE, HTTP_STATUS, DIST_TAGS } from '@verdaccio/dev-commons';
import { VerdaccioError } from '@verdaccio/commons-api';
import { Package } from '@verdaccio/types';

// @ts-ignore
import { IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler } from '@verdaccio/dev-types';

export default function (route: Router, auth: IAuth, storage: IStorageHandler): void {
  const can = allow(auth);
  const tag_package_version = function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): $NextFunctionVer {
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

  // tagging a package.
  route.put('/:package/:tag', can('publish'), media(mime.getType('json')), tag_package_version);

  route.post('/-/package/:package/dist-tags/:tag', can('publish'), media(mime.getType('json')), tag_package_version);

  route.put('/-/package/:package/dist-tags/:tag', can('publish'), media(mime.getType('json')), tag_package_version);

  route.delete('/-/package/:package/dist-tags/:tag', can('publish'), function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const tags = {};
    tags[req.params.tag] = null;
    storage.mergeTags(req.params.package, tags, function (err: VerdaccioError): $NextFunctionVer {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.CREATED);
      return next({
        ok: API_MESSAGE.TAG_REMOVED,
      });
    });
  });

  route.get('/-/package/:package/dist-tags', can('access'), function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    storage.getPackage({
      name: req.params.package,
      uplinksLook: true,
      req,
      callback: function (err: VerdaccioError, info: Package): $NextFunctionVer {
        if (err) {
          return next(err);
        }

        next(info[DIST_TAGS]);
      },
    });
  });

  route.post('/-/package/:package/dist-tags', can('publish'), function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    storage.mergeTags(req.params.package, req.body, function (err: VerdaccioError): $NextFunctionVer {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.CREATED);
      return next({
        ok: API_MESSAGE.TAG_UPDATED,
      });
    });
  });
}
