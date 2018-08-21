'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _search = require('../../lib/search');

var _search2 = _interopRequireDefault(_search);

var _utils = require('../../lib/utils');

var Utils = _interopRequireWildcard(_utils);

var _constants = require('../../lib/constants');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { securityIframe } = require('../middleware');
/* eslint new-cap:off */
const router = _express2.default.Router();
const env = require('../../config/env');
const template = _fs2.default.readFileSync(`${env.DIST_PATH}/index.html`).toString();
const spliceURL = require('../../utils/string').spliceURL;

module.exports = function (config, auth, storage) {
  _search2.default.configureStorage(storage);

  router.use(auth.webUIJWTmiddleware());
  router.use(securityIframe);

  // Static
  router.get('/-/static/:filename', function (req, res, next) {
    const file = `${env.APP_ROOT}/static/${req.params.filename}`;
    res.sendFile(file, function (err) {
      if (!err) {
        return;
      }
      if (err.status === 404) {
        next();
      } else {
        next(err);
      }
    });
  });

  router.get('/-/verdaccio/logo', function (req, res) {
    const installPath = _lodash2.default.get(config, 'url_prefix', '');

    res.send(_lodash2.default.get(config, 'web.logo') || spliceURL(installPath, '/-/static/logo.png'));
  });

  router.get('/', function (req, res) {
    const base = Utils.combineBaseUrl(Utils.getWebProtocol(req), req.get('host'), config.url_prefix);
    let webPage = template.replace(/ToReplaceByVerdaccio/g, base).replace(/ToReplaceByTitle/g, _lodash2.default.get(config, 'web.title') ? config.web.title : _constants.WEB_TITLE).replace(/ToReplaceByScope/g, _lodash2.default.get(config, 'web.scope') ? config.web.scope : '');

    res.setHeader('Content-Type', 'text/html');

    res.send(webPage);
  });

  return router;
};