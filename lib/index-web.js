'use strict';

let async = require('async');
let bodyParser = require('body-parser');
let Cookies = require('cookies');
let express = require('express');
let fs = require('fs');
let Handlebars = require('handlebars');
let renderReadme = require('render-readme');
let Search = require('./search');
let Middleware = require('./middleware');
let match = Middleware.match;
let validate_name = Middleware.validate_name;
let validate_pkg = Middleware.validate_package;

module.exports = function(config, auth, storage) {
  let app = express.Router();
  let can = Middleware.allow(auth);

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package', validate_pkg);
  app.param('filename', validate_name);
  app.param('version', validate_name);
  app.param('anything', match(/.*/));

  app.use(Cookies.express());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(auth.cookie_middleware());
  app.use(function(req, res, next) {
    // disable loading in frames (clickjacking, etc.)
    res.header('X-Frame-Options', 'deny');
    next();
  });

  Search.configureStorage(storage);

  Handlebars.registerPartial('entry', fs.readFileSync(require.resolve('./GUI/entry.hbs'), 'utf8'));
  let template;
  if (config.web && config.web.template) {
    template = Handlebars.compile(fs.readFileSync(config.web.template, 'utf8'));
  } else {
    template = Handlebars.compile(fs.readFileSync(require.resolve('./GUI/index.hbs'), 'utf8'));
  }
  app.get('/', function(req, res, next) {
    let base = config.url_prefix
             ? config.url_prefix.replace(/\/$/, '')
             : req.protocol + '://' + req.get('host');
    res.setHeader('Content-Type', 'text/html');

    storage.get_local(function(err, packages) {
      if (err) throw err; // that function shouldn't produce any
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

        next(template({
          name: config.web && config.web.title ? config.web.title : 'Verdaccio',
          tagline: config.web && config.web.tagline ? config.web.tagline : '',
          packages: packages,
          baseUrl: base,
          username: req.remote_user.name,
        }));
      });
    });
  });

  // Static
  app.get('/-/static/:filename', function(req, res, next) {
    let file = __dirname + '/static/' + req.params.filename;
    res.sendFile(file, function(err) {
      if (!err) return;
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
    auth.authenticate(req.body.user, req.body.pass, function(err, user) {
      if (!err) {
        req.remote_user = user;
        // res.cookies.set('token', auth.issue_token(req.remote_user))

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
      storage.get_package(results[i].ref, function(err, entry) {
        if (!err && entry) {
          auth.allow_access(entry.name, req.remote_user, function(err, allowed) { // TODO: This may cause performance issue?
            if (err || !allowed) return;

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
    if (req.params.scope) packageName = '@'+ req.params.scope + '/' + packageName;
    storage.get_package(packageName, {req: req}, function(err, info) {
      if (err) return next(err);
      next( renderReadme(info.readme || 'ERROR: No README data found!') );
    });
  });
  return app;
};
