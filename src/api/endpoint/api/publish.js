/**
 * @prettier
 * @flow
 */

import _ from 'lodash';
import Path from 'path';
import mime from 'mime';

import { API_MESSAGE, HEADERS, DIST_TAGS, API_ERROR, HTTP_STATUS } from '../../../lib/constants';
import { validateMetadata, isObject, ErrorCode } from '../../../lib/utils';
import { media, expectJson, allow } from '../../middleware';
import { notify } from '../../../lib/notify';
import star from './star';

import type { Router } from 'express';
import type { Config, Callback, MergeTags, Version } from '@verdaccio/types';
import type { IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler } from '../../../../types';
import logger from '../../../lib/logger';

export default function publish(router: Router, auth: IAuth, storage: IStorageHandler, config: Config) {
  const can = allow(auth);

  // publishing a package
  router.put(
    '/:package/:_rev?/:revision?',
    can('publish'),
    media(mime.getType('json')),
    expectJson,
    updatePackage(storage, config),
    publishPackage(storage, config)
  );

  // un-publishing an entire package
  router.delete('/:package/-rev/*', can('unpublish'), unPublishPackage(storage));

  // removing a tarball
  router.delete('/:package/-/:filename/-rev/:revision', can('unpublish'), can('publish'), removeTarball(storage));

  // uploading package tarball
  router.put('/:package/-/:filename/*', can('publish'), media(HEADERS.OCTET_STREAM), uploadPackageTarball(storage));

  // adding a version
  router.put('/:package/:version/-tag/:tag', can('publish'), media(mime.getType('json')), expectJson, addVersion(storage));
}

/**
 * Publish a package
 */
export function publishPackage(storage: IStorageHandler, config: Config) {
  const starApi = star(storage);
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const packageName = req.params.package;
    /**
     * Write tarball of stream data from package clients.
     */
    const createTarball = function(filename: string, data, cb: Callback) {
      const stream = storage.addTarball(packageName, filename);
      stream.on('error', function(err) {
        cb(err);
      });
      stream.on('success', function() {
        cb();
      });
      // this is dumb and memory-consuming, but what choices do we have?
      // flow: we need first refactor this file before decides which type use here
      stream.end(new Buffer(data.data, 'base64'));
      stream.done();
    };

    /**
     * Add new package version in storage
     */
    const createVersion = function(version: string, metadata: Version, cb: Callback) {
      storage.addVersion(packageName, version, metadata, null, cb);
    };

    /**
     * Add new tags in storage
     */
    const addTags = function(tags: MergeTags, cb: Callback) {
      storage.mergeTags(packageName, tags, cb);
    };

    const afterChange = function(error, okMessage, metadata) {
      const metadataCopy = { ...metadata };
      const { _attachments, versions } = metadataCopy;

      // old npm behavior, if there is no attachments
      if (_.isNil(_attachments)) {
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
      if (isObject(_attachments) === false || Object.keys(_attachments).length !== 1 || isObject(versions) === false || Object.keys(versions).length !== 1) {
        // npm is doing something strange again
        // if this happens in normal circumstances, report it as a bug
        return next(ErrorCode.getBadRequest('unsupported registry call'));
      }

      if (error && error.status !== HTTP_STATUS.CONFLICT) {
        return next(error);
      }

      // at this point document is either created or existed before
      const firstAttachmentKey = Object.keys(_attachments)[0];

      createTarball(Path.basename(firstAttachmentKey), _attachments[firstAttachmentKey], function(error) {
        if (error) {
          return next(error);
        }

        const versionToPublish = Object.keys(versions)[0];

        versions[versionToPublish].readme = _.isNil(metadataCopy.readme) === false ? String(metadataCopy.readme) : '';

        createVersion(versionToPublish, versions[versionToPublish], function(error) {
          if (error) {
            return next(error);
          }

          addTags(metadataCopy[DIST_TAGS], async function(error) {
            if (error) {
              return next(error);
            }

            try {
              await notify(metadataCopy, config, req.remote_user, `${metadataCopy.name}@${versionToPublish}`);
            } catch (error) {
              logger.logger.error({ error }, 'notify batch service has failed: @{error}');
            }

            res.status(HTTP_STATUS.CREATED);
            return next({ ok: okMessage, success: true });
          });
        });
      });
    };

    if (Object.prototype.hasOwnProperty.call(req.body, '_rev') && isObject(req.body.users)) {
      return starApi(req, res, next);
    }

    try {
      const metadata = validateMetadata(req.body, packageName);
      if (req.params._rev) {
        storage.changePackage(packageName, metadata, req.params.revision, function(error) {
          afterChange(error, API_MESSAGE.PKG_CHANGED, metadata);
        });
      } else {
        storage.addPackage(packageName, metadata, function(error) {
          afterChange(error, API_MESSAGE.PKG_CREATED, metadata);
        });
      }
    } catch (error) {
      return next(ErrorCode.getBadData(API_ERROR.BAD_PACKAGE_DATA));
    }
  };
}

/**
 * un-publish a package
 */
export function unPublishPackage(storage: IStorageHandler) {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    storage.removePackage(req.params.package, function(err) {
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
export function removeTarball(storage: IStorageHandler) {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    storage.removeTarball(req.params.package, req.params.filename, req.params.revision, function(err) {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.CREATED);
      return next({ ok: API_MESSAGE.TARBALL_REMOVED });
    });
  };
}
/**
 * Adds a new version
 */
export function addVersion(storage: IStorageHandler) {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const { version, tag } = req.params;
    const packageName = req.params.package;

    storage.addVersion(packageName, version, req.body, tag, function(error) {
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
export function uploadPackageTarball(storage: IStorageHandler) {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const packageName = req.params.package;
    const stream = storage.addTarball(packageName, req.params.filename);
    req.pipe(stream);

    // checking if end event came before closing
    let complete = false;
    req.on('end', function() {
      complete = true;
      stream.done();
    });

    req.on('close', function() {
      if (!complete) {
        stream.abort();
      }
    });

    stream.on('error', function(err) {
      return res.report_error(err);
    });

    stream.on('success', function() {
      res.status(HTTP_STATUS.CREATED);
      return next({
        ok: API_MESSAGE.TARBALL_UPLOADED,
      });
    });
  };
}

/**
 * Update a package
 */
export function updatePackage(storage: IStorageHandler, config: Config) {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    if (Object.prototype.hasOwnProperty.call(req.body, '_write')) {
      delete req.body._write;
    } else {
      return next();
    }

    const packageName = req.params.package;
    const metadata = validateMetadata(req.body, packageName);

    storage.changePackage(packageName, metadata, 'deprecate', function(err) {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.OK);
      return next({ ok: API_MESSAGE.PKG_CHANGED, success: true });
    });
  };
}
