var fs = require('fs')
  , crypto = require('crypto')
  , fs_storage = require('./local-fs')
  , UError = require('./error').UserError

try {
	// optional, won't be available on windows
	var crypt3 = require('crypt3')
} catch(err) {
	crypt3 = function() {
		return NaN
	}
}

function parse_htpasswd(input) {
	var result = {}
	input.split('\n').forEach(function(line) {
		var args = line.split(':', 3)
		if (args.length > 1) result[args[0]] = args[1]
	})
	return result
}

function verify_password(user, passwd, hash) {
	if (hash.indexOf('{PLAIN}') === 0) {
		return passwd === hash.substr(7)
	} else if (hash.indexOf('{SHA}') === 0) {
		return crypto.createHash('sha1').update(passwd, 'binary').digest('base64') === hash.substr(5)
	} else {
		return crypt3(passwd, hash) === hash
	}
}

function add_user_to_htpasswd(body, user, passwd) {
	if (user != encodeURIComponent(user)) {
		throw new UError({
			status: 409,
			message: "username shouldn't contain non-uri-safe characters",
		})
	}

	passwd = crypt3(passwd)
	if (!passwd) {
		passwd = '{SHA}' + crypto.createHash('sha1').update(passwd, 'binary').digest('base64')
	}
	var comment = 'autocreated ' + (new Date()).toJSON()

	var newline = user + ':' + passwd + ':' + comment + '\n'
	if (body.length && body[body.length-1] != '\n') newline = '\n' + newline
	return body + newline
}

module.exports = function(path) {
	var result = {}
	var users = {}
	var last_time

	// hopefully race-condition-free way to add users:
	// 1. lock file for writing (other processes can still read)
	// 2. reload .htpasswd
	// 3. write new data into .htpasswd.tmp
	// 4. move .htpasswd.tmp to .htpasswd
	// 5. reload .htpasswd
	// 6. unlock file
	result.add_user = function(user, passwd, maxusers, real_cb) {
		function sanity_check() {
			if (users[user]) {
				return new UError({
					status: 403,
					message: 'this user already exists',
				})
			} else if (Object.keys(users).length >= maxusers) {
				return new UError({
					status: 403,
					message: 'maximum amount of users reached',
				})
			}
		}

		// preliminary checks, just to ensure that file won't be reloaded if it's not needed
		var s_err = sanity_check()
		if (s_err) return real_cb(s_err)

		fs_storage.lock_and_read(path, function(err, fd, res) {
			// callback that cleanups fd first
			function cb(err) {
				if (!fd) return real_cb(err)
				fs.close(fd, function() {
					real_cb(err)
				})
			}

			// ignore ENOENT errors, we'll just create .htpasswd in that case
			if (err && err.code != 'ENOENT') return cb(err)

			var body = (res || '').toString('utf8')
			users = parse_htpasswd(body)

			// real checks, to prevent race conditions
			var s_err = sanity_check()
			if (s_err) return cb(s_err)

			try {
				body = add_user_to_htpasswd(body, user, passwd)
			} catch(err) {
				return cb(err)
			}
			fs_storage.write(path, body, function(err) {
				if (err) return cb(err)
				result.reload(cb)
			})
		})
	}
	result.verify = function(user, passwd) {
		if (!users[user]) return false
		return verify_password(user, passwd, users[user])
	}
	result.reload = function(callback) {
		fs.open(path, 'r', function(err, fd) {
			if (err) return callback(err)
			fs.fstat(fd, function(err, st) {
				if (err) return callback(err)
				if (last_time === st.mtime) return callback()

				var buffer = new Buffer(st.size)
				fs.read(fd, buffer, 0, st.size, null, function(err, bytesRead, buffer) {
					if (err) return callback(err)
					if (bytesRead != st.size) return callback(new Error('st.size != bytesRead'))
					users = parse_htpasswd(buffer.toString('utf8'))
					callback()
				})
			})
		})
	}
	return result
}

// exports for unit tests
module.exports._parse_htpasswd = parse_htpasswd
module.exports._verify_password = verify_password
module.exports._add_user_to_htpasswd = add_user_to_htpasswd
