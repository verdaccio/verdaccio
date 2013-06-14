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
				msg: 'wrong content-type, we expect '+expect,
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

