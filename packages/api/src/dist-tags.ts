import { Router } from 'express';
import _ from 'lodash';
import mime from 'mime';

import { IAuth } from '@verdaccio/auth';
import { constants, errorUtils } from '@verdaccio/core';
import { allow, media } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

export default function (route: Router, auth: IAuth, storage: Storage): void {
  const can = allow(auth);
  const addTagPackageVersionMiddleware = async function (
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer
  ): Promise<$NextFunctionVer> {
    if (_.isString(req.body) === false) {
      return next(errorUtils.getBadRequest('version is missing'));
    }

    const tags = {};
    tags[req.params.tag] = req.body;
    try {
      await storage.mergeTagsNext(req.params.package, tags);
      res.status(constants.HTTP_STATUS.CREATED);
      return next({
        ok: constants.API_MESSAGE.TAG_ADDED,
      });
    } catch (err) {
      next(err);
    }
  };

  // tagging a package.
  route.put(
    '/:package/:tag',
    can('publish'),
    media(mime.getType('json')),
    addTagPackageVersionMiddleware
  );

  route.put(
    '/-/package/:package/dist-tags/:tag',
    can('publish'),
    media(mime.getType('json')),
    addTagPackageVersionMiddleware
  );

  route.delete(
    '/-/package/:package/dist-tags/:tag',
    can('publish'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const tags = {};
      tags[req.params.tag] = null;
      try {
        await storage.mergeTagsNext(req.params.package, tags);
        res.status(constants.HTTP_STATUS.CREATED);
        return next({
          ok: constants.API_MESSAGE.TAG_REMOVED,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  route.get(
    '/-/package/:package/dist-tags',
    can('access'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const name = req.params.package;
      const requestOptions = {
        protocol: req.protocol,
        headers: req.headers as any,
        // FIXME: if we migrate to req.hostname, the port is not longer included.
        host: req.host,
        remoteAddress: req.socket.remoteAddress,
      };
      try {
        const manifest = await storage.getPackageByOptions({
          name,
          uplinksLook: true,
          requestOptions,
        });
        next(manifest[constants.DIST_TAGS]);
      } catch (err) {
        next(err);
      }
    }
  );

  route.post(
    '/-/package/:package/dist-tags',
    can('publish'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      try {
        await storage.mergeTagsNext(req.params.package, req.body);
        res.status(constants.HTTP_STATUS.CREATED);
        return next({
          ok: constants.API_MESSAGE.TAG_UPDATED,
        });
      } catch (err) {
        next(err);
      }
    }
  );
}
