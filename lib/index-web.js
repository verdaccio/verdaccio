var async         = require('async')
var bodyParser    = require('body-parser')
var Cookies       = require('cookies')
var express       = require('express')
var fs            = require('fs')
var Handlebars    = require('handlebars')
var renderReadme  = require('render-readme')
var Search        = require('./search')
var Middleware    = require('./middleware')
var match         = Middleware.match
var validate_name = Middleware.validate_name
var validate_pkg  = Middleware.validate_package

module.exports = function(config, auth, storage) {
  var app = express.Router()
  var can = Middleware.allow(auth)

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package',  validate_pkg)
  app.param('filename', validate_name)
  app.param('version',  validate_name)
  app.param('anything', match(/.*/))

  app.use(Cookies.express())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(auth.cookie_middleware())
  app.use(function(req, res, next) {
    // disable loading in frames (clickjacking, etc.)
    res.header('X-Frame-Options', 'deny')
    next()
  })

  Search.configureStorage(storage)

  Handlebars.registerPartial('entry', fs.readFileSync(require.resolve('./GUI/entry.hbs'), 'utf8'))

  if(config.web && config.web.template) {
    var template = Handlebars.compile(fs.readFileSync(config.web.template, 'utf8'));
  }
  else {
    var template = Handlebars.compile(fs.readFileSync(require.resolve('./GUI/index.hbs'), 'utf8'))
  }
  app.get('/', function(req, res, next) {
    var base = config.url_prefix
             ? config.url_prefix.replace(/\/$/, '')
             : req.protocol + '://' + req.get('host')
    res.setHeader('Content-Type', 'text/html')

    storage.get_local(function(err, packages) {
      if (err) throw err // that function shouldn't produce any
      async.filterSeries(packages, function(package, cb) {
        auth.allow_access(package.name, req.remote_user, function(err, allowed) {
          setImmediate(function () {
            if (err) {
              cb(null, false);
            } else {
              cb(err, allowed)
            }
          })
        })
      }, function(err, packages) {
        if (err) throw err
        packages.sort(function(p1, p2) {
          if (p1.name < p2.name) {
            return -1;
          }
          else {
            return 1;
          }
        });

        next(template({
          name:       config.web && config.web.title ? config.web.title : 'Verdaccio',
          packages:   packages,
          baseUrl:    base,
          username:   req.remote_user.name,
        }))
      })
    })
  })

  // Static
  app.get('/-/static/:filename', function(req, res, next) {
    var file = __dirname + '/static/' + req.params.filename
    res.sendFile(file, function(err) {
      if (!err) return
      if (err.status === 404) {
        next()
      } else {
        next(err)
      }
    })
  })

  app.get('/-/logo', function(req, res, next) {
    res.sendFile( config.web && config.web.logo
                ? config.web.logo
                : __dirname + '/static/logo-sm.png' )
  })

  app.post('/-/login', function(req, res, next) {
    auth.authenticate(req.body.user, req.body.pass, function(err, user) {
      if (!err) {
        req.remote_user = user
        //res.cookies.set('token', auth.issue_token(req.remote_user))

        var str = req.body.user + ':' + req.body.pass
        res.cookies.set('token', auth.aes_encrypt(str).toString('base64'))
      }

      var base = config.url_prefix
               ? config.url_prefix.replace(/\/$/, '')
               : req.protocol + '://' + req.get('host')
      res.redirect(base)
    })
  })

  app.post('/-/logout', function(req, res, next) {
    var base = config.url_prefix
             ? config.url_prefix.replace(/\/$/, '')
             : req.protocol + '://' + req.get('host')
    res.cookies.set('token', '')
    res.redirect(base)
  })

  // Search
  app.get('/-/search/:anything', function(req, res, next) {
    var results = Search.query(req.params.anything)
    var packages = []

    var getData = function(i) {
      storage.get_package(results[i].ref, function(err, entry) {
        if (!err && entry) {
          packages.push(entry.versions[entry['dist-tags'].latest])
        }

        if (i >= results.length - 1) {
          next(packages)
        } else {
          getData(i + 1)
        }
      })
    }

    if (results.length) {
      getData(0)
    } else {
      next([])
    }
  })

  app.get('/-/readme/:package/:version?', can('access'), function(req, res, next) {
    storage.get_package(req.params.package, {req: req}, function(err, info) {
      if (err) return next(err)
      next( renderReadme(info.readme || 'ERROR: No README data found!') )
    })
  })
  return app
}
