import buildDebug from 'debug';
import type { Router } from 'express';

import type { Auth } from '@verdaccio/auth';
import {
  API_ERROR,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  cryptoUtils,
  errorUtils,
  reqUtils,
  validationUtils,
} from '@verdaccio/core';
import { notify } from '@verdaccio/hooks';
import {
  STAGE_API_ENDPOINTS,
  allow,
  expectJson,
  getRequestOptions,
  match,
  media,
} from '@verdaccio/middleware';
import type { StageRecord, Storage } from '@verdaccio/store';
import { toStagePackageVersion } from '@verdaccio/store';
import type { Config, Logger, Manifest, RemoteUser } from '@verdaccio/types';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

const debug = buildDebug('verdaccio:api:stage');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

/**
 * Resolve whether a user may publish a package, as a boolean.
 *
 * The `allow` middleware cannot be used on the `/-/stage/:stageId` routes: it
 * reads `req.params.package`, which is not in those URLs — the package name only
 * becomes known after the staged record is loaded.
 */
function canPublish(auth: Auth, packageName: string, user: RemoteUser): Promise<boolean> {
  return new Promise((resolve) => {
    auth.allow_publish({ packageName }, user, (error, allowed): void => {
      resolve(!error && Boolean(allowed));
    });
  });
}

/**
 * Parse `page`/`perPage`.
 *
 * `npm stage list` loops until `items.length >= total`, so a `total` that does
 * not match the number of items actually reachable through pagination makes the
 * CLI spin forever. Keep both derived from the same filtered array.
 */
function parsePagination(query: any): { page: number; perPage: number } {
  const rawPage = Number.parseInt(String(query.page ?? ''), 10);
  const rawPerPage = Number.parseInt(String(query.perPage ?? ''), 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 0;
  const perPage =
    Number.isFinite(rawPerPage) && rawPerPage > 0
      ? Math.min(rawPerPage, MAX_PER_PAGE)
      : DEFAULT_PER_PAGE;

  return { page, perPage };
}

/**
 * Staged publish workflow (`npm stage`), behind `flags.stage`.
 *
 * A version is uploaded but stays invisible to installs until a maintainer
 * approves it. Staging itself never requires a one-time password — deferring
 * proof of presence to approval time is the whole point of the flow.
 */
export default function stage(
  router: Router,
  auth: Auth,
  storage: Storage,
  config: Config,
  logger: Logger
): void {
  const can = allow(auth, {
    beforeAll: (a, b) => logger.trace(a, b),
    afterAll: (a, b) => logger.trace(a, b),
  });
  const stageStorage = storage.getStageStorage();

  router.param('stageId', match(UUID_PATTERN));

  /**
   * Load a staged record and check the caller may act on it.
   *
   * Answers 404 rather than 403 when the caller lacks permission, so the
   * endpoint does not confirm that an id exists to someone not allowed to see it.
   */
  async function loadRecord(req: $RequestExtend): Promise<StageRecord> {
    const stageId = reqUtils.paramToString(req.params.stageId);
    const user = req.remote_user;
    if (!user?.name) {
      throw errorUtils.getUnauthorized(API_ERROR.MUST_BE_LOGGED);
    }

    const record = await stageStorage.get(stageId);
    if (!record) {
      throw errorUtils.getNotFound('no such staged package version');
    }
    if (record.actor === user.name || (await canPublish(auth, record.packageName, user))) {
      return record;
    }
    debug('user %o may not see staged item %o', user.name, stageId);
    throw errorUtils.getNotFound('no such staged package version');
  }

  /**
   * Stage a version for review.
   *
   * The body is the very same packument a regular publish sends: `libnpmpublish`
   * builds the payload once and only swaps method and route when staging.
   */
  router.post(
    STAGE_API_ENDPOINTS.stage_package,
    can('publish'),
    media(HEADERS.JSON),
    expectJson,
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const packageName = reqUtils.paramToString(req.params.package);
      const username = req.remote_user?.name;

      if (!username) {
        return next(errorUtils.getUnauthorized(API_ERROR.MUST_BE_LOGGED));
      }

      const manifest: Manifest = req.body;
      if (validationUtils.validatePublishSingleVersion(manifest) === false) {
        debug('invalid staging payload for %o', packageName);
        return next(errorUtils.getBadRequest(API_ERROR.UNSUPORTED_REGISTRY_CALL));
      }

      const [version] = Object.keys(manifest.versions);
      const [attachmentName] = Object.keys(manifest._attachments);
      const tarball = Buffer.from(manifest._attachments[attachmentName].data as string, 'base64');

      try {
        const localManifest = await storage.getPackageLocalMetadata(packageName).catch(() => null);
        if (localManifest?.versions?.[version]) {
          debug('%o@%o already published locally', packageName, version);
          return next(errorUtils.getConflict());
        }

        const alreadyStaged = await stageStorage.findByVersion(packageName, version);
        if (alreadyStaged) {
          debug('%o@%o already staged as %o', packageName, version, alreadyStaged.id);
          return next(errorUtils.getConflict(`${packageName}@${version} is already staged`));
        }

        const abort = new AbortController();
        req.on('aborted', () => abort.abort());

        const record = await stageStorage.add(
          {
            packageName,
            version,
            tag: Object.keys(manifest['dist-tags'] ?? {})[0] ?? 'latest',
            actor: username,
            access: manifest.access === 'private' ? 'private' : 'public',
            shasum: cryptoUtils.createTarballHash().update(tarball).digest('hex'),
            tarballFilename: attachmentName.split('/').pop() as string,
            // the tarball lives next to the record, not inlined as base64
            packument: { ...manifest, _attachments: undefined } as any,
          },
          tarball,
          { signal: abort.signal }
        );

        res.status(HTTP_STATUS.CREATED);
        return next({
          message: 'Package version staged successfully.',
          stageId: record.id,
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  /** List staged versions visible to the caller, newest first. */
  router.get(
    STAGE_API_ENDPOINTS.list,
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const user = req.remote_user;
      if (!user?.name) {
        return next(errorUtils.getUnauthorized(API_ERROR.MUST_BE_LOGGED));
      }

      const packageName = typeof req.query.package === 'string' ? req.query.package : undefined;
      const { page, perPage } = parsePagination(req.query);

      try {
        const candidates = await stageStorage.list({ packageName });
        // one permission lookup per distinct package, not per item
        const permissions = new Map<string, boolean>();
        const items: StageRecord[] = [];
        for (const candidate of candidates) {
          if (candidate.actor === user.name) {
            items.push(candidate);
            continue;
          }
          if (!permissions.has(candidate.packageName)) {
            permissions.set(
              candidate.packageName,
              await canPublish(auth, candidate.packageName, user)
            );
          }
          if (permissions.get(candidate.packageName)) {
            items.push(candidate);
          }
        }

        const start = page * perPage;
        res.status(HTTP_STATUS.OK);
        return next({
          items: items.slice(start, start + perPage).map(toStagePackageVersion),
          page,
          perPage,
          // the count the CLI paginates against: after filtering, before slicing
          total: items.length,
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  /** Inspect a single staged version. */
  router.get(
    STAGE_API_ENDPOINTS.item,
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      try {
        const record = await loadRecord(req);
        res.status(HTTP_STATUS.OK);
        return next(toStagePackageVersion(record));
      } catch (err) {
        return next(err);
      }
    }
  );

  /** Download the staged tarball so a maintainer can inspect it before approving. */
  router.get(
    STAGE_API_ENDPOINTS.tarball,
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const abort = new AbortController();
      try {
        const record = await loadRecord(req);
        const stream: any = await stageStorage.readTarball(record.id, { signal: abort.signal });

        stream.on('content-length', (size: number) => {
          res.header(HEADER_TYPE.CONTENT_LENGTH, String(size));
        });
        stream.once('error', (err: any) => {
          res.locals.report_error(err);
          next(err);
        });
        req.on('aborted', () => abort.abort());

        res.header(HEADERS.CONTENT_TYPE, HEADERS.OCTET_STREAM);
        stream.pipe(res);
      } catch (err: any) {
        res.locals.report_error(err);
        return next(err);
      }
    }
  );

  /**
   * Approve a staged version and publish it for real.
   *
   * The tarball is read back and re-attached so the regular publish path runs
   * untouched: upstream conflict checks, dist-tag merging, filters and hooks all
   * behave exactly as they do for `npm publish`.
   */
  router.post(
    STAGE_API_ENDPOINTS.approve,
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const abort = new AbortController();
      try {
        const record = await loadRecord(req);
        if (!(await canPublish(auth, record.packageName, req.remote_user))) {
          return next(errorUtils.getForbidden(API_ERROR.UNAUTHORIZED_ACCESS));
        }

        const packument = await stageStorage.getPackument(record.id);
        if (!packument) {
          return next(errorUtils.getNotFound('no such staged package version'));
        }

        const stream = await stageStorage.readTarball(record.id, { signal: abort.signal });
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(chunk as Buffer);
        }
        const tarball = Buffer.concat(chunks);

        const manifest = {
          ...packument,
          _attachments: {
            [record.tarballFilename]: {
              content_type: HEADERS.OCTET_STREAM,
              data: tarball.toString('base64'),
              length: tarball.length,
            },
          },
        } as Manifest;

        await storage.updateManifest(manifest, {
          name: record.packageName,
          revision: undefined,
          signal: abort.signal,
          requestOptions: getRequestOptions(req),
          uplinksLook: false,
        });

        // the staged copy is only dropped once the version is really published
        await stageStorage.remove(record.id);

        void notify(
          manifest,
          config,
          req.remote_user,
          `${record.packageName}@${record.version}`,
          'publish'
        ).catch((error: any) => {
          logger.error({ error: error?.message }, 'notify batch service has failed: @{error}');
        });

        logger.info(
          { packageName: record.packageName, version: record.version, stageId: record.id },
          'approved staged @{packageName}@@{version} (@{stageId})'
        );

        res.status(HTTP_STATUS.CREATED);
        return next({ message: 'Package version approved and published successfully.' });
      } catch (err) {
        return next(err);
      }
    }
  );

  /** Reject a staged version, dropping the record and its tarball. */
  router.delete(
    STAGE_API_ENDPOINTS.item,
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      try {
        const record = await loadRecord(req);
        if (!(await canPublish(auth, record.packageName, req.remote_user))) {
          return next(errorUtils.getForbidden(API_ERROR.UNAUTHORIZED_ACCESS));
        }

        await stageStorage.remove(record.id);
        logger.info(
          { packageName: record.packageName, version: record.version, stageId: record.id },
          'rejected staged @{packageName}@@{version} (@{stageId})'
        );

        // `npm stage reject` sends `ignoreBody: true`; answering through `next()`
        // would make the final middleware serialize a body onto a 204.
        res.status(HTTP_STATUS.NO_CONTENT).end();
      } catch (err) {
        return next(err);
      }
    }
  );
}
