import buildDebug from 'debug';
import { Router } from 'express';

import type { Auth } from '@verdaccio/auth';
import { DIST_TAGS, HEADERS, HEADER_TYPE, errorUtils } from '@verdaccio/core';
import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '@verdaccio/middleware';
import { WebUrls, getRequestOptions } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Config, Manifest } from '@verdaccio/types';

import { summarizeProvenance } from '../provenance-utils';
import { resolveVersion } from '../web-utils';
import { scopedPackageAccess } from './scoped-access';

const debug = buildDebug('verdaccio:web:api:provenance');

function addProvenanceWebApi(storage: Storage, auth: Auth, config: Config): Router {
  debug('initialized provenance web api');
  const router = Router(); /* eslint new-cap: 0 */
  router.get(
    [WebUrls.provenance_package_scoped, WebUrls.provenance_package],
    scopedPackageAccess(auth, config),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const name = (req as $RequestExtend & { scopedPackageName: string }).scopedPackageName;
      const requestOptions = getRequestOptions(req);
      try {
        const manifest = (await storage.getPackageByOptions({
          name,
          uplinksLook: true,
          requestOptions,
        })) as Manifest;
        const { v } = req.query;
        const version = resolveVersion(
          manifest,
          typeof v === 'string' ? v : manifest[DIST_TAGS]?.latest
        );
        const dist = version ? manifest.versions[version]?.dist : undefined;
        if (!version || !dist?.attestations) {
          debug('no attestations for %o %o', name, v);
          return next(errorUtils.getNotFound());
        }
        const attestations = await storage.getAttestations(name, version);
        const summary = attestations ? summarizeProvenance(attestations.attestations) : null;
        if (!summary) {
          return next(errorUtils.getNotFound());
        }
        res.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET);
        next({
          name,
          version,
          signatures: (dist.signatures ?? []).map(({ keyid }) => ({ keyid })),
          ...summary,
        });
      } catch (err) {
        next(err);
      }
    }
  );
  return router;
}

export default addProvenanceWebApi;
