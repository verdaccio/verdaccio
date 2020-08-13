import { HEADERS } from '@verdaccio/dev-commons';

export default function (route, auth, storage): void {
  // searching packages
  route.get('/-/all(/since)?', function (req, res) {
    let received_end = false;
    let response_finished = false;
    let processing_pkgs = 0;
    let firstPackage = true;

    res.status(200);
    res.set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET);

    /*
     * Offical NPM registry (registry.npmjs.org) no longer return whole database,
     * They only return packages matched with keyword in `referer: search pkg-name`,
     * And NPM client will request server in every search.
     *
     * The magic number 99999 was sent by NPM registry. Modify it may caused strange
     * behaviour in the future.
     *
     * BTW: NPM will not return result if user-agent does not contain string 'npm',
     * See: method 'request' in up-storage.js
     *
     * If there is no cache in local, NPM will request /-/all, then get response with
     * _updated: 99999, 'Date' in response header was Mon, 10 Oct 1983 00:12:48 GMT,
     * this will make NPM always query from server
     *
     * Data structure also different, whel request /-/all, response is an object, but
     * when request /-/all/since, response is an array
     */
    const respShouldBeArray = req.path.endsWith('/since');
    if (!respShouldBeArray) {
      res.set('Date', 'Mon, 10 Oct 1983 00:12:48 GMT');
    }
    const check_finish = function (): void {
      if (!received_end) {
        return;
      }
      if (processing_pkgs) {
        return;
      }
      if (response_finished) {
        return;
      }
      response_finished = true;
      if (respShouldBeArray) {
        res.end(']\n');
      } else {
        res.end('}\n');
      }
    };

    if (respShouldBeArray) {
      res.write('[');
    } else {
      res.write('{"_updated":' + 99999);
    }

    const stream = storage.search(req.query.startkey || 0, { req: req });

    stream.on('data', function each(pkg) {
      processing_pkgs++;

      auth.allow_access({ packageName: pkg.name }, req.remote_user, function (err, allowed) {
        processing_pkgs--;

        if (err) {
          if (err.status && String(err.status).match(/^4\d\d$/)) {
            // auth plugin returns 4xx user error,
            // that's equivalent of !allowed basically
            allowed = false;
          } else {
            stream.abort(err);
          }
        }

        if (allowed) {
          if (respShouldBeArray) {
            res.write(`${firstPackage ? '' : ','}${JSON.stringify(pkg)}\n`);
            if (firstPackage) {
              firstPackage = false;
            }
          } else {
            res.write(',\n' + JSON.stringify(pkg.name) + ':' + JSON.stringify(pkg));
          }
        }

        check_finish();
      });
    });

    stream.on('error', function () {
      res.socket.destroy();
    });

    stream.on('end', function () {
      received_end = true;
      check_finish();
    });
  });
}
