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

/*
 This file include all verdaccio only API(Web UI), for npm API please see ../endpoint/
*/

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);
  /* eslint new-cap:off */
  const app = express.Router();
  /* eslint new-cap:off */
  const can = Middleware.allow(auth);

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package', validatePkg);
  app.param('filename', validateName);
  app.param('version', validateName);
  app.param('anything', match(/.*/));

  app.use(Cookies.express());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(auth.cookie_middleware());
  app.use(securityIframe);

  app.post('/-/login', function(req, res, next) {
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

  app.post('/-/logout', function(req, res, next) {
    let base = config.url_prefix
             ? config.url_prefix.replace(/\/$/, '')
             : req.protocol + '://' + req.get('host');
    res.cookies.set('token', '');
    res.redirect(base);
  });

  // Search
  app.get('/-/search/:anything', function(req, res, next) {
    const results = Search.query(req.params.anything);
    const packages = [];

    const getData = function(i) {
      storage.get_package(results[i].ref, (err, entry) => {
        if (!err && entry) {
          auth.allow_access(entry.name, req.remote_user, function(err, allowed) { // TODO: This may cause performance issue?
            if (err || !allowed) {
              return;
            }

            packages.push(entry.versions[entry['dist-tags'].latest]);
          });
        }

        if (i >= results.length - 1) {
          next(packages);
        } else {
          getData(i + 1);
        }
      });
    };

    if (results.length) {
      getData(0);
    } else {
      next([]);
    }
  });

  app.get('/-/readme(/@:scope?)?/:package/:version?', can('access'), function(req, res, next) {
    let packageName = req.params.package;
    if (req.params.scope) {
      packageName = `@${req.params.scope}/${packageName}`;
    }
    storage.get_package(packageName, {req: req}, function(err, info) {
      if (err) {
        return next(err);
      }
      res.set('Content-Type', 'text/plain');
      next( marked(info.readme || 'ERROR: No README data found!') );
    });
  });
  return app;
};
