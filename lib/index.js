var express = require('express')
  , cookies = require('cookies')
  , utils = require('./utils')
  , Storage = require('./storage')
  , Config = require('./config')
  , UError = require('./error').UserError
  , Middleware = require('./middleware')
  , Logger = require('./logger')
  , Cats = require('./status-cats')
  , basic_auth = Middleware.basic_auth
  , validate_name = Middleware.validate_name
  , media = Middleware.media
  , expect_json = Middleware.expect_json

module.exports = function(config_hash) {
	var config = new Config(config_hash)
	  , storage = new Storage(config)

	var can = function(action) {
		return function(req, res, next) {
			if (config['allow_'+action](req.params.package, req.remoteUser)) {
				next()
			} else {
				if (!req.remoteUser) {
					if (req.remoteUserError) {
						var msg = "can't "+action+" restricted package, " + req.remoteUserError
					} else {
						var msg = "can't "+action+" restricted package without auth, did you forget 'npm set always-auth true'?"
					}
					next(new UError({
						status: 403,
						msg: msg,
					}))
				} else {
					next(new UError({
						status: 403,
						msg: 'user '+req.remoteUser+' not allowed to '+action+' it'
					}))
				}
			}
		}
	}

	var app = express()

	// run in production mode by default, just in case
	// it shouldn't make any difference anyway
	app.set('env', process.env.NODE_ENV || 'production')

	function error_reporting_middleware(req, res, next) {
		var calls = 0
		res.report_error = res.report_error || function(err) {
			calls++
			if (err.status && err.status >= 400 && err.status < 600) {
				if (calls == 1) {
					res.status(err.status)
					res.send({error: err.msg || err.message || 'unknown error'})
				}
			} else {
				Logger.logger.error({err: err}, 'unexpected error: @{!err.message}\n@{err.stack}')
				if (!res.status || !res.send) {
					Logger.logger.error('this is an error in express.js, please report this')
					res.destroy()
				}
				if (calls == 1) {
					res.status(500)
					res.send({error: 'internal server error'})
				}
			}
		}
		next()
	}

	app.use(error_reporting_middleware)
	app.use(Middleware.log_and_etagify)
	app.use(function(req, res, next) {
		res.setHeader('X-Powered-By', config.user_agent)
		next()
	})
	app.use(Cats.middleware)
	app.use(basic_auth(function(user, pass) {
		return config.authenticate(user, pass)
	}))
	app.use(express.json({strict: false}))

	// TODO: npm DO NOT support compression :(
	app.use(express.compress())
	app.use(Middleware.anti_loop(config))

	app.param('package', validate_name)
	app.param('filename', validate_name)

/*	app.get('/', function(req, res) {
		res.send({
			error: 'unimplemented'
		})
	})*/

/*	app.get('/-/all', function(req, res) {
		var https = require('https')
		var JSONStream = require('JSONStream')
		var request = require('request')({
			url: 'https://registry.npmjs.org/-/all',
			ca: require('./npmsslkeys'),
		})
		.pipe(JSONStream.parse('*'))
		.on('data', function(d) {
			console.log(d)
		})
	})*/

	// TODO: anonymous user?
	app.get('/:package/:version?', can('access'), function(req, res, next) {
		storage.get_package(req.params.package, {req: req}, function(err, info) {
			if (err) return next(err)
			info = utils.filter_tarball_urls(info, req, config)

			var version = req.params.version
			if (!version) {
				return res.send(info)
			}

			if (info.versions[version] != null) {
				return res.send(info.versions[version])
			}

			if (info['dist-tags'] != null) {
				if (info['dist-tags'][version] != null) {
					version = info['dist-tags'][version]
					if (info.versions[version] != null) {
						return res.send(info.versions[version])
					}
				}
			}

			return next(new UError({
				status: 404,
				msg: 'version not found: ' + req.params.version
			}))
		})
	})

	app.get('/:package/-/:filename', can('access'), function(req, res, next) {
		var stream = storage.get_tarball(req.params.package, req.params.filename)
		stream.on('error', function(err) {
			return res.report_error(err)
		})
		res.header('content-type', 'application/octet-stream')
		stream.pipe(res)
	})

	//app.get('/*', function(req, res) {
	//	proxy.request(req, res)
	//})

	// placeholder 'cause npm require to be authenticated to publish
	// we do not do any real authentication yet
	app.post('/_session', cookies.express(), function(req, res) {
		res.cookies.set('AuthSession', String(Math.random()), {
			// npmjs.org sets 10h expire
			expires: new Date(Date.now() + 10*60*60*1000)
		})
		res.send({"ok":true,"name":"somebody","roles":[]})
	})

	app.get('/-/user/:argument', function(req, res, next) {
		// can't put 'org.couchdb.user' in route address for some reason
		if (req.params.argument.split(':')[0] !== 'org.couchdb.user') return next('route')
		res.status(200)
		return res.send({
			ok: 'you are authenticated as "' + req.remoteUser + '"',
		})
	})

	app.put('/-/user/:argument', function(req, res, next) {
		// can't put 'org.couchdb.user' in route address for some reason
		if (req.params.argument.split(':')[0] !== 'org.couchdb.user') return next('route')
		res.status(409)
		return res.send({
			error: 'registration is not implemented',
		})
	})

	app.put('/-/user/:argument/-rev/*', function(req, res, next) {
		// can't put 'org.couchdb.user' in route address for some reason
		if (req.params.argument.split(':')[0] !== 'org.couchdb.user') return next('route')

		if (req.remoteUser == null) {
			res.status(403)
			return res.send({
				error: 'bad username/password, access denied',
			})
		}

		res.status(201)
		return res.send({
			ok: 'you are authenticated as "' + req.remoteUser + '"',
		})
	})

	// tagging a package
	app.put('/:package/:tag', can('publish'), media('application/json'), function(req, res, next) {
		if (typeof(req.body) !== 'string') return next('route')

		storage.add_tag(req.params.name, req.body, req.params.tag, function(err) {
			if (err) return next(err)
			res.status(201)
			return res.send({
				ok: 'package tagged'
			})
		})
	})

	// publishing a package
	app.put('/:package/:_rev?/:revision?', can('publish'), media('application/json'), expect_json, function(req, res, next) {
		if (req.params._rev != null && req.params._rev != '-rev') return next('route')
		var name = req.params.package

		if (Object.keys(req.body).length == 1 && utils.is_object(req.body.users)) {
			return next(new UError({
				// 501 status is more meaningful, but npm doesn't show error message for 5xx
				status: 404,
				msg: 'npm star|unstar calls are not implemented',
			}))
		}

		try {
			var metadata = utils.validate_metadata(req.body, name)
		} catch(err) {
			return next(new UError({
				status: 422,
				msg: 'bad incoming package data',
			}))
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
				return res.send({
					ok: ok_message
				})
			}

			// npm-registry-client 0.3+ embeds tarball into the json upload
			// https://github.com/isaacs/npm-registry-client/commit/e9fbeb8b67f249394f735c74ef11fe4720d46ca0
			// issue #31, dealing with it here:

			if (typeof(metadata._attachments) != 'object'
			||  Object.keys(metadata._attachments).length != 1
			||  typeof(metadata.versions) != 'object'
			||  Object.keys(metadata.versions).length != 1) {

				// npm is doing something strange again
				// if this happens in normal circumstances, report it as a bug
				return next(new UError({
					status: 400,
					msg: 'unsupported registry call',
				}))
			}

			if (err && err.status != 409) return next(err)

			// at this point document is either created or existed before
			var t1 = Object.keys(metadata._attachments)[0]
			create_tarball(t1, metadata._attachments[t1], function(err) {
				if (err) return err

				var t2 = Object.keys(metadata.versions)[0]
				create_version(t2, metadata.versions[t2], function(err) {
					if (err) return err

					res.status(201)
					return res.send({
						ok: ok_message
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
			stream.end(new Buffer(data.data, 'base64'))
			stream.done()
		}

		function create_version(version, data, cb) {
			// assume latest tag, it's ignored anyway
			// if you want tags, tag packages explicitly
			storage.add_version(name, version, data, 'latest', cb)
		}
	})

	// unpublishing an entire package
	app.delete('/:package/-rev/*', can('publish'), function(req, res, next) {
		storage.remove_package(req.params.package, function(err) {
			if (err) return next(err)
			res.status(201)
			return res.send({
				ok: 'package removed'
			})
		})
	})

	// removing a tarball
	app.delete('/:package/-/:filename/-rev/:revision', can('publish'), function(req, res, next) {
		storage.remove_tarball(req.params.package, req.params.filename, req.params.revision, function(err) {
			if (err) return next(err)
			res.status(201)
			return res.send({
				ok: 'tarball removed'
			})
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
			return res.send({
				ok: 'tarball uploaded successfully'
			})
		})
	})

	// adding a version
	app.put('/:package/:version/-tag/:tag', can('publish'), media('application/json'), expect_json, function(req, res, next) {
		var name = req.params.package
		  , version = req.params.version
		  , tag = req.params.tag

		storage.add_version(name, version, req.body, tag, function(err) {
			if (err) return next(err)
			res.status(201)
			return res.send({
				ok: 'package published'
			})
		})
	})

	app.use(app.router)
	app.use(function(err, req, res, next) {
		if (typeof(res.report_error) !== 'function') {
			// in case of very early error this middleware may not be loaded before error is generated
			// fixing that
			error_reporting_middleware(req, res, function(){})
		}
		res.report_error(err)
	})

	return app
}

