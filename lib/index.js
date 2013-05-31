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
		res.status(403);
		return res.send({
			error: 'invalid package name'
		});
	}
};

module.exports = function(settings) {
	var app = express();
	app.use(express.logger());
	app.use(express.bodyParser());
	app.param('package', validate_name);

/*	app.get('/', function(req, res) {
		res.send({
			error: 'unimplemented'
		});
	});*/

	app.get('/:package', function(req, res) {
		storage.get_package(req.params.package, function(err, info) {
			if (err) return next(err);
			if (!info) {
				res.status(404);
				return res.send({
					error: 'package not found'
				});
			}
			res.send(info);
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
	app.put('/:package', function(req, res, next) {
		var name = req.params.package;
		if (req.headers['content-type'] !== 'application/json') {
			res.status(415);
			return res.send({
				error: 'wrong content-type, we expect application/json',
			});
		}
		if (typeof(req.body) !== 'object') {
			res.status(400);
			return res.send({
				error: 'can\'t parse incoming json',
			});
		}

		storage.create_package(name, req.body, function(err, created) {
			if (err) return next(err);
			if (created) {
				res.status(201);
				return res.send({
					ok: 'created new package'
				});
			} else {
				res.status(409);
				return res.send({
					error: 'package already exists'
				});
			}
		});
	});

	// uploading package tarball
	app.put('/:package/-/:filename/*', function(req, res, next) {
		res.status(201);
		return res.send({
			ok: 'tarball uploaded successfully'
		});
	});
	
	// adding a version
	app.put('/:package/:version/-tag/:tag', function(req, res, next) {
		var name = req.params.package;
		if (req.headers['content-type'] !== 'application/json') {
			res.status(415);
			return res.send({
				error: 'wrong content-type, we expect application/json',
			});
		}
		if (typeof(req.body) !== 'object') {
			res.status(400);
			return res.send({
				error: 'can\'t parse incoming json',
			});
		}

		storage.add_version(req.params.package, req.params.version, req.body, function(err, created) {
			if (err) return next(err);
			if (created) {
				res.status(201);
				return res.send({
					ok: 'package published'
				});
			} else {
				res.status(409);
				return res.send({
					error: 'this version already exists'
				});
			}
		});
	});

	return app;
};

