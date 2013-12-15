var crypto = require('crypto')
  , utils = require('./utils')
  , UError = require('./error').UserError
  , Logger = require('./logger')

module.exports.validate_name = function validate_name(req, res, next, value, name) {
	if (utils.validate_name(value)) {
		next()
	} else {
		next(new UError({
			status: 403,
			msg: 'invalid ' + name,
		}))
	}
}

module.exports.media = function media(expect) {
	return function(req, res, next) {
		if (req.headers['content-type'] !== expect) {
			next(new UError({
				status: 415,
				msg: 'wrong content-type, expect: '+expect+', got: '+req.headers['content-type'],
			}))
		} else {
			next()
		}
	}
}

module.exports.expect_json = function expect_json(req, res, next) {
	if (!utils.is_object(req.body)) {
		return next({
			status: 400,
			msg: 'can\'t parse incoming json',
		})
	}
	next()
}

module.exports.basic_auth = function basic_auth(callback) {
	return function(req, res, _next) {
		function next(err) {
			// uncomment this to reject users with bad auth headers
			//return _next.apply(null, arguments)
			
			// swallow error, user remains unauthorized
			// set remoteUserError to indicate that user was attempting authentication
			if (err) req.remoteUserError = err.msg
			return _next()
		}

		var authorization = req.headers.authorization

		if (req.remoteUser != null) return next()
		if (authorization == null) return next()

		var parts = authorization.split(' ')

		if (parts.length !== 2) return next({
			status: 400,
			msg: 'bad authorization header',
		})

		var scheme = parts[0]
		, credentials = new Buffer(parts[1], 'base64').toString()
		, index = credentials.indexOf(':')

		if ('Basic' != scheme || index < 0) return next({
			status: 400,
			msg: 'bad authorization header',
		})

		var user = credentials.slice(0, index)
		, pass = credentials.slice(index + 1)

		if (callback(user, pass)) {
			req.remoteUser = user
			next()
		} else {
			next({
				status: 403,
				msg: 'bad username/password, access denied',
			})
		}
	}
}

module.exports.anti_loop = function(config) {
	return function(req, res, next) {
		if (req.headers.via != null) {
			var arr = req.headers.via.split(',')
			for (var i=0; i<arr.length; i++) {
				var m = arr[i].match(/\s*(\S+)\s+(\S+)/)
				if (m && m[2] === config.server_id) {
					return next(new UError({
						status: 508,
						msg: 'loop detected',
					}))
				}
			}
		}
		next()
	}
}

// express doesn't do etags with requests <= 1024b
// we use md5 here, it works well on 1k+ bytes, but sucks with fewer data
// could improve performance using crc32 after benchmarks
function md5sum(data) {
	return crypto.createHash('md5').update(data).digest('hex')
}

module.exports.log_and_etagify = function(req, res, next) {
	// logger
	req.log = Logger.logger.child({sub: 'in'})

	var _auth = req.headers.authorization
	if (_auth) req.headers.authorization = '<Classified>'
	req.log.info({req: req, ip: req.ip}, '@{ip} requested \'@{req.method} @{req.url}\'')
	if (_auth) req.headers.authorization = _auth

	var bytesin = 0
	req.on('data', function(chunk){ bytesin += chunk.length })

	var _send = res.send
	res.send = function(body) {
		if (typeof(body) === 'string' || typeof(body) === 'object') {
			res.header('Content-type', 'application/json')

			if (typeof(body) === 'object' && body != null) {
				if (body.error) {
					res._sinopia_error = body.error
				}
				body = JSON.stringify(body, undefined, '\t') + '\n'
			}

			// don't send etags with errors
			if (!res.statusCode || (res.statusCode >= 200 && res.statusCode < 300)) {
				res.header('ETag', '"' + md5sum(body) + '"')
			}
		} else {
			// send(null), send(204), etc.
		}

		res.send = _send
		res.send(body)
	}

	var bytesout = 0
	  , _write = res.write
	res.write = function(buf) {
		bytesout += buf.length
		_write.apply(res, arguments)
	}

	function log() {
		var msg = '@{status}, user: @{user}, req: \'@{request.method} @{request.url}\''
		if (res._sinopia_error) {
			msg += ', error: @{!error}'
		} else {
			msg += ', bytes: @{bytes.in}/@{bytes.out}'
		}
		req.log.warn({
			request: {method: req.method, url: req.url},
			level: 35, // http
			user: req.user,
			status: res.statusCode,
			error: res._sinopia_error,
			bytes: {
				in: bytesin,
				out: bytesout,
			}
		}, msg)
	}

	req.on('close', function() {
		log(true)
	})

	var _end = res.end
	res.end = function(buf) {
		if (buf) bytesout += buf.length
		_end.apply(res, arguments)
		log()
	}
	next()
}

