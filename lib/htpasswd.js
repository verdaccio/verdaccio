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

module.exports = function(path) {
	var result = {}
	var users = {}
	var last_time
	result.add_user = function(user, passwd, cb) {
		// TODO
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

