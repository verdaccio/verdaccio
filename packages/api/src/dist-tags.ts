import type { Router } from 'express';

import type { Auth } from '@verdaccio/auth';
import { HEADERS, constants, errorUtils } from '@verdaccio/core';
import { DIST_TAGS_API_ENDPOINTS, allow, getRequestOptions, media } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Logger } from '@verdaccio/types';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

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
    if (typeof req.body !== 'string') {
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
    DIST_TAGS_API_ENDPOINTS.tagging,
    can('publish'),
    media(HEADERS.JSON),
    addTagPackageVersionMiddleware
  );

  route.put(
    DIST_TAGS_API_ENDPOINTS.tagging_package,
    can('publish'),
    media(HEADERS.JSON),
    addTagPackageVersionMiddleware
  );

  route.delete(
    DIST_TAGS_API_ENDPOINTS.tagging_package,
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
    DIST_TAGS_API_ENDPOINTS.get_dist_tags,
    can('access'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const name = req.params.package;
      const requestOptions = getRequestOptions(req);
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
