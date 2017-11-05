'use strict';

const _ = require('lodash');
const Path = require('path');
const createError = require('http-errors');

const Middleware = require('../../web/middleware');
const Notify = require('../../../lib/notify');
const Utils = require('../../../lib/utils');
const mime = require('mime');

const media = Middleware.media;
const expect_json = Middleware.expect_json;
const notify = Notify.notify;

module.exports = function(router, auth, storage, config) {
  const can = Middleware.allow(auth);

  // publishing a package
  router.put('/:package/:_rev?/:revision?', can('publish'), media(mime.getType('json')), expect_json, function(req, res, next) {
    const name = req.params.package;
    let metadata;
    const create_tarball = function(filename, data, cb) {
      let stream = storage.add_tarball(name, filename);
      stream.on('error', function(err) {
        cb(err);
      });
      stream.on('success', function() {
        cb();
      });

      // this is dumb and memory-consuming, but what choices do we have?
      stream.end(new Buffer(data.data, 'base64'));
      stream.done();
    };

    const create_version = function(version, data, cb) {
      storage.add_version(name, version, data, null, cb);
    };

    const add_tags = function(tags, cb) {
      storage.merge_tags(name, tags, cb);
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
        return next( createError[400]('unsupported registry call') );
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

        const t2 = Object.keys(metadata.versions)[0];
        metadata.versions[t2].readme = _.isNil(metadata.readme) === false ? String(metadata.readme) : '';
        create_version(t2, metadata.versions[t2], function(err) {
          if (err) {
            return next(err);
          }

          add_tags(metadata['dist-tags'], function(err) {
            if (err) {
              return next(err);
            }
            notify(metadata, config);
            res.status(201);
            return next({ok: ok_message, success: true});
          });
        });
      });
    };

    if (Object.keys(req.body).length === 1 && Utils.is_object(req.body.users)) {
      // 501 status is more meaningful, but npm doesn't show error message for 5xx
      return next( createError[404]('npm star|unstar calls are not implemented') );
    }

    try {
      metadata = Utils.validate_metadata(req.body, name);
    } catch(err) {
      return next( createError[422]('bad incoming package data') );
    }

    if (req.params._rev) {
      storage.change_package(name, metadata, req.params.revision, function(err) {
        after_change(err, 'package changed');
      });
    } else {
      storage.addPackage(name, metadata, function(err) {
        after_change(err, 'created new package');
      });
    }
  });

  // unpublishing an entire package
  router.delete('/:package/-rev/*', can('publish'), function(req, res, next) {
    storage.remove_package(req.params.package, function(err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({ok: 'package removed'});
    });
  });

  // removing a tarball
  router.delete('/:package/-/:filename/-rev/:revision', can('publish'), function(req, res, next) {
    storage.remove_tarball(req.params.package, req.params.filename, req.params.revision, function(err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({ok: 'tarball removed'});
    });
  });

  // uploading package tarball
  router.put('/:package/-/:filename/*', can('publish'), media('application/octet-stream'), function(req, res, next) {
    const name = req.params.package;
    const stream = storage.add_tarball(name, req.params.filename);
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
  router.put('/:package/:version/-tag/:tag', can('publish'), media(mime.getType('json')), expect_json, function(req, res, next) {
    let name = req.params.package;
    let version = req.params.version;
    let tag = req.params.tag;

    storage.add_version(name, version, req.body, tag, function(err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({
        ok: 'package published',
      });
    });
  });
};
