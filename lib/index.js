var express = require('express');
var cookies = require('cookies');
var utils = require('./utils');
var Storage = require('./storage');
var Config = require('./config');
var UError = require('./error').UserError;
var basic_auth = require('./middleware').basic_auth;
var validate_name = require('./middleware').validate_name;
var media = require('./middleware').media;
var expect_json = require('./middleware').expect_json;

module.exports = function(config_hash) {
	var config = new Config(config_hash);
	var storage = new Storage(config);

	var can = function(action) {
		return function(req, res, next) {
			if (config['allow_'+action](req.params.package, req.remoteUser)) {
				next();
			} else {
				next(new UError({
					status: 403,
					msg: 'user '+req.remoteUser+' not allowed to '+action+' it'
				}));
			}
		};
	};

	var app = express();
	app.use(express.logger());
	app.use(basic_auth(function(user, pass) {
		return config.authenticate(user, pass);
   }));
	app.use(express.bodyParser());

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

			// XXX: in some cases npm calls for /:package and for some cases 
			// for /:package/:version - should investigate that
			if (req.params.version) {
				if (info.versions[req.params.version] != null) {
					info = info.versions[req.params.version];
				} else {
					return next(new UError({
						status: 404,
						msg: 'version not found: ' + req.params.version
					}));
				}
			}
			res.send(info);
		});
	});

	app.get('/:package/-/:filename', can('access'), function(req, res, next) {
		storage.get_tarball(req.params.package, req.params.filename, function(err, stream) {
			if (err) return next(err);
			if (!stream) {
				return next(new UError({
					status: 404,
					msg: 'package not found'
				}));
			}
			res.header('content-type', 'application/octet-stream');
			res.send(stream);
		});
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
			ok: 'hello there'
		});
	});

	app.put('/-/user/:argument', function(req, res, next) {
		// can't put 'org.couchdb.user' in route address for some reason
		if (req.params.argument.split(':')[0] !== 'org.couchdb.user') return next('route');
		res.status(201);
		return res.send({
			ok: 'we don\'t accept new users, but pretend that we do...',
		});
	});

	// publishing a package
	app.put('/:package', can('publish'), media('application/json'), expect_json, function(req, res, next) {
		var name = req.params.package;
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

		storage.add_tarball(name, req.params.filename, req, function(err) {
			if (err) return next(err);
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
		if (err.status && err.msg && err.status >= 400 && err.status < 600) {
			res.status(err.status);
			res.send({error: err.msg});
		} else {
			console.log(err);
			console.log(err.stack);
			res.status(500);
			res.send({error: 'internal server error'});
		}
	});

	return app;
};

