var express = require('express');
var cookies = require('cookies');
var proxy = require('./proxy');
var utils = require('./utils');
var storage = require('./storage');

function validate_name(req, res, next, value, name) {
	if (utils.validate_name(req.params.package)) {
		req.params.package = String(req.params.package);
		next();
	} else {
		next(new Error({
			status: 403,
			msg: 'invalid package name',
		}));
	}
};

function media(expect) {
	return function(req, res, next) {
		if (req.headers['content-type'] !== expect) {
			next(new Error({
				status: 415,
				msg: 'wrong content-type, we expect '+expect,
			}));
		} else {
			next();
		}
	}
}

function expect_json(req, res, next) {
	if (typeof(req.body) !== 'object') {
		return next({
			status: 400,
			msg: 'can\'t parse incoming json',
		});
	}
	next();
}

module.exports = function(settings) {
	var app = express();
	app.use(express.logger());
	app.use(express.bodyParser());
	app.param('package', validate_name);
	app.param('filename', validate_name);

/*	app.get('/', function(req, res) {
		res.send({
			error: 'unimplemented'
		});
	});*/

	app.get('/:package', function(req, res, next) {
		storage.get_package(req.params.package, function(err, info) {
			if (err) {
				if (err.status === 404) {
					return proxy.request(req, res);
				} else {
					return next(err);
				}
			}
			res.send(info);
		});
	});

	app.get('/:package/-/:filename', function(req, res, next) {
		storage.get_tarball(req.params.package, req.params.filename, function(err, stream) {
			if (err) return next(err);
			if (!stream) {
				return next({
					status: 404,
					msg: 'package not found'
				});
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
		res.send({"ok":true,"name":"anonymous","roles":[]});
	});

	// publishing a package
	app.put('/:package', media('application/json'), expect_json, function(req, res, next) {
		var name = req.params.package;
		try {
			var metadata = utils.validate_metadata(req.body, name);
		} catch(err) {
			return next({
				status: 422,
				msg: 'bad incoming package data',
			});
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
	app.put('/:package/-/:filename/*', media('application/octet-stream'), function(req, res, next) {
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
	app.put('/:package/:version/-tag/:tag', media('application/json'), expect_json, function(req, res, next) {
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

