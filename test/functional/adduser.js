var assert = require('assert')
var Server = require('./lib/server')

module.exports = function() {
	var server = new Server('http://localhost:55551/')

	describe('adduser', function() {
		var user = String(Math.random())
		var pass = String(Math.random())
		before(function(cb) {
			server.auth(user, pass, function(res, body) {
				assert.equal(res.statusCode, 201)
				assert(body.ok.match(/user .* created/))
				cb()
			})
		})

		it('creating new user', function(){})

		it('should log in', function(cb) {
			server.auth(user, pass, function(res, body) {
				assert.equal(res.statusCode, 201)
				assert(body.ok.match(/you are authenticated as/))
				cb()
			})
		})

		it('should not register more users', function(cb) {
			server.auth(String(Math.random()), String(Math.random()), function(res, body) {
				assert.equal(res.statusCode, 403)
				assert(body.error.match(/maximum amount of users reached/))
				cb()
			})
		})
	})
}
