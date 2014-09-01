var Path = require('path')
  , crypto = require('crypto')
  , UError = require('./error').UError

module.exports = Auth

function Auth(config) {
	if (!(this instanceof Auth)) return new Auth(config)
	this.config = config

	if (config.users_file) {
		this.HTPasswd = require('./htpasswd')(
			Path.resolve(
				Path.dirname(config.self_path),
				config.users_file
			)
		)
	}
}

Auth.prototype.authenticate = function(user, password, cb) {
	if (this.config.users != null && this.config.users[user] != null) {
		// if user exists in this.users, verify password against it no matter what is in htpasswd
		return cb(null, crypto.createHash('sha1').update(password).digest('hex') === this.config.users[user].password ? [user] : null)
	}

	if (!this.HTPasswd) return cb(null, false)
	this.HTPasswd.reload(function() {
		cb(null, this.HTPasswd.verify(user, password) ? [user] : null)
	}.bind(this))
}

Auth.prototype.add_user = function(user, password, cb) {
	if (this.config.users && this.config.users[user]) return cb(new UError({
		status: 403,
		message: 'this user already exists',
	}))

	if (this.HTPasswd) {
		if (this.max_users || this.max_users == null) {
			var max_users = Number(this.max_users || Infinity)
			this.HTPasswd.add_user(user, password, max_users, cb)
			return
		}
	}

	return cb(new UError({
		status: 409,
		message: 'registration is disabled',
	}))
}

Auth.prototype.middleware = function() {
	var self = this
	return function(req, res, _next) {
		req.pause()
		function next(err) {
			req.resume()
			// uncomment this to reject users with bad auth headers
			//return _next.apply(null, arguments)

			// swallow error, user remains unauthorized
			// set remoteUserError to indicate that user was attempting authentication
			if (err) req.remote_user.error = err.message
			return _next()
		}

		if (req.remote_user != null) return next()
		req.remote_user = AnonymousUser()

		var authorization = req.headers.authorization
		if (authorization == null) return next()

		var parts = authorization.split(' ')

		if (parts.length !== 2) return next({
			status: 400,
			message: 'bad authorization header',
		})

		var scheme = parts[0]
		  , credentials = new Buffer(parts[1], 'base64').toString()
		  , index = credentials.indexOf(':')

		if (scheme !== 'Basic' || index < 0) return next({
			status: 400,
			message: 'bad authorization header',
		})

		var user = credentials.slice(0, index)
		  , pass = credentials.slice(index + 1)

		self.authenticate(user, pass, function(err, groups) {
			if (err) return next(err)
			if (groups != null && groups != false) {
				req.remote_user = AuthenticatedUser(user, groups)
				next()
			} else {
				req.remote_user = AnonymousUser()
				next({
					status: 403,
					message: 'bad username/password, access denied',
				})
			}
		})
	}
}

function AnonymousUser() {
	return {
		name: undefined,
		// groups without '@' are going to be deprecated eventually 
		groups: ['@all', '@anonymous', 'all', 'undefined', 'anonymous'],
	}
}

function AuthenticatedUser(name, groups) {
	groups = groups.concat(['@all', '@authenticated', 'all'])
	return {
		name: name,
		groups: groups,
	}
}

