var Path = require('path')
  , crypto = require('crypto')
  , Error = require('http-errors')
  , Logger = require('./logger')
  , assert = require('assert')

module.exports = Auth

function Auth(config) {
	if (!(this instanceof Auth)) return new Auth(config)
	this.config = config
	this.logger = Logger.logger.child({sub: 'auth'})
	var stuff = {
		config: config,
		logger: this.logger,
	}

	if (config.users_file) {
		if (!config.auth || !config.auth.htpasswd) {
			// b/w compat
			config.auth = config.auth || {}
			config.auth.htpasswd = {file: config.users_file}
		}
	}

	this.plugins = Object.keys(config.auth || {}).map(function(p) {
		var plugin, name
		try {
			name = 'sinopia-' + p
			plugin = require(name)
		} catch(x) {
			try {
				name = p
				plugin = require(name)
			} catch(x) {}
		}

		if (plugin == null) {
			throw Error('"' + p + '" auth plugin not found\n'
				+ 'try "npm install sinopia-' + p + '"')
		}

		if (typeof(plugin) !== 'function')
			throw Error('"' + name + '" doesn\'t look like a valid auth plugin')

		plugin = plugin(config.auth[p], stuff)

		if (plugin == null || typeof(plugin.authenticate) !== 'function')
			throw Error('"' + name + '" doesn\'t look like a valid auth plugin')

		return plugin
	})

	this.plugins.unshift({
		authenticate: function(user, password, cb) {
			if (config.users != null
			 && config.users[user] != null
			 && (crypto.createHash('sha1').update(password).digest('hex')
			      === config.users[user].password)
			) {
				return cb(null, [ user ])
			}

			return cb()
		},

		adduser: function(user, password, cb) {
			if (config.users && config.users[user])
				return cb(Error[403]('this user already exists'))

			return cb()
		},
	})

	this.plugins.push({
		authenticate: function(user, password, cb) {
			return cb(Error[403]('bad username/password, access denied'))
		},

		adduser: function(user, password, cb) {
			return cb(Error[409]('registration is disabled'))
		},
	})
}

Auth.prototype.authenticate = function(user, password, cb) {
	var plugins = this.plugins.slice(0)

	!function next() {
		var p = plugins.shift()
		p.authenticate(user, password, function(err, groups) {
			if (err || groups) return cb(err, groups)
			next()
		})
	}()
}

Auth.prototype.add_user = function(user, password, cb) {
	var plugins = this.plugins.slice(0)

	!function next() {
		var p = plugins.shift()
		var n = 'adduser'
		if (typeof(p[n]) !== 'function') {
			n = 'add_user'
		}
		if (typeof(p[n]) !== 'function') {
			next()
		} else {
			p[n](user, password, function(err, ok) {
				if (err || ok) return cb(err, ok)
				next()
			})
		}
	}()
}

Auth.prototype.auth_middleware = function() {
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

		if (req.remote_user != null && req.remote_user.name !== undefined) return next()
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
			if (!err && groups != null && groups != false) {
				req.remote_user = AuthenticatedUser(user, groups)
				next()
			} else {
				req.remote_user = AnonymousUser()
				next(err)
			}
		})
	}
}

Auth.prototype.cookie_middleware = function() {
	var self = this
	return function(req, res, _next) {
		req.pause()
		function next(err) {
			req.resume()
			return _next()
		}

		if (req.remote_user != null && req.remote_user.name !== undefined) return next()
		req.remote_user = AnonymousUser()

		var cookie = req.cookies.get('token')
		if (cookie == null) return next()

		var credentials = new Buffer(cookie, 'base64').toString()
		var index = credentials.indexOf(':')

		var user = credentials.slice(0, index)
		var pass = credentials.slice(index + 1)

		self.authenticate(user, pass, function(err, groups) {
			if (!err && groups != null && groups != false) {
				req.remote_user = AuthenticatedUser(user, groups)
				next()
			} else {
				req.remote_user = AnonymousUser()
				next(err)
			}
		})
	}
}

function AnonymousUser() {
	return {
		name: undefined,
		// groups without '@' are going to be deprecated eventually 
		groups: ['$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'],
	}
}

function AuthenticatedUser(name, groups) {
	groups = groups.concat(['$all', '$authenticated', '@all', '@authenticated', 'all'])
	return {
		name: name,
		groups: groups,
	}
}

