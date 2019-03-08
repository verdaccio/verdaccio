// @flow

import _ from 'lodash';
import Path from 'path';
import mime from 'mime';

import {API_MESSAGE, HEADERS} from '../../../lib/constants';
import {DIST_TAGS, validate_metadata, isObject, ErrorCode} from '../../../lib/utils';
import {media, expectJson, allow} from '../../middleware';
import {notify} from '../../../lib/notify';
import star from './star';

import type {Router} from 'express';
import type {Config, Callback} from '@verdaccio/types';
import type {IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler} from '../../../../types';
import logger from '../../../lib/logger';

export default function(router: Router, auth: IAuth, storage: IStorageHandler, config: Config) {
  const starApi = star(storage);
  const can = allow(auth);

  // publishing a package
  router.put('/:package/:_rev?/:revision?', can('publish'),
    media(mime.getType('json')), expectJson, function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const name = req.params.package;
    let metadata;
    const create_tarball = function(filename: string, data, cb: Callback) {
      let stream = storage.addTarball(name, filename);
      stream.on('error', function(err) {
        cb(err);
      });
      stream.on('success', function() {
        cb();
      });

      // this is dumb and memory-consuming, but what choices do we have?
      // flow: we need first refactor this file before decides which type use here
      // $FlowFixMe
      stream.end(new Buffer(data.data, 'base64'));
      stream.done();
    };

    const create_version = function(version, data, cb) {
      storage.addVersion(name, version, data, null, cb);
    };

    const add_tags = function(tags, cb) {
      storage.mergeTags(name, tags, cb);
    };

    const after_change = function(err, ok_message) {
      // old npm behaviour
      if (_.isNil(metadata._attachments)) {
        if (err) return next(err);
        res.status(201);
        return next({
          ok: ok_message,
          success: true,
        });
      }

      // npm-registry-client 0.3+ embeds tarball into the json upload
      // https://github.com/isaacs/npm-registry-client/commit/e9fbeb8b67f249394f735c74ef11fe4720d46ca0
      // issue https://github.com/rlidwka/sinopia/issues/31, dealing with it here:

      if (typeof(metadata._attachments) !== 'object'
        || Object.keys(metadata._attachments).length !== 1
        || typeof(metadata.versions) !== 'object'
        || Object.keys(metadata.versions).length !== 1) {
        // npm is doing something strange again
        // if this happens in normal circumstances, report it as a bug
        return next(ErrorCode.getBadRequest('unsupported registry call'));
      }

      if (err && err.status != 409) {
        return next(err);
      }

      // at this point document is either created or existed before
      const t1 = Object.keys(metadata._attachments)[0];
      create_tarball(Path.basename(t1), metadata._attachments[t1], function(err) {
        if (err) {
          return next(err);
        }

        const versionToPublish = Object.keys(metadata.versions)[0];
        metadata.versions[versionToPublish].readme = _.isNil(metadata.readme) === false ? String(metadata.readme) : '';
        create_version(versionToPublish, metadata.versions[versionToPublish], function(err) {
          if (err) {
            return next(err);
          }

          add_tags(metadata[DIST_TAGS], async function(err) {
            if (err) {
              return next(err);
            }

            try {
              await notify(metadata, config, req.remote_user, `${metadata.name}@${versionToPublish}`);
            } catch (err) {
              logger.logger.error({err}, 'notify batch service has failed: @{err}');
            }

            res.status(201);
            return next({ok: ok_message, success: true});
          });
        });
      });
    };
    // star body example: {"_id":"","_rev":"" , users":{}}
    if (Object.keys(req.body).length === 3 && isObject(req.body.users)) {
      return starApi(req, res, next);
    }

    try {
      metadata = validate_metadata(req.body, name);
    } catch (err) {
      return next(ErrorCode.getBadData(`${JSON.stringify(req.body)}bad incoming package data`));
    }

    if (req.params._rev) {
      storage.changePackage(name, metadata, req.params.revision, function(err) {
        after_change(err, API_MESSAGE.PKG_CHANGED);
      });
    } else {
      storage.addPackage(name, metadata, function(err) {
        after_change(err, API_MESSAGE.PKG_CREATED);
      });
    }
  });

  // unpublishing an entire package
  router.delete('/:package/-rev/*', can('publish'), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    storage.removePackage(req.params.package, function(err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({ok: API_MESSAGE.PKG_REMOVED});
    });
  });

  // removing a tarball
  router.delete('/:package/-/:filename/-rev/:revision', can('publish'),
  function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    storage.removeTarball(req.params.package, req.params.filename, req.params.revision, function(err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({ok: API_MESSAGE.TARBALL_REMOVED});
    });
  });

  // uploading package tarball
  router.put('/:package/-/:filename/*', can('publish'), media(HEADERS.OCTET_STREAM),
  function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const name = req.params.package;
    const stream = storage.addTarball(name, req.params.filename);
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
      res.status(201);
      return next({
        ok: 'tarball uploaded successfully',
      });
    });
  });

  // adding a version
  router.put('/:package/:version/-tag/:tag', can('publish'),
     media(mime.getType('json')), expectJson, function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const {version, tag} = req.params;
    const name = req.params.package;

    storage.addVersion(name, version, req.body, tag, function(err) {
      if (err) {
        return next(err);
      }

      res.status(201);
      return next({
        ok: API_MESSAGE.PKG_PUBLISHED,
      });
    });
  });
}
