'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _search = require('../../../lib/search');

var _search2 = _interopRequireDefault(_search);

var _utils = require('../../../lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addSearchWebApi(route, storage, auth) {
  // Search package
  route.get('/search/:anything', function (req, res, next) {
    const results = _search2.default.query(req.params.anything);
    const packages = [];

    const getPackageInfo = function (i) {
      storage.getPackage({
        name: results[i].ref,
        callback: (err, entry) => {
          if (!err && entry) {
            auth.allow_access(entry.name, req.remote_user, function (err, allowed) {
              if (err || !allowed) {
                return;
              }

              packages.push(entry.versions[entry[_utils.DIST_TAGS].latest]);
            });
          }

          if (i >= results.length - 1) {
            next(packages);
          } else {
            getPackageInfo(i + 1);
          }
        }
      });
    };

    if (results.length) {
      getPackageInfo(0);
    } else {
      next([]);
    }
  });
}

exports.default = addSearchWebApi;