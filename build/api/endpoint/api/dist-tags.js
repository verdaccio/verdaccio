'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (route, auth, storage) {
  const can = (0, _middleware.allow)(auth);
  const tag_package_version = function (req, res, next) {
    if (_lodash2.default.isString(req.body) === false) {
      return next('route');
    }

    let tags = {};
    tags[req.params.tag] = req.body;
    storage.mergeTags(req.params.package, tags, function (err) {
      if (err) {
        return next(err);
      }
      res.status(_constants.HTTP_STATUS.CREATED);
      return next({ ok: _constants.API_MESSAGE.TAG_ADDED });
    });
  };

  // tagging a package
  route.put('/:package/:tag', can('publish'), (0, _middleware.media)(_mime2.default.getType('json')), tag_package_version);

  route.post('/-/package/:package/dist-tags/:tag', can('publish'), (0, _middleware.media)(_mime2.default.getType('json')), tag_package_version);

  route.put('/-/package/:package/dist-tags/:tag', can('publish'), (0, _middleware.media)(_mime2.default.getType('json')), tag_package_version);

  route.delete('/-/package/:package/dist-tags/:tag', can('publish'), function (req, res, next) {
    const tags = {};
    tags[req.params.tag] = null;
    storage.mergeTags(req.params.package, tags, function (err) {
      if (err) {
        return next(err);
      }
      res.status(_constants.HTTP_STATUS.CREATED);
      return next({
        ok: _constants.API_MESSAGE.TAG_REMOVED
      });
    });
  });

  route.get('/-/package/:package/dist-tags', can('access'), function (req, res, next) {
    storage.getPackage({
      name: req.params.package,
      req,
      callback: function (err, info) {
        if (err) {
          return next(err);
        }

        next(info[_utils.DIST_TAGS]);
      }
    });
  });

  route.post('/-/package/:package/dist-tags', can('publish'), function (req, res, next) {
    storage.mergeTags(req.params.package, req.body, function (err) {
      if (err) {
        return next(err);
      }
      res.status(_constants.HTTP_STATUS.CREATED);
      return next({
        ok: _constants.API_MESSAGE.TAG_UPDATED
      });
    });
  });
};

var _mime = require('mime');

var _mime2 = _interopRequireDefault(_mime);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _middleware = require('../../middleware');

var _utils = require('../../../lib/utils');

var _constants = require('../../../lib/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }