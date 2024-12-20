import buildDebug from 'debug';
import { Router } from 'express';
import mime from 'mime';

import { Auth } from '@verdaccio/auth';
import { API_MESSAGE, HTTP_STATUS } from '@verdaccio/core';
import { allow, expectJson, media } from '@verdaccio/middleware';
// import star from './star';
import { PUBLISH_API_ENDPOINTS } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Logger } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

const debug = buildDebug('verdaccio:api:publish');

/**
   * Publish a package / update package / un/start a package
   *
   * There are multiples scenarios here to be considered:
   *
   * 1. Publish scenario
   *
   * Publish a package consist of at least 1 step (PUT) with a metadata payload.
   * When a package is published, an _attachment property is present that contains the data
   * of the tarball.
   *
   * Example flow of publish.
   *
   *  npm http fetch PUT 201 http://localhost:4873/@scope%2ftest1 9627ms
      npm info lifecycle @scope/test1@1.0.1~publish: @scope/test1@1.0.1
      npm info lifecycle @scope/test1@1.0.1~postpublish: @scope/test1@1.0.1
      + @scope/test1@1.0.1
      npm verb exit [ 0, true ]
   *
   *
   * 2. Unpublish scenario
   *
   * Unpublish consist in 3 steps.
   *  1. Try to fetch  metadata -> if it fails, return 404
   *  2. Compute metadata locally (client side) and send a mutate payload excluding the version to
   *    be unpublished
   *    eg: if metadata reflects 1.0.1, 1.0.2 and 1.0.3, the computed metadata won't include 1.0.3.
   *  3. Once the second step has been successfully finished, delete the tarball.
   *
   *  All these steps are consecutive and required, there is no transacions here, if step 3 fails,
   *  metadata might get corrupted.
   *
   *  Note the unpublish call will suffix in the url a /-rev/14-5d500cfce92f90fd revision number,
   *  this not
   *  used internally.
   *
   *
   * Example flow of unpublish.
   *
   * There are two possible flows:
   *
   * - Remove all packages (entirely)
   *   eg: npm unpublish package-name@* --force
   *   eg: npm unpublish package-name  --force
   *
   * npm http fetch GET 200 http://localhost:4873/custom-name?write=true 1680ms
   * npm http fetch DELETE 201 http://localhost:4873/custom-name/-/test1-1.0.3.tgz/-rev/16-e11c8db282b2d992 19ms
   *
   * - Remove a specific version
   *   eg: npm unpublish package-name@1.0.0 --force
   *
   * Get fresh manifest
   * npm http fetch GET 200 http://localhost:4873/custom-name?write=true 1680ms
   * Update manifest without the version to be unpublished
   * npm http fetch PUT 201 http://localhost:4873/custom-name/-rev/14-5d500cfce92f90fd 956606ms
   * Get fresh manifest (revision should be different)
   * npm http fetch GET 200 http://localhost:4873/custom-name?write=true 1601ms
   * Remove the tarball
   * npm http fetch DELETE 201 http://localhost:4873/custom-name/-/test1-1.0.3.tgz/-rev/16-e11c8db282b2d992 19ms
   *
   * 3. Star a package
   *
   * Permissions: staring a package depends of the publish and unpublish permissions, there is no
   * specific flag for star or unstar.
   * The URL for star is similar to the unpublish (change package format)
   *
   * npm has no endpoint for staring a package, rather mutate the metadata and acts as, the difference
   * is the users property which is part of the payload and the body only includes
   *
   * {
		  "_id": pkgName,
	  	"_rev": "3-b0cdaefc9bdb77c8",
		  "users": {
		    [username]: boolean value (true, false)
		  }
	   }
   *
   * 4. Change owners of a package
   *
   * Similar to staring a package, changing owners (maintainers) of a package uses the publish
   * endpoint.
   *
   * The body includes a list of the new owners with the following format
   *
   * {
		  "_id": pkgName,
	  	"_rev": "4-b0cdaefc9bdb77c8",
		  "maintainers": [
        { "name": "first owner", "email": "me@verdaccio.org" },
        { "name": "second owner", "email": "you@verdaccio.org" },
        ...
		  ]
	   }
   *
   */
export default function publish(
  router: Router,
  auth: Auth,
  storage: Storage,
  logger: Logger
): void {
  const can = allow(auth, {
    beforeAll: (a, b) => logger.trace(a, b),
    afterAll: (a, b) => logger.trace(a, b),
  });
  router.put(
    PUBLISH_API_ENDPOINTS.add_package,
    can('publish'),
    media(mime.getType('json')),
    expectJson,
    publishPackage(storage, logger, 'publish one version')
  );

  router.put(
    PUBLISH_API_ENDPOINTS.publish_package,
    can('unpublish'),
    media(mime.getType('json')),
    expectJson,
    publishPackage(storage, logger, 'publish with revision')
  );

  /**
   * Un-publishing an entire package.
   *
   * This scenario happens when any of these scenarios happens:
   *  -  the first call detect there is only one version remaining
   *  -  no version is specified in the unpublish call
   *  -  all versions are removed npm unpublish package@*
   *  -  there is no versions on the metadata

   * then the client decides to DELETE the resource
   * Example:
   * Get fresh manifest (write=true is a flag to get the latest revision)
   * npm http fetch GET 304 http://localhost:4873/package-name?write=true 1076ms (from cache)
   * Send request to delete the package, this includes the revision number that must match
   * and the package name, it will delete the entire package and all tarballs (or tarball depends the scenario)
   * npm http fetch DELETE 201 http://localhost:4873/package-name/-rev/18-d8ebe3020bd4ac9c 22ms
   */
  router.delete(
    PUBLISH_API_ENDPOINTS.publish_package,
    can('unpublish'),
    async function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      const packageName = req.params.package;
      const rev = req.params.revision;
      const username = req?.remote_user?.name;

      logger.debug({ packageName }, `unpublishing @{packageName}`);
      try {
        await storage.removePackage(packageName, rev, username);
        debug('package %s unpublished', packageName);
        res.status(HTTP_STATUS.CREATED);
        return next({ ok: API_MESSAGE.PKG_REMOVED });
      } catch (err) {
        return next(err);
      }
    }
  );

  /*
   Remove a tarball, this happens when npm unpublish a package unique version.
   npm http fetch DELETE 201 http://localhost:4873/package-name/-rev/18-d8ebe3020bd4ac9c 22ms
  */
  router.delete(
    PUBLISH_API_ENDPOINTS.remove_tarball,
    can('unpublish'),
    can('publish'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const packageName = req.params.package;
      const { filename, revision } = req.params;
      const username = req?.remote_user?.name;

      logger.debug(
        { packageName, filename, revision },
        `removing a tarball for @{packageName}-@{tarballName}-@{revision}`
      );
      try {
        await storage.removeTarball(packageName, filename, revision, username);
        res.status(HTTP_STATUS.CREATED);

        logger.debug(
          { packageName, filename, revision },
          `success remove tarball for @{packageName}-@{tarballName}-@{revision}`
        );
        return next({ ok: API_MESSAGE.TARBALL_REMOVED });
      } catch (err) {
        return next(err);
      }
    }
  );
}

export function publishPackage(storage: Storage, logger: Logger, origin: string): any {
  return async function (
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer
  ): Promise<void> {
    debug(origin);
    const ac = new AbortController();
    const packageName = req.params.package;
    const { revision } = req.params;
    debug('publishing package %s', packageName);
    debug('revision %s', revision);
    if (debug.enabled) {
      debug('body %o', req.body);
    }
    const metadata = req.body;
    const username = req?.remote_user?.name;

    debug('publishing package %o for user %o', packageName, username);
    logger.debug(
      { packageName, username },
      'publishing package @{packageName} for user @{username}'
    );

    try {
      const message = await storage.updateManifest(metadata, {
        name: packageName,
        revision,
        signal: ac.signal,
        requestOptions: {
          host: req.hostname,
          protocol: req.protocol,
          headers: req.headers as { [key: string]: string },
          username,
        },
        uplinksLook: false,
      });
      debug('package %s published', packageName);

      res.status(HTTP_STATUS.CREATED);

      return next({
        success: true,
        ok: message,
      });
    } catch (err: any) {
      // TODO: review if we need the abort controller here
      next(err);
    }
  };
}
