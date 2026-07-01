import buildDebug from 'debug';
import { Router } from 'express';

import type { Auth } from '@verdaccio/auth';
import { DIST_TAGS, HEADERS, HEADER_TYPE, reqUtils } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';
import {
  $NextFunctionVer,
  $RequestExtend,
  $ResponseExtend,
  WebUrls,
  allow,
  getRequestOptions,
} from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Manifest } from '@verdaccio/types';

import { addScope, isVersionValid } from '../web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

export const NOT_README_FOUND = 'ERROR: No README data found!';

const debug = buildDebug('verdaccio:web:api:readme');

const getReadme = (readme) => {
  if (typeof readme === 'string' && readme.length === 0) {
    return NOT_README_FOUND;
  }
  if (typeof readme !== 'string') {
    return NOT_README_FOUND;
  } else {
    return readme;
  }
};

const getReadmeFromManifest = (manifest: Manifest, v?: any): string | undefined => {
  let id;
  let readme;
  if (typeof v === 'string' && isVersionValid(manifest, v)) {
    id = 'version';
    readme = manifest.versions[v].readme;
  }
  if (!readme && isVersionValid(manifest, manifest[DIST_TAGS]?.latest)) {
    id = 'latest';
    readme = manifest.versions[manifest[DIST_TAGS].latest].readme;
  }
  if (!readme && manifest.readme) {
    id = 'root';
    readme = manifest.readme;
  }
  debug('readme: %o %o', v, id);
  return readme;
};

function addReadmeWebApi(storage: Storage, auth: Auth): Router {
  debug('initialized readme web api');
  const can = allow(auth, {
    beforeAll: (a, b) => logger.trace(a, b),
    afterAll: (a, b) => logger.trace(a, b),
  });
  const pkgRouter = Router(); /* eslint new-cap: 0 */

  pkgRouter.get(
    [WebUrls.readme_package_scoped_version, WebUrls.readme_package_version],
    can('access'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      debug('readme hit');
      const scope = reqUtils.paramToString(req.params.scope).replace(/^@/, '');
      const packageName = reqUtils.paramToString(req.params.package);
      const name = scope ? addScope(scope, packageName) : packageName;
      debug('readme name %o', name);
      const requestOptions = getRequestOptions(req);
      try {
        const manifest = (await storage.getPackageByOptions({
          name,
          uplinksLook: true,
          abbreviated: false,
          requestOptions,
        })) as Manifest;
        debug('readme pkg %o', manifest?.name);
        res.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN_UTF8);
        // TODO: sanitize query
        const { v } = req.query;
        const readme = getReadmeFromManifest(manifest, v);
        next(getReadme(readme));
      } catch (err) {
        next(err);
      }
    }
  );
  return pkgRouter;
}

export default addReadmeWebApi;
