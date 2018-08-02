// @flow

import mime from 'mime';
import _ from 'lodash';
import {media, allow} from '../../middleware';
import {DIST_TAGS} from '../../../lib/utils';
import type {Router} from 'express';
import type {IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler} from '../../../../types';
import {API_MESSAGE, HTTP_STATUS} from '../../../lib/constants';

export default function(route: Router, auth: IAuth, storage: IStorageHandler) {
  const can = allow(auth);
  const tag_package_version = function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    if (_.isString(req.body) === false) {
      return next('route');
    }

    let tags = {};
    tags[req.params.tag] = req.body;
    storage.mergeTags(req.params.package, tags, function(err) {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.CREATED);
      return next({ok: API_MESSAGE.TAG_ADDED});
    });
  };

  // tagging a package
  route.put('/:package/:tag', can('publish'), media(mime.getType('json')), tag_package_version);

  route.post('/-/package/:package/dist-tags/:tag', can('publish'), media(mime.getType('json')), tag_package_version);

  route.put('/-/package/:package/dist-tags/:tag', can('publish'), media(mime.getType('json')), tag_package_version);

  route.delete('/-/package/:package/dist-tags/:tag', can('publish'), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const tags = {};
    tags[req.params.tag] = null;
    storage.mergeTags(req.params.package, tags, function(err) {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.CREATED);
      return next({
        ok: API_MESSAGE.TAG_REMOVED,
      });
    });
  });

  route.get('/-/package/:package/dist-tags', can('access'), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    storage.getPackage({
      name: req.params.package,
      req,
      callback: function(err, info) {
        if (err) {
          return next(err);
        }

        next(info[DIST_TAGS]);
      },
    });
  });

  route.post('/-/package/:package/dist-tags', can('publish'), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      storage.mergeTags(req.params.package, req.body, function(err) {
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
