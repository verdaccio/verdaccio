'use strict';

module.exports = function(route, auth, storage) {
  // searching packages
  route.get('/-/all(\/since)?', function(req, res) {
    let received_end = false;
    let response_finished = false;
    let processing_pkgs = 0;
    let firstPackage = true;

    res.status(200);

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
    res.set('Date', 'Mon, 10 Oct 1983 00:12:48 GMT');
    const check_finish = function() {
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

    let stream = storage.search(req.query.startkey || 0, {req: req});

    stream.on('data', function each(pkg) {
      processing_pkgs++;

      auth.allow_access(pkg.name, req.remote_user, function(err, allowed) {
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

    stream.on('error', function(_err) {
      res.socket.destroy();
    });

    stream.on('end', function() {
      received_end = true;
      check_finish();
    });
  });
  
  //searching packages
  // GET /-/v1/search?text=string&size=20
  route.get('/-/v1(\/search)?', function(req, res) {
    let received_end = false;
    let response_finished = false;
    let processing_pkgs = 0;
    let firstPackage = true;
    let total = 0;

    res.status(200);

    /*
     * Offical NPM registry (registry.npmjs.org) no longer return whole database,
     * They only return packages matched with keyword in `referer: search pkg-name`,
     * And NPM client will request server in every search.
     *
     * when request /-/v1/search, response is an json {"objects":[{"package": {}}],"total":20,"time":"Mon Dec 04 2017 13:46:30 GMT+0100 (CET)"}
     */
    res.set('Date', 'Mon, 10 Oct 1983 00:12:48 GMT');
    const check_finish = function() {
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
      res.end('],"total":'+total+',"time":"'+new Date().toString()+'"}');
    };
    
    res.write('{"objects":[');
    // startkey >= mtime of module
    let stream = storage.search(req.query.startkey || 0, {req: req});
    let size = req.query.size || -1;
    let text = (req.query.text?req.query.text.split(' '):['']);

    stream.on('data', function each(pkg) {
      processing_pkgs++;

      auth.allow_access(pkg.name, req.remote_user, function(err, allowed) {
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
          let find=[]; // search in name and description and keywords
          let string = pkg.name+pkg.description;
          for (let istr in text) if (string.indexOf(text[istr])>-1) find[text[istr]]=true
          if (Object.keys(find).length !== text.length && pkg.keywords && pkg.keywords.length) 
        	  for (let ikey in pkg.keywords) for (let istr in text) if (pkg.keywords[ikey].indexOf(text[istr])>-1) find[text[istr]]=true

          if (Object.keys(find).length == text.length && (size == -1 || size>=1))
          {
			if (size>0) size--;
			res.write(`${firstPackage ? '{"package":' : ',{"package":'}${JSON.stringify(standardizePkg(pkg))}}`);
			//res.write(`${firstPackage ? '{"package":' : ',{"package":'}${JSON.stringify(pkg)},"flags":{"unstable":true},"score":{"final":0.144979397377621,"detail":{"quality":0.30431600667044645,"popularity":0.0033870077459281825,"maintenance":0.1499975504726063}},"searchScore":1.5267507e-13}`);
			total++;
			if (firstPackage) {
			  firstPackage = false;
			}
          }
        }

        check_finish();
      });
    });

    stream.on('error', function(_err) {
      res.socket.destroy();
    });

    stream.on('end', function() {
      received_end = true;
      check_finish();
    });
  });
};

function standardizePkg (data) {
  return {
    name: data.name,
    description: data.description,
    maintainers: (data.maintainers || []).map(function (m) {
      return { username: m.name, email: m.email }
    }),
    keywords: data.keywords || [],
    version: Object.keys(data.versions || {})[0] || [],
    date: (
      data.time &&
      data.time.modified &&
      new Date(data.time.modified)
    ) || null
  }
}
