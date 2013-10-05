var express = require('express');
var cookies = require('cookies');
var utils = require('./utils');
var Storage = require('./storage');
var Config = require('./config');
var UError = require('./error').UserError;
var basic_auth = require('./middleware').basic_auth;
var validate_name = require('./middleware').validate_name;
var media = require('./middleware').media;
var etagify = require('./middleware').etagify;
var expect_json = require('./middleware').expect_json;

module.exports = function(config_hash) {
	var config = new Config(config_hash);
	var storage = new Storage(config);

	var can = function(action) {
		return function(req, res, next) {
			if (config['allow_'+action](req.params.package, req.remoteUser)) {
				next();
			} else {
				if (req.remoteUser === 'anonymous') {
					next(new UError({
						status: 403,
						msg: "can't "+action+" restricted package without auth, did you forget 'npm set always-auth true'?",
					}));
				} else {
					next(new UError({
						status: 403,
						msg: 'user '+req.remoteUser+' not allowed to '+action+' it'
					}));
				}
			}
		};
	};

	var app = express();
	app.use(express.logger());
	app.use(etagify);
	app.use(basic_auth(function(user, pass) {
		return config.authenticate(user, pass);
	}));
	app.use(express.bodyParser({strict: false}));

	// TODO: npm DO NOT support compression :(
	app.use(express.compress());

	app.param('package', validate_name);
	app.param('filename', validate_name);

/*	app.get('/', function(req, res) {
		res.send({
			error: 'unimplemented'
		});
	});*/

/*	app.get('/-/all', function(req, res) {
		var https = require('https');
		var JSONStream = require('JSONStream');
		var request = require('request')({
			url: 'https://registry.npmjs.org/-/all',
			ca: require('./npmsslkeys'),
		})
		.pipe(JSONStream.parse('*'))
		.on('data', function(d) {
			console.log(d);
		});
	});*/

	// TODO: anonymous user?
	app.get('/:package/:version?', can('access'), function(req, res, next) {
		storage.get_package(req.params.package, function(err, info) {
			if (err) return next(err);
			info = utils.filter_tarball_urls(info, req, config);

			var version = req.params.version;
			if (!version) {
				return res.send(info);
			}

			if (info.versions[version] != null) {
				return res.send(info.versions[version]);
			}

			if (info['dist-tags'] != null) {
				if (info['dist-tags'][version] != null) {
					version = info['dist-tags'][version];
					if (info.versions[version] != null) {
						return res.send(info.versions[version]);
					}
				}
			}

			return next(new UError({
				status: 404,
				msg: 'version not found: ' + req.params.version
			}));
		});
	});

	app.get('/:package/-/:filename', can('access'), function(req, res, next) {
		var stream = storage.get_tarball(req.params.package, req.params.filename);
		stream.on('error', function(err) {
			return next(err);
		});
		res.header('content-type', 'application/octet-stream');
		stream.pipe(res);
	});
	
	//app.get('/*', function(req, res) {
	//	proxy.request(req, res);
	//});
	
	// placeholder 'cause npm require to be authenticated to publish
	// we do not do any real authentication yet
	app.post('/_session', cookies.express(), function(req, res) {
		res.cookies.set('AuthSession', String(Math.random()), {
			// npmjs.org sets 10h expire
			expires: new Date(Date.now() + 10*60*60*1000)
		});
		res.send({"ok":true,"name":"somebody","roles":[]});
	});

	app.get('/-/user/:argument', function(req, res, next) {
		// can't put 'org.couchdb.user' in route address for some reason
		if (req.params.argument.split(':')[0] !== 'org.couchdb.user') return next('route');
		res.status(200);
		return res.send({
			ok: 'you are authenticated as "' + req.user + '"',
		});
	});

	app.put('/-/user/:argument', function(req, res, next) {
		// can't put 'org.couchdb.user' in route address for some reason
		if (req.params.argument.split(':')[0] !== 'org.couchdb.user') return next('route');
		res.status(409);
		return res.send({
			error: 'registration is not implemented',
		});
	});

	app.put('/-/user/:argument/-rev/*', function(req, res, next) {
		// can't put 'org.couchdb.user' in route address for some reason
		if (req.params.argument.split(':')[0] !== 'org.couchdb.user') return next('route');
		res.status(201);
		return res.send({
			ok: 'you are authenticated as "' + req.user + '"',
		});
	});

	// publishing a package
	app.put('/:package', can('publish'), media('application/json'), expect_json, function(req, res, next) {
		var name = req.params.package;

		if (Object.keys(req.body).length == 1 && typeof(req.body.users) === 'object') {
			return next(new UError({
				// 501 status is more meaningful, but npm doesn't show error message for 5xx
				status: 404,
				msg: 'npm star|unstar calls are not implemented',
			}));
		}

		try {
			var metadata = utils.validate_metadata(req.body, name);
		} catch(err) {
			return next(new UError({
				status: 422,
				msg: 'bad incoming package data',
			}));
		}

		storage.add_package(name, metadata, function(err) {
			if (err) return next(err);
			res.status(201);
			return res.send({
				ok: 'created new package'
			});
		});
	});

	// uploading package tarball
	app.put('/:package/-/:filename/*', can('publish'), media('application/octet-stream'), function(req, res, next) {
		var name = req.params.package;

		var stream = storage.add_tarball(name, req.params.filename);
		req.pipe(stream);

		// checking if end event came before closing
		var complete = false;
		req.on('end', function() {
			complete = true;
			stream.done();
		});
		req.on('close', function() {
			if (!complete) {
				stream.abort();
			}
		});

		stream.on('error', function(err) {
			return next(err);
		});
		stream.on('success', function() {
			res.status(201);
			return res.send({
				ok: 'tarball uploaded successfully'
			});
		});
	});
	
	// adding a version
	app.put('/:package/:version/-tag/:tag', can('publish'), media('application/json'), expect_json, function(req, res, next) {
		var name = req.params.package;
		var version = req.params.version;
		var tag = req.params.tag;

		storage.add_version(name, version, req.body, tag, function(err) {
			if (err) return next(err);
			res.status(201);
			return res.send({
				ok: 'package published'
			});
		});
	});

	app.use(app.router);
	app.use(function(err, req, res, next) {
		if (err.status && err.status >= 400 && err.status < 600) {
			res.status(err.status);
			res.send({error: err.msg || err.message || 'unknown error'});
		} else {
			console.log(err);
			console.log(err.stack);
			res.status(500);
			res.send({error: 'internal server error'});
		}
	});

	return app;
};

