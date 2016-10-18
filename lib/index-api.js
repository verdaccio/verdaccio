var Cookies       = require('cookies')
var express       = require('express')
var bodyParser    = require('body-parser')
var Error         = require('http-errors')
var Path          = require('path')
var Middleware    = require('./middleware')
var Notify        = require('./notify')
var Utils         = require('./utils')
var expect_json   = Middleware.expect_json
var match         = Middleware.match
var media         = Middleware.media
var validate_name = Middleware.validate_name
var validate_pkg  = Middleware.validate_package

module.exports = function(config, auth, storage) {
  var app = express.Router()
  var can = Middleware.allow(auth)
  var notify = Notify.notify;

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package',  validate_pkg)
  app.param('filename', validate_name)
  app.param('tag',      validate_name)
  app.param('version',  validate_name)
  app.param('revision', validate_name)
  app.param('token',    validate_name)

  // these can't be safely put into express url for some reason
  app.param('_rev',             match(/^-rev$/))
  app.param('org_couchdb_user', match(/^org\.couchdb\.user:/))
  app.param('anything',         match(/.*/))

  app.use(auth.basic_middleware())
  //app.use(auth.bearer_middleware())
  app.use(bodyParser.json({ strict: false, limit: config.max_body_size || '10mb' }))
  app.use(Middleware.anti_loop(config))

  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(function(req, res, next) {
    if (req.url.indexOf('@') != -1) {
      // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
      req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F')
    }
    next()
  })

  // for "npm whoami"
  app.get('/whoami', function(req, res, next) {
    if (req.headers.referer === 'whoami') {
      next({ username: req.remote_user.name })
    } else {
      next('route')
    }
  })
  app.get('/-/whoami', function(req, res, next) {
    next({ username: req.remote_user.name })
  })

  // TODO: anonymous user?
  app.get('/:package/:version?', can('access'), function(req, res, next) {
    storage.get_package(req.params.package, { req: req }, function(err, info) {
      if (err) return next(err)
      info = Utils.filter_tarball_urls(info, req, config)

      var version = req.params.version
      if (!version) return next(info)

      var t = Utils.get_version(info, version)
      if (t != null) return next(t)

      if (info['dist-tags'] != null) {
        if (info['dist-tags'][version] != null) {
          version = info['dist-tags'][version]
          t = Utils.get_version(info, version)
          if (t != null) return next(t)
        }
      }

      return next( Error[404]('version not found: ' + req.params.version) )
    })
  })

  app.get('/:package/-/:filename', can('access'), function(req, res, next) {
    var stream = storage.get_tarball(req.params.package, req.params.filename)
    stream.on('content-length', function(v) {
      res.header('Content-Length', v)
    })
    stream.on('error', function(err) {
      return res.report_error(err)
    })
    res.header('Content-Type', 'application/octet-stream')
    stream.pipe(res)
  })

  // searching packages
  app.get('/-/all/:anything?', function(req, res, next) {
    var received_end      = false
    var response_finished = false
    var processing_pkgs   = 0

    res.status(200)
    res.write('{"_updated":' + Date.now());

    var stream = storage.search(req.query.startkey || 0, { req: req })

    stream.on('data', function each(pkg) {
      processing_pkgs++

      auth.allow_access(pkg.name, req.remote_user, function(err, allowed) {
        processing_pkgs--

        if (err) {
          if (err.status && String(err.status).match(/^4\d\d$/)) {
            // auth plugin returns 4xx user error,
            // that's equivalent of !allowed basically
            allowed = false
          } else {
            stream.abort(err)
          }
        }

        if (allowed) {
          res.write(',\n' + JSON.stringify(pkg.name) + ':' + JSON.stringify(pkg))
        }

        check_finish()
      })
    })

    stream.on('error', function (_err) {
      res.socket.destroy()
    })

    stream.on('end', function () {
      received_end = true
      check_finish()
    })

    function check_finish() {
      if (!received_end) return
      if (processing_pkgs) return
      if (response_finished) return

      response_finished = true
      res.end('}\n')
    }
  })

  // placeholder 'cause npm require to be authenticated to publish
  // we do not do any real authentication yet
  app.post('/_session', Cookies.express(), function(req, res, next) {
    res.cookies.set('AuthSession', String(Math.random()), {
      // npmjs.org sets 10h expire
      expires: new Date(Date.now() + 10*60*60*1000)
    })
    next({ ok: true, name: 'somebody', roles: [] })
  })

  app.get('/-/user/:org_couchdb_user', function(req, res, next) {
    res.status(200)
    next({
      ok: 'you are authenticated as "' + req.remote_user.name + '"',
    })
  })

  app.put('/-/user/:org_couchdb_user/:_rev?/:revision?', function(req, res, next) {
    var token = (req.body.name && req.body.password)
              ? auth.aes_encrypt(req.body.name + ':' + req.body.password).toString('base64')
              : undefined
    if (req.remote_user.name != null) {
      res.status(201)
      return next({
        ok: "you are authenticated as '" + req.remote_user.name + "'",
        //token: auth.issue_token(req.remote_user),
        token: token,
      })
    } else {
      if (typeof(req.body.name) !== 'string' || typeof(req.body.password) !== 'string') {
        if (typeof(req.body.password_sha)) {
          return next( Error[422]('your npm version is outdated\nPlease update to npm@1.4.5 or greater.\nSee https://github.com/rlidwka/sinopia/issues/93 for details.') )
        } else {
          return next( Error[422]('user/password is not found in request (npm issue?)') )
        }
      }
      auth.add_user(req.body.name, req.body.password, function(err, user) {
        if (err) {
          if (err.status >= 400 && err.status < 500) {
            // With npm registering is the same as logging in,
            // and npm accepts only an 409 error.
            // So, changing status code here.
            return next( Error[409](err.message) )
          }
          return next(err)
        }

        req.remote_user = user
        res.status(201)
        return next({
          ok: "user '" + req.body.name + "' created",
          //token: auth.issue_token(req.remote_user),
          token: token,
        })
      })
    }
  })

  app.delete('/-/user/token/*', function(req, res, next) {
    res.status(200)
    next({
      ok: 'Logged out',
    })
  })

  function tag_package_version(req, res, next) {
    if (typeof(req.body) !== 'string') return next('route')

    var tags = {}
    tags[req.params.tag] = req.body
    storage.merge_tags(req.params.package, tags, function(err) {
      if (err) return next(err)
      res.status(201)
      return next({ ok: 'package tagged' })
    })
  }

  // tagging a package
  app.put('/:package/:tag',
      can('publish'), media('application/json'), tag_package_version)

  app.post('/-/package/:package/dist-tags/:tag',
      can('publish'), media('application/json'), tag_package_version)

  app.put('/-/package/:package/dist-tags/:tag',
      can('publish'), media('application/json'), tag_package_version)

  app.delete('/-/package/:package/dist-tags/:tag', can('publish'), function (req, res, next) {
    var tags = {}
    tags[req.params.tag] = null
    storage.merge_tags(req.params.package, tags, function(err) {
      if (err) return next(err)
      res.status(201)
      return next({ ok: 'tag removed' })
    })
  })

  app.get('/-/package/:package/dist-tags', can('access'), function(req, res, next) {
    storage.get_package(req.params.package, { req: req }, function(err, info) {
      if (err) return next(err)

      next(info['dist-tags'])
    })
  })

  app.post('/-/package/:package/dist-tags',
      can('publish'), media('application/json'), expect_json,
      function(req, res, next) {

    storage.merge_tags(req.params.package, req.body, function(err) {
      if (err) return next(err)
      res.status(201)
      return next({ ok: 'tags updated' })
    })
  })

  app.put('/-/package/:package/dist-tags',
      can('publish'), media('application/json'), expect_json,
      function(req, res, next) {

    storage.replace_tags(req.params.package, req.body, function(err) {
      if (err) return next(err)
      res.status(201)
      return next({ ok: 'tags updated' })
    })
  })

  app.delete('/-/package/:package/dist-tags',
      can('publish'), media('application/json'),
      function(req, res, next) {

    storage.replace_tags(req.params.package, {}, function(err) {
      if (err) return next(err)
      res.status(201)
      return next({ ok: 'tags removed' })
    })
  })

  // publishing a package
  app.put('/:package/:_rev?/:revision?', can('publish'), media('application/json'), expect_json, function(req, res, next) {
    var name = req.params.package

    if (Object.keys(req.body).length == 1 && Utils.is_object(req.body.users)) {
      // 501 status is more meaningful, but npm doesn't show error message for 5xx
      return next( Error[404]('npm star|unstar calls are not implemented') )
    }

    try {
      var metadata = Utils.validate_metadata(req.body, name)
    } catch(err) {
      return next( Error[422]('bad incoming package data') )
    }

    if (req.params._rev) {
      storage.change_package(name, metadata, req.params.revision, function(err) {
        after_change(err, 'package changed')
      })
    } else {
      storage.add_package(name, metadata, function(err) {
        after_change(err, 'created new package')
      })
    }

    function after_change(err, ok_message) {
      // old npm behaviour
      if (metadata._attachments == null) {
        if (err) return next(err)
        res.status(201)
        return next({ ok: ok_message })
      }

      // npm-registry-client 0.3+ embeds tarball into the json upload
      // https://github.com/isaacs/npm-registry-client/commit/e9fbeb8b67f249394f735c74ef11fe4720d46ca0
      // issue #31, dealing with it here:

      if (typeof(metadata._attachments) !== 'object'
      ||  Object.keys(metadata._attachments).length !== 1
      ||  typeof(metadata.versions) !== 'object'
      ||  Object.keys(metadata.versions).length !== 1) {

        // npm is doing something strange again
        // if this happens in normal circumstances, report it as a bug
        return next( Error[400]('unsupported registry call') )
      }

      if (err && err.status != 409) return next(err)

      // at this point document is either created or existed before
      var t1 = Object.keys(metadata._attachments)[0]
      create_tarball(Path.basename(t1), metadata._attachments[t1], function(err) {
        if (err) return next(err)

        var t2 = Object.keys(metadata.versions)[0]
        metadata.versions[t2].readme = metadata.readme != null ? String(metadata.readme) : ''
        create_version(t2, metadata.versions[t2], function(err) {
          if (err) return next(err)

          add_tags(metadata['dist-tags'], function(err) {
            if (err) return next(err)
            notify(metadata, config)
            res.status(201)
            return next({ ok: ok_message })
          })
        })
      })
    }

    function create_tarball(filename, data, cb) {
      var stream = storage.add_tarball(name, filename)
      stream.on('error', function(err) {
        cb(err)
      })
      stream.on('success', function() {
        cb()
      })

      // this is dumb and memory-consuming, but what choices do we have?
      stream.end(Buffer(data.data, 'base64'))
      stream.done()
    }

    function create_version(version, data, cb) {
      storage.add_version(name, version, data, null, cb)
    }

    function add_tags(tags, cb) {
      storage.merge_tags(name, tags, cb)
    }
  })

  // unpublishing an entire package
  app.delete('/:package/-rev/*', can('publish'), function(req, res, next) {
    storage.remove_package(req.params.package, function(err) {
      if (err) return next(err)
      res.status(201)
      return next({ ok: 'package removed' })
    })
  })

  // removing a tarball
  app.delete('/:package/-/:filename/-rev/:revision', can('publish'), function(req, res, next) {
    storage.remove_tarball(req.params.package, req.params.filename, req.params.revision, function(err) {
      if (err) return next(err)
      res.status(201)
      return next({ ok: 'tarball removed' })
    })
  })

  // uploading package tarball
  app.put('/:package/-/:filename/*', can('publish'), media('application/octet-stream'), function(req, res, next) {
    var name = req.params.package

    var stream = storage.add_tarball(name, req.params.filename)
    req.pipe(stream)

    // checking if end event came before closing
    var complete = false
    req.on('end', function() {
      complete = true
      stream.done()
    })
    req.on('close', function() {
      if (!complete) {
        stream.abort()
      }
    })

    stream.on('error', function(err) {
      return res.report_error(err)
    })
    stream.on('success', function() {
      res.status(201)
      return next({
        ok: 'tarball uploaded successfully'
      })
    })
  })

  // adding a version
  app.put('/:package/:version/-tag/:tag', can('publish'), media('application/json'), expect_json, function(req, res, next) {
    var name = req.params.package
    var version = req.params.version
    var tag = req.params.tag

    storage.add_version(name, version, req.body, tag, function(err) {
      if (err) return next(err)
      res.status(201)
      return next({ ok: 'package published' })
    })
  })

  return app
}

