var Cookies    = require('cookies')
var express    = require('express')
var fs         = require('fs')
var marked     = require('marked')
var Handlebars = require('handlebars')
var Error      = require('http-errors')
var Search     = require('./search')

module.exports = function(config, auth, storage) {
  var app = express()
  app.use(Cookies.express())
  app.use(express.urlencoded())
  app.use(auth.cookie_middleware())
  app.use(function(req, res, next) {
    // disable loading in frames (clickjacking, etc.)
    res.header('X-Frame-Options', 'deny')
    next()
  })

  Search.configureStorage(storage)

  Handlebars.registerPartial('entry', fs.readFileSync(require.resolve('./GUI/entry.hbs'), 'utf8'))
  var template = Handlebars.compile(fs.readFileSync(require.resolve('./GUI/index.hbs'), 'utf8'))

  app.get('/', function(req, res, next) {
    var base = config.url_prefix || req.protocol + '://' + req.get('host')
    res.setHeader('Content-Type', 'text/html')

    storage.get_local(function(err, packages) {
      if (err) throw err // that function shouldn't produce any
      res.send(template({
        name:       config.web.title || 'Sinopia',
        packages:   packages,
        baseUrl:    base,
        username:   req.remote_user.name,
      }))
    })
  })

  // Static
  app.get('/-/static/:filename', function(req, res, next) {
    var file = __dirname + '/static/' + req.params.filename
    res.sendfile(file, function(err) {
      if (!err) return;
      if (err.status === 404) {
        next()
      } else {
        next(err)
      }
    })
  })

  app.get('/-/logo', function(req, res, next) {
    res.sendfile(config.web.logo ? config.web.logo : __dirname + '/static/logo.png')
  })

  app.get('/-/logo-sm', function(req, res, next) {
    res.sendfile(config.web.logosm ? config.web.logosm : __dirname + '/static/logo-sm.png')
  })

  app.post('/-/login', function(req, res, next) {
    var base = config.url_prefix || req.protocol + '://' + req.get('host')
    res.cookies.set('token', Buffer(req.body.user + ':' + req.body.pass).toString('base64'))
    res.redirect(base)
  })

  app.post('/-/logout', function(req, res, next) {
    var base = config.url_prefix || req.protocol + '://' + req.get('host')
    res.cookies.set('token', '')
    res.redirect(base)
  })

  // Search
  app.get('/-/search/:anything', function(req, res, next) {
    var results = Search.query(req.params.anything),
      packages = []

    var getData = function(i) {
      storage.get_package(results[i].ref, function(err, entry) {
        if (!err && entry) {
          packages.push(entry.versions[entry['dist-tags'].latest])
        }

        if (i >= results.length - 1) {
          res.send(packages)
        } else {
          getData(i + 1)
        }
      })
    }

    if (results.length) {
      getData(0)
    } else {
      res.send([])
    }
  })

  // Readme
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value
    }
  })

  app.get('/-/readme/:package/:version?', function(req, res, next) {
    storage.get_package(req.params.package, {req: req}, function(err, info) {
      if (err) return next(err)
      res.send( marked(info.readme || 'ERROR: No README data found!') )
    })
  })
  return app
}

