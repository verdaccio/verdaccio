import _ from 'lodash';
import {addGravatarSupport, deleteProperties, sortByName} from '../../../lib/utils';
import {addScope, allow} from '../middleware';
import async from 'async';
import marked from 'marked';

function addPackageWebApi(route, storage, auth) {
  const can = allow(auth);

  // Get list of all visible package
  route.get('/packages', function(req, res, next) {
    storage.getLocalDatabase(function(err, packages) {
      if (err) {
        // that function shouldn't produce any
        throw err;
      }

      async.filterSeries(
        packages,
        function(pkg, cb) {
          auth.allow_access(pkg.name, req.remote_user, function(err, allowed) {
            setImmediate(function() {
              if (err) {
                cb(null, false);
              } else {
                cb(err, allowed);
              }
            });
          });
        },
        function(err, packages) {
          if (err) {
            throw err;
          }

          next(sortByName(packages));
        }
      );
    });
  });

  // Get package readme
  route.get('/package/readme/(@:scope/)?:package/:version?', can('access'), function(req, res, next) {
    const packageName = req.params.scope ? addScope(req.params.scope, req.params.package) : req.params.package;

    storage.getPackage({
      name: packageName,
      req,
      callback: function(err, info) {
        if (err) {
          return next(err);
        }

        res.set('Content-Type', 'text/plain');
        next(marked(info.readme || 'ERROR: No README data found!'));
      },
    });
  });

  route.get('/sidebar/(@:scope/)?:package', function(req, res, next) {
    const packageName = req.params.scope ? addScope(req.params.scope, req.params.package) : req.params.package;

    storage.getPackage({
      name: packageName,
      keepUpLinkData: true,
      req,
      callback: function(err, info) {
        if (_.isNil(err)) {
          info.latest = info.versions[info['dist-tags'].latest];
          info = deleteProperties(['readme', 'versions'], info);
          info = addGravatarSupport(info);
          next(info);
        } else {
          res.status(404);
          res.end();
        }
      },
    });
  });
}

export default addPackageWebApi;
