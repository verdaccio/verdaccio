import { Router } from 'express';
import _ from 'lodash';
import mime from 'mime';

import { Auth } from '@verdaccio/auth';
import { constants, errorUtils } from '@verdaccio/core';
import { allow, media } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Logger } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

export default function (route: Router, auth: Auth, storage: Storage, logger: Logger): void {
  const can = allow(auth, {
    beforeAll: (a, b) => logger.trace(a, b),
    afterAll: (a, b) => logger.trace(a, b),
  });
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
}
