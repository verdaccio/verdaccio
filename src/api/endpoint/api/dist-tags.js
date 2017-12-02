'use strict';

const Middleware = require('../../web/middleware');
const mime = require('mime');
const _ = require('lodash');

const media = Middleware.media;
const expect_json = Middleware.expect_json;

module.exports = function(route, auth, storage) {
  const can = Middleware.allow(auth);
  const tag_package_version = function(req, res, next) {
    if (_.isString(req.body) === false) {
      return next('route');
    }

    let tags = {};
    tags[req.params.tag] = req.body;
    storage.merge_tags(req.params.package, tags, function(err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({ok: 'package tagged'});
    });
  };

  // tagging a package
  route.put('/:package/:tag',
    can('publish'), media(mime.getType('json')), tag_package_version);

  route.post('/-/package/:package/dist-tags/:tag',
    can('publish'), media(mime.getType('json')), tag_package_version);

  route.put('/-/package/:package/dist-tags/:tag',
    can('publish'), media(mime.getType('json')), tag_package_version);

  route.delete('/-/package/:package/dist-tags/:tag', can('publish'), function(req, res, next) {
    const tags = {};
    tags[req.params.tag] = null;
    storage.merge_tags(req.params.package, tags, function(err) {
      if (err) {
        return next(err);
      }
      res.status(201);
      return next({
        ok: 'tag removed',
      });
    });
  });

  route.get('/-/package/:package/dist-tags', can('access'), function(req, res, next) {
    storage.get_package({
      name: req.params.package,
      req,
      callback: function(err, info) {
        if (err) {
          return next(err);
        }

        next(info['dist-tags']);
      },
    });
  });

  route.post('/-/package/:package/dist-tags', can('publish'), media(mime.getType('json')), expect_json,
    function(req, res, next) {
      storage.merge_tags(req.params.package, req.body, function(err) {
        if (err) {
          return next(err);
        }
        res.status(201);
        return next({ok: 'tags updated'});
      });
    });
};
