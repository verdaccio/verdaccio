import buildDebug from 'debug';
import { Router } from 'express';
import _ from 'lodash';
import mime from 'mime';
import Path from 'path';

import { validatioUtils } from '@verdaccio/core';
import { PUBLISH_API_ENDPOINTS, allow, expectJson, media } from '@verdaccio/middleware';
import { Callback, Config, MergeTags, Package, Version } from '@verdaccio/types';

import Auth from '../../../lib/auth';
import { API_ERROR, API_MESSAGE, DIST_TAGS, HEADERS, HTTP_STATUS } from '../../../lib/constants';
import { logger } from '../../../lib/logger';
import { notify } from '../../../lib/notify';
import Storage from '../../../lib/storage';
import { isPublishablePackage } from '../../../lib/storage-utils';
import { ErrorCode, hasDiffOneKey, isObject, isRelatedToDeprecation } from '../../../lib/utils';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../../types';
import star from './star';

const debug = buildDebug('verdaccio:publish');

export default function publish(
  router: Router,
  auth: Auth,
  storage: Storage,
  config: Config
): void {
  const can = allow(auth, {
    beforeAll: (params, message) => logger.trace(params, message),
    afterAll: (params, message) => logger.trace(params, message),
  });

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
   *  2. Compute metadata locally (client side) and send a mutate payload excluding the version to be unpublished
   *    eg: if metadata reflects 1.0.1, 1.0.2 and 1.0.3, the computed metadata won't include 1.0.3.
   *  3. Once the second step has been successfully finished, delete the tarball.
   *
   *  All these steps are consecutive and required, there is no transacions here, if step 3 fails, metadata might
   *  get corrupted.
   *
   *  Note the unpublish call will suffix in the url a /-rev/14-5d500cfce92f90fd revision number, this not
   *  used internally.
   *
   *
   * Example flow of unpublish.
   *
   * npm http fetch GET 200 http://localhost:4873/@scope%2ftest1?write=true 1680ms
     npm http fetch PUT 201 http://localhost:4873/@scope%2ftest1/-rev/14-5d500cfce92f90fd 956606ms attempt #2
     npm http fetch GET 200 http://localhost:4873/@scope%2ftest1?write=true 1601ms
     npm http fetch DELETE 201 http://localhost:4873/@scope%2ftest1/-/test1-1.0.3.tgz/-rev/16-e11c8db282b2d992 19ms
   *
   * 3. Star a package
   *
   * Permissions: start a package depends of the publish and unpublish permissions, there is no specific flag for star or un start.
   * The URL for star is similar to the unpublish (change package format)
   *
   * npm has no enpoint for star a package, rather mutate the metadata and acts as, the difference is the
   * users property which is part of the payload and the body only includes
   *
   * {
		  "_id": pkgName,
	  	"_rev": "3-b0cdaefc9bdb77c8",
		  "users": {
		    [username]: boolean value (true, false)
		  }
	}
   *
   */
  router.put(
    PUBLISH_API_ENDPOINTS.add_package,
    can('publish'),
    media(mime.getType('json')),
    expectJson,
    publishPackage(storage, config, auth)
  );

  /**
   * Un-publishing an entire package.
   *
   * This scenario happens when the first call detect there is only one version remaining
   * in the metadata, then the client decides to DELETE the resource
   * npm http fetch GET 304 http://localhost:4873/@scope%2ftest1?write=true 1076ms (from cache)
     npm http fetch DELETE 201 http://localhost:4873/@scope%2ftest1/-rev/18-d8ebe3020bd4ac9c 22ms
   */
  router.delete(PUBLISH_API_ENDPOINTS.publish_package, can('unpublish'), unPublishPackage(storage));

  // removing a tarball
  router.delete(
    PUBLISH_API_ENDPOINTS.remove_tarball,
    can('unpublish'),
    can('publish'),
    removeTarball(storage)
  );

  // uploading package tarball
  router.put(
    PUBLISH_API_ENDPOINTS.remove_tarball,
    can('publish'),
    media(HEADERS.OCTET_STREAM),
    uploadPackageTarball(storage)
  );

  // only used for development
  if (config._debug) {
    // adding a version
    router.put(
      '/:package/:version/-tag/:tag',
      can('publish'),
      media(mime.getType('json')),
      expectJson,
      addVersion(storage)
    );
  }
}

/**
 * Publish a package
 */
export function publishPackage(storage: Storage, config: Config, auth: Auth): any {
  const starApi = star(storage);
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const packageName = req.params.package;
    debug('publishing or updating a new version for %o', packageName);
    /**
     * Write tarball of stream data from package clients.
     */
    const createTarball = function (filename: string, data, cb: Callback): void {
      const stream = storage.addTarball(packageName, filename);
      stream.on('error', function (err) {
        cb(err);
      });
      stream.on('success', function () {
        cb();
      });
      // this is dumb and memory-consuming, but what choices do we have?
      // flow: we need first refactor this file before decides which type use here
      stream.end(Buffer.from(data.data, 'base64'));
      stream.done();
    };

    /**
     * Add new package version in storage
     */
    const createVersion = function (version: string, metadata: Version, cb: Callback): void {
      storage.addVersion(packageName, version, metadata, null, cb);
    };

    /**
     * Add new tags in storage
     */
    const addTags = function (tags: MergeTags, cb: Callback): void {
      storage.mergeTags(packageName, tags, cb);
    };

    const afterChange = function (error, okMessage, metadata): void {
      const metadataCopy: Package = { ...metadata };

      const { _attachments, versions } = metadataCopy;

      // `npm star` wouldn't have attachments
      // and `npm deprecate` would have attachments as a empty object, i.e {}
      if (_.isNil(_attachments) || JSON.stringify(_attachments) === '{}') {
        if (error) {
          return next(error);
        }
        res.status(HTTP_STATUS.CREATED);
        return next({
          ok: okMessage,
          success: true,
        });
      }

      // npm-registry-client 0.3+ embeds tarball into the json upload
      // https://github.com/isaacs/npm-registry-client/commit/e9fbeb8b67f249394f735c74ef11fe4720d46ca0
      // issue https://github.com/rlidwka/sinopia/issues/31, dealing with it here:
      const isInvalidBodyFormat =
        isObject(_attachments) === false ||
        hasDiffOneKey(_attachments) ||
        isObject(versions) === false ||
        hasDiffOneKey(versions);

      if (isInvalidBodyFormat) {
        // npm is doing something strange again
        // if this happens in normal circumstances, report it as a bug
        logger.info({ packageName }, `wrong package format on publish a package @{packageName}`);
        return next(ErrorCode.getBadRequest(API_ERROR.UNSUPORTED_REGISTRY_CALL));
      }

      if (error && error.status !== HTTP_STATUS.CONFLICT) {
        return next(error);
      }

      // at this point document is either created or existed before
      const [firstAttachmentKey] = Object.keys(_attachments);

      createTarball(
        Path.basename(firstAttachmentKey),
        _attachments[firstAttachmentKey],
        function (error) {
          if (error) {
            return next(error);
          }

          const versionToPublish = Object.keys(versions)[0];
          const versionMetadataToPublish = versions[versionToPublish];

          versionMetadataToPublish.readme =
            _.isNil(versionMetadataToPublish.readme) === false
              ? String(versionMetadataToPublish.readme)
              : '';

          createVersion(versionToPublish, versionMetadataToPublish, function (error) {
            if (error) {
              return next(error);
            }

            addTags(metadataCopy[DIST_TAGS], async function (error) {
              if (error) {
                return next(error);
              }

              try {
                await notify(
                  metadataCopy,
                  config,
                  req.remote_user,
                  `${metadataCopy.name}@${versionToPublish}`
                );
              } catch (error) {
                logger.error({ error }, 'notify batch service has failed: @{error}');
              }

              res.status(HTTP_STATUS.CREATED);
              return next({ ok: okMessage, success: true });
            });
          });
        }
      );
    };

    if (isPublishablePackage(req.body) === false && isObject(req.body.users)) {
      return starApi(req, res, next);
    }

    try {
      const metadata = validatioUtils.normalizeMetadata(req.body, packageName);
      // check _attachments to distinguish publish and deprecate
      if (
        req.params._rev ||
        (isRelatedToDeprecation(req.body) && _.isEmpty(req.body._attachments))
      ) {
        debug('updating a new version for %o', packageName);
        // we check unpublish permissions, an update is basically remove versions
        const remote = req.remote_user;
        auth.allow_unpublish({ packageName }, remote, (error) => {
          if (error) {
            logger.error({ packageName }, `not allowed to unpublish a version for @{packageName}`);
            return next(error);
          }
          storage.changePackage(packageName, metadata, req.params.revision, function (error) {
            afterChange(error, API_MESSAGE.PKG_CHANGED, metadata);
          });
        });
      } else {
        debug('adding a new version for %o', packageName);
        storage.addPackage(packageName, metadata, function (error) {
          afterChange(error, API_MESSAGE.PKG_CREATED, metadata);
        });
      }
    } catch (error) {
      logger.error({ packageName }, 'error on publish, bad package data for @{packageName}');
      return next(ErrorCode.getBadData(API_ERROR.BAD_PACKAGE_DATA));
    }
  };
}

/**
 * un-publish a package
 */
export function unPublishPackage(storage: Storage) {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const packageName = req.params.package;
    debug('unpublishing %o', packageName);
    storage.removePackage(packageName, function (err) {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.CREATED);
      return next({ ok: API_MESSAGE.PKG_REMOVED });
    });
  };
}

/**
 * Delete tarball
 */
export function removeTarball(storage: Storage) {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const packageName = req.params.package;
    const { filename, revision } = req.params;
    debug('removing a tarball for %o-%o-%o', packageName, filename, revision);
    storage.removeTarball(packageName, filename, revision, function (err) {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.CREATED);
      debug('success remove tarball for %o-%o-%o', packageName, filename, revision);
      return next({ ok: API_MESSAGE.TARBALL_REMOVED });
    });
  };
}
/**
 * Adds a new version
 */
export function addVersion(storage: Storage) {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const { version, tag } = req.params;
    const packageName = req.params.package;

    storage.addVersion(packageName, version, req.body, tag, function (error) {
      if (error) {
        return next(error);
      }

      res.status(HTTP_STATUS.CREATED);
      return next({
        ok: API_MESSAGE.PKG_PUBLISHED,
      });
    });
  };
}

/**
 * uploadPackageTarball
 */
export function uploadPackageTarball(storage: Storage) {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const packageName = req.params.package;
    const stream = storage.addTarball(packageName, req.params.filename);
    req.pipe(stream);

    // checking if end event came before closing
    let complete = false;
    req.on('end', function () {
      complete = true;
      stream.done();
    });

    req.on('close', function () {
      if (!complete) {
        stream.abort();
      }
    });

    stream.on('error', function (err) {
      return res.locals.report_error(err);
    });

    stream.on('success', function () {
      res.status(HTTP_STATUS.CREATED);
      return next({
        ok: API_MESSAGE.TARBALL_UPLOADED,
      });
    });
  };
}
