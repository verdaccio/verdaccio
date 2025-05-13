import buildDebug from 'debug';
import { Router } from 'express';

import { Auth } from '@verdaccio/auth';
import { DIST_TAGS, HTTP_STATUS } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend, allow } from '@verdaccio/middleware';
// Was required by other packages
import { WebUrls } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { convertDistRemoteToLocalTarballUrls } from '@verdaccio/tarball';
import { Config, Manifest, WebManifest } from '@verdaccio/types';

import { addGravatarSupport, formatAuthor } from '../author-utils';
import { addScope, deleteProperties, isVersionValid } from '../web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

const debug = buildDebug('verdaccio:web:api:sidebar');

function addSidebarWebApi(config: Config, storage: Storage, auth: Auth): Router {
  debug('initialized sidebar web api');
  const router = Router(); /* eslint new-cap: 0 */
  const can = allow(auth, {
    beforeAll: (a, b) => logger.trace(a, b),
    afterAll: (a, b) => logger.trace(a, b),
  });
  // Get package sidebar
  router.get(
    [WebUrls.sidebar_scopped_package, WebUrls.sidebar_package],
    can('access'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const rawScope = req.params.scope; // May include '@'
      const scope = rawScope ? rawScope.slice(1) : null; // Remove '@' if present
      const name: string = scope ? addScope(scope, req.params.package) : req.params.package;
      const requestOptions = {
        protocol: req.protocol,
        headers: req.headers as any,
        // FIXME: if we migrate to req.hostname, the port is not longer included.
        host: req.host,
        remoteAddress: req.socket.remoteAddress,
      };
      try {
        const info = (await storage.getPackageByOptions({
          name,
          uplinksLook: true,
          keepUpLinkData: true,
          requestOptions,
        })) as Manifest;
        // TODO: sanitize query
        const { v } = req.query;
        let sideBarInfo = { ...info } as WebManifest;
        sideBarInfo.versions = convertDistRemoteToLocalTarballUrls(
          info,
          { protocol: req.protocol, headers: req.headers as any, host: req.hostname },
          config.url_prefix
        ).versions;
        if (typeof v === 'string' && isVersionValid(info, v)) {
          sideBarInfo.latest = sideBarInfo.versions[v];
          sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
        } else {
          sideBarInfo.latest = sideBarInfo.versions[info[DIST_TAGS].latest];
          sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
        }
        sideBarInfo = deleteProperties(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
        const authorAvatar = config.web
          ? addGravatarSupport(sideBarInfo, config.web.gravatar)
          : addGravatarSupport(sideBarInfo);
        next(authorAvatar);
      } catch (err) {
        res.status(HTTP_STATUS.NOT_FOUND);
        res.end();
      }
    }
  );

  return router;
}

export default addSidebarWebApi;
