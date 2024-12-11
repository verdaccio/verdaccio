import buildDebug from 'debug';
import { Router } from 'express';

import { Auth } from '@verdaccio/auth';
import { HEADERS, HEADER_TYPE } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend, allow } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Manifest } from '@verdaccio/types';

import { AuthorAvatar, addScope } from '../web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

// TODO: review this type, should be on @verdacid/types
export type PackageExt = Manifest & { author: AuthorAvatar; dist?: { tarball: string } };
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

function addReadmeWebApi(storage: Storage, auth: Auth): Router {
  debug('initialized readme web api');
  const can = allow(auth, {
    beforeAll: (a, b) => logger.trace(a, b),
    afterAll: (a, b) => logger.trace(a, b),
  });
  const pkgRouter = Router(); /* eslint new-cap: 0 */

  pkgRouter.get(
    '/package/readme/:scope(@[^/]+)?/:package/:version?',
    can('access'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      debug('readme hit');
      const rawScope = req.params.scope; // May include '@'
      const scope = rawScope ? rawScope.slice(1) : null; // Remove '@' if present
      const name = scope ? addScope(scope, req.params.package) : req.params.package;
      debug('readme name %o', name);
      const requestOptions = {
        protocol: req.protocol,
        headers: req.headers as any,
        // FIXME: if we migrate to req.hostname, the port is not longer included.
        host: req.host,
        remoteAddress: req.socket.remoteAddress,
      };
      try {
        const manifest = (await storage.getPackageByOptions({
          name,
          uplinksLook: true,
          abbreviated: false,
          requestOptions,
        })) as Manifest;
        debug('readme pkg %o', manifest?.name);
        res.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN_UTF8);
        next(getReadme(manifest.readme));
      } catch (err) {
        next(err);
      }
    }
  );
  return pkgRouter;
}

export default addReadmeWebApi;
