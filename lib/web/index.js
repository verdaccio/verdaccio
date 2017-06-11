'use strict';

const async = require('async');
const escape = require('js-string-escape');
const bodyParser = require('body-parser');
const Cookies = require('cookies');
const express = require('express');
const fs = require('fs');
const Handlebars = require('handlebars');
const marked = require('marked');
const Search = require('../search');
const Middleware = require('./middleware');
const Utils = require('../utils');
const match = Middleware.match;
const validateName = Middleware.validate_name;
const validatePkg = Middleware.validate_package;
const securityIframe = Middleware.securityIframe;

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);
  /* eslint new-cap:off */
  const app = express.Router();
  /* eslint new-cap:off */
  const can = Middleware.allow(auth);
  let template;

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

  Handlebars.registerPartial('entry', fs.readFileSync(require.resolve('./ui/entry.hbs'), 'utf8'));

  if (config.web && config.web.template) {
    template = Handlebars.compile(fs.readFileSync(config.web.template, 'utf8'));
  } else {
    template = Handlebars.compile(fs.readFileSync(require.resolve('./ui/index.hbs'), 'utf8'));
  }

  app.get('/', function(req, res, next) {
    let proto = req.get('X-Forwarded-Proto') || req.protocol;
    let base = Utils.combineBaseUrl(proto, req.get('host'), config.url_prefix);
    res.setHeader('Content-Type', 'text/html');

    storage.get_local(function(err, packages) {
      if (err) {
        throw err;
      } // that function shouldn't produce any
      async.filterSeries(packages, function(pkg, cb) {
        auth.allow_access(pkg.name, req.remote_user, function(err, allowed) {
          setImmediate(function() {
            if (err) {
              cb(null, false);
            } else {
              cb(err, allowed);
            }
          });
        });
      }, function(err, packages) {
        if (err) throw err;
        packages.sort(function(p1, p2) {
          if (p1.name < p2.name) {
            return -1;
          } else {
            return 1;
          }
        });
        let json = {
          packages: packages,
          tagline: config.web && config.web.tagline ? config.web.tagline : '',
          baseUrl: base,
          username: req.remote_user.name,
        };
        next(template({
          name: config.web && config.web.title ? config.web.title : 'Verdaccio',
          data: escape(JSON.stringify(json)),
        }));
      });
    });
  });

  // Static
  app.get('/-/static/:filename', function(req, res, next) {
    let file = __dirname + '/static/' + req.params.filename;
    res.sendFile(file, function(err) {
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

  app.get('/-/logo', function(req, res, next) {
    res.sendFile( config.web && config.web.logo
                ? config.web.logo
                : __dirname + '/static/logo-sm.png' );
  });

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
