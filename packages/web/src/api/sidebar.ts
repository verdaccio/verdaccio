import buildDebug from 'debug';
import { Router } from 'express';

import type { Auth } from '@verdaccio/auth';
import { DIST_TAGS, HTTP_STATUS, pkgUtils } from '@verdaccio/core';
import {
  $NextFunctionVer,
  $RequestExtend,
  $ResponseExtend,
  WebUrls,
  getRequestOptions,
} from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import { convertDistRemoteToLocalTarballUrls } from '@verdaccio/tarball';
import type { Config, Manifest, WebManifest } from '@verdaccio/types';

import { addGravatarSupport, formatAuthor } from '../author-utils';
import { deleteProperties, resolveVersion } from '../web-utils';
import { scopedPackageAccess } from './scoped-access';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

const debug = buildDebug('verdaccio:web:api:sidebar');

function addSidebarWebApi(config: Config, storage: Storage, auth: Auth): Router {
  debug('initialized sidebar web api');
  const router = Router(); /* eslint new-cap: 0 */
  // Get package sidebar
  router.get(
    [WebUrls.sidebar_scopped_package, WebUrls.sidebar_package],
    scopedPackageAccess(auth, config),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const name = (req as $RequestExtend & { scopedPackageName: string }).scopedPackageName;
      const requestOptions = getRequestOptions(req);
      try {
        const info = (await storage.getPackageByOptions({
          name,
          uplinksLook: true,
          keepUpLinkData: true,
          requestOptions,
        })) as Manifest;
        const { v } = req.query;
        // `v` may be a version or a dist-tag; anything else is a 404
        let requestedVersion: string | undefined;
        if (typeof v === 'string') {
          requestedVersion = resolveVersion(info, v);
          if (!requestedVersion) {
            debug('version %o not found for %o', v, name);
            res.status(HTTP_STATUS.NOT_FOUND);
            res.end();
            return;
          }
        }
        let sideBarInfo = { ...info } as WebManifest;
        sideBarInfo.versions = convertDistRemoteToLocalTarballUrls(
          info,
          requestOptions,
          config.url_prefix
        ).versions;
        if (requestedVersion) {
          sideBarInfo.latest = sideBarInfo.versions[requestedVersion];
        } else {
          // a manifest without a resolvable dist-tags.latest (corrupt or partial
          // uplink data) used to crash here and surface as a 404 for a package
          // that exists; fall back to the highest available version — semver
          // sorted, since key insertion order reflects publish order, and if
          // every key is invalid semver (fully corrupt manifest), last key wins
          const latestTag = info[DIST_TAGS]?.latest;
          const versionKeys = Object.keys(sideBarInfo.versions);
          const latestVersion =
            typeof latestTag === 'string' && sideBarInfo.versions[latestTag]
              ? latestTag
              : (pkgUtils.semverSort(versionKeys).pop() ?? versionKeys.pop());
          if (!latestVersion) {
            res.status(HTTP_STATUS.NOT_FOUND);
            res.end();
            return;
          }
          sideBarInfo.latest = sideBarInfo.versions[latestVersion];
        }
        sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
        sideBarInfo = deleteProperties(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
        const authorAvatar = config.web
          ? addGravatarSupport(sideBarInfo, config.web.gravatar)
          : addGravatarSupport(sideBarInfo);
        next(authorAvatar);
      } catch {
        res.status(HTTP_STATUS.NOT_FOUND);
        res.end();
      }
    }
  );

  return router;
}

export default addSidebarWebApi;
