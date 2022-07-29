import buildDebug from 'debug';
import { Router } from 'express';

import { IAuth } from '@verdaccio/auth';
import { HEADERS, HEADER_TYPE } from '@verdaccio/core';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend, allow } from '@verdaccio/middleware';
import sanitizyReadme from '@verdaccio/readme';
import { Storage } from '@verdaccio/store';
import { Manifest } from '@verdaccio/types';

import { AuthorAvatar, addScope, parseReadme } from '../utils/web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

// TODO: review this type, should be on @verdacid/types
export type PackageExt = Manifest & { author: AuthorAvatar; dist?: { tarball: string } };

const debug = buildDebug('verdaccio:web:api:readme');

export const NOT_README_FOUND = 'ERROR: No README data found!';

function addReadmeWebApi(storage: Storage, auth: IAuth): Router {
  debug('initialized readme web api');
  const can = allow(auth);
  const pkgRouter = Router(); /* eslint new-cap: 0 */

  pkgRouter.get(
    '/package/readme/(@:scope/)?:package/:version?',
    can('access'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      debug('readme hit');
      const name = req.params.scope
        ? addScope(req.params.scope, req.params.package)
        : req.params.package;
      debug('readme name %o', name);
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
        debug('readme pkg %o', manifest?.name);
        res.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN_UTF8);
        try {
          next(parseReadme(manifest.name, manifest.readme as string));
        } catch {
          next(sanitizyReadme(NOT_README_FOUND));
        }
      } catch (err) {
        next(err);
      }
    }
  );
  return pkgRouter;
}

export default addReadmeWebApi;
