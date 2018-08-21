'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../../../lib/utils');

var _middleware = require('../../middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function addPackageWebApi(route, storage, auth) {
  const can = (0, _middleware.allow)(auth);

  const checkAllow = (name, remoteUser) => new Promise((resolve, reject) => {
    try {
      auth.allow_access(name, remoteUser, (err, allowed) => {
        if (err) {
          resolve(false);
        } else {
          resolve(allowed);
        }
      });
    } catch (err) {
      reject(err);
    }
  });

  // Get list of all visible package
  route.get('/packages', function (req, res, next) {
    storage.getLocalDatabase((() => {
      var _ref = _asyncToGenerator(function* (err, packages) {
        let processPermissionsPackages = (() => {
          var _ref2 = _asyncToGenerator(function* (packages) {
            const permissions = [];
            for (let pkg of packages) {
              try {
                if (yield checkAllow(pkg.name, req.remote_user)) {
                  permissions.push(pkg);
                }
              } catch (err) {
                throw err;
              }
            }

            return permissions;
          });

          return function processPermissionsPackages(_x3) {
            return _ref2.apply(this, arguments);
          };
        })();

        if (err) {
          throw err;
        }

        next((0, _utils.sortByName)((yield processPermissionsPackages(packages))));
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    })());
  });

  // Get package readme
  route.get('/package/readme/(@:scope/)?:package/:version?', can('access'), function (req, res, next) {
    const packageName = req.params.scope ? (0, _utils.addScope)(req.params.scope, req.params.package) : req.params.package;

    storage.getPackage({
      name: packageName,
      req,
      callback: function (err, info) {
        if (err) {
          return next(err);
        }

        res.set('Content-Type', 'text/plain');
        next((0, _utils.parseReadme)(info.name, info.readme));
      }
    });
  });

  route.get('/sidebar/(@:scope/)?:package', function (req, res, next) {
    const packageName = req.params.scope ? (0, _utils.addScope)(req.params.scope, req.params.package) : req.params.package;

    storage.getPackage({
      name: packageName,
      keepUpLinkData: true,
      req,
      callback: function (err, info) {
        if (_lodash2.default.isNil(err)) {
          let sideBarInfo = _lodash2.default.clone(info);
          sideBarInfo.latest = info.versions[info[_utils.DIST_TAGS].latest];
          sideBarInfo = (0, _utils.deleteProperties)(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
          sideBarInfo = (0, _utils.addGravatarSupport)(sideBarInfo);
          next(sideBarInfo);
        } else {
          res.status(404);
          res.end();
        }
      }
    });
  });
}

exports.default = addPackageWebApi;