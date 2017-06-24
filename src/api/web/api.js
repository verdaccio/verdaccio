'use strict';

const bodyParser = require('body-parser');
const Cookies = require('cookies');
const express = require('express');
const marked = require('marked');
const Search = require('../../lib/search');
const Middleware = require('./middleware');
const match = Middleware.match;
const validateName = Middleware.validate_name;
const validatePkg = Middleware.validate_package;
const securityIframe = Middleware.securityIframe;
const route = express.Router(); // eslint-disable-line
const async = require('async');

/*
 This file include all verdaccio only API(Web UI), for npm API please see ../endpoint/
*/

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);
  const can = Middleware.allow(auth);

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  route.param('package', validatePkg);
  route.param('filename', validateName);
  route.param('version', validateName);
  route.param('anything', match(/.*/));

  route.use(Cookies.express());
  route.use(bodyParser.urlencoded({extended: false}));
  route.use(auth.cookie_middleware());
  route.use(securityIframe);

  // Get list of all visible package
  route.get('/packages', function(req, res, next) {
    storage.get_local(function(err, packages) {
      if (err) throw err; // that function shouldn't produce any

      async.filterSeries(
        packages,
        function(pkg, cb) {
          auth.allow_access(pkg.name, req.remote_user, function(err, allowed) {
            if (err) {
              cb(null, false);
            } else {
              cb(err, allowed);
            }
          });
        },
        function(err, packages) {
          if (err) throw err;

          packages.sort(function(a, b) {
            if (a.name < b.name) {
              return -1;
            } else {
              return 1;
            }
          });
          next(packages);
        }
      );
    });
  });

  // Get package readme
  route.get('/package/readme(/@:scope?)?/:package/:version?', can('access'), function(req, res, next) {
    let packageName = req.params.package;
    if (req.params.scope) {
      packageName = `@${req.params.scope}/${packageName}`;
    }
    storage.get_package(packageName, {req: req}, function(err, info) {
      if (err) {
        return next(err);
      }
      res.set('Content-Type', 'text/plain');
      next(marked(info.readme || 'ERROR: No README data found!'));
    });
  });

  // Search package
  route.get('/search/:anything', function(req, res, next) {
    const results = Search.query(req.params.anything);
    const packages = [];

    const getPackageInfo = function(i) {
      storage.get_package(results[i].ref, (err, entry) => {
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
      });
    };

    if (results.length) {
      getPackageInfo(0);
    } else {
      next([]);
    }
  });

  route.post('/-/login', function(req, res, next) {
    auth.authenticate(req.body.user, req.body.pass, (err, user) => {
      if (!err) {
        req.remote_user = user;

        let str = req.body.user + ':' + req.body.pass;
        res.cookies.set('token', auth.aes_encrypt(str).toString('base64'));
      }

      let base = config.url_prefix
               ? config.url_prefix.replace(/\/$/, '')
               : req.protocol + '://' + req.get('host');
      res.redirect(base);
    });
  });

  route.post('/-/logout', function(req, res, next) {
    let base = config.url_prefix
             ? config.url_prefix.replace(/\/$/, '')
             : req.protocol + '://' + req.get('host');
    res.cookies.set('token', '');
    res.redirect(base);
  });

  return route;
};
