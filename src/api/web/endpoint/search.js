import Search from '../../../lib/search';

function addSearchWebApi(route, storage, auth) {
  // Search package
  route.get('/search/:anything', function(req, res, next) {
    const results = Search.query(req.params.anything);
    const packages = [];

    const getPackageInfo = function(i) {
      storage.get_package({
        name: results[i].ref,
        callback: (err, entry) => {
          if (!err && entry) {
            auth.allow_access(entry.name, req.remote_user, function(err, allowed) {
              if (err || !allowed) {
                return;
              }

              packages.push(entry.versions[entry['dist-tags'].latest]);
            });
          }

          if (i >= results.length - 1) {
            next(packages);
          } else {
            getPackageInfo(i + 1);
          }
        },
      });
    };

    if (results.length) {
      getPackageInfo(0);
    } else {
      next([]);
    }
  });
}

export default addSearchWebApi;
