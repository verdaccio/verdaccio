var crypto = require('crypto');
var utils = require('./utils');
var UError = require('./error').UserError;

module.exports.validate_name = function validate_name(req, res, next, value, name) {
	if (utils.validate_name(req.params.package)) {
		req.params.package = String(req.params.package);
		next();
	} else {
		next(new UError({
			status: 403,
			msg: 'invalid package name',
		}));
	}
};

module.exports.media = function media(expect) {
	return function(req, res, next) {
		if (req.headers['content-type'] !== expect) {
			next(new UError({
				status: 415,
				msg: 'wrong content-type, expect: '+expect+', got: '+req.headers['content-type'],
			}));
		} else {
			next();
		}
	}
}

module.exports.expect_json = function expect_json(req, res, next) {
	if (typeof(req.body) !== 'object') {
		return next({
			status: 400,
			msg: 'can\'t parse incoming json',
		});
	}
	next();
}

module.exports.basic_auth = function basic_auth(callback) {
	return function(req, res, next) {
		var authorization = req.headers.authorization;

		if (req.user) return next();
		if (authorization == null) {
			req.user = req.remoteUser = 'anonymous';
			return next();
		}

		var parts = authorization.split(' ');

		if (parts.length !== 2) return next({
			status: 400,
			msg: 'bad authorization header',
		});

		var scheme = parts[0]
		, credentials = new Buffer(parts[1], 'base64').toString()
		, index = credentials.indexOf(':');

		if ('Basic' != scheme || index < 0) return next({
			status: 400,
			msg: 'bad authorization header',
		});
    
		var user = credentials.slice(0, index)
		, pass = credentials.slice(index + 1);

		if (callback(user, pass)) {
			req.user = req.remoteUser = user;
			next();
		} else {
			next({
				status: 403,
				msg: 'bad username/password, access denied',
			});
		}
	}
};

// express doesn't do etags with requests <= 1024b
// we use md5 here, it works well on 1k+ bytes, but sucks with fewer data
// could improve performance using crc32 after benchmarks
function md5sum(data) {
	return crypto.createHash('md5').update(data).digest('hex');
}

// using it for json only right now
module.exports.etagify = function(req, res, next) {
	var _send = res.send;
	res.send = function(body) {
		if (typeof(body) === 'string' || typeof(body) === 'object') {
			res.header('Content-type', 'application/json');

			if (typeof(body) === 'object') {
				body = JSON.stringify(body, undefined, '\t');
			}
			
			res.header('ETag', '"' + md5sum(body) + '"');
		} else {
			// send(null), send(204), etc.
		}
		_send.call(res, body);
	};
	next();
}

