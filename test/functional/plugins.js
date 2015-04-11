require('./lib/startup')

var assert = require('assert')

module.exports = function() {
  var server2 = process.server2

  describe('authentication', function() {
    var authstr

    before(function() {
      authstr = server2.authstr
    })

    it('should not authenticate with wrong password', function(cb) {
      server2.auth('authtest', 'wrongpass', function(res, body) {
        assert.equal(res.statusCode, 409)
        assert.equal(body.error, 'this user already exists')

        server2.whoami(function(username) {
          assert.equal(username, undefined)
          cb()
        })
      })
    })

    it('wrong password handled by plugin', function(cb) {
      server2.auth('authtest2', 'wrongpass', function(res, body) {
        assert.equal(res.statusCode, 409)
        assert.equal(body.error, 'registration is disabled')

        server2.whoami(function(username) {
          assert.equal(username, undefined)
          cb()
        })
      })
    })

    it('right password handled by plugin', function(cb) {
      server2.auth('authtest2', 'blahblah', function(res, body) {
        assert.equal(res.statusCode, 201)
        assert.notEqual(body.ok.indexOf("'authtest2'"), -1)

        server2.whoami(function(username) {
          assert.equal(username, 'authtest2')
          cb()
        })
      })
    })

    after(function() {
      server2.authstr = authstr
    })
  })

  describe('authorization', function() {
    var authstr

    before(function() {
      authstr = server2.authstr
    })

    describe('authtest', function() {
      before(function(cb) {
        server2.auth('authtest', 'test', function(res, body) {
          assert.equal(res.statusCode, 201)
          assert.notEqual(body.ok.indexOf("'authtest'"), -1)
          cb()
        })
      })

      it('access test-auth-allow', function(cb) {
        server2.get_package('test-auth-allow', function(res, body) {
          assert.equal(res.statusCode, 404)
          assert.equal(body.error, 'no such package available')
          cb()
        })
      })

      it('access test-auth-deny', function(cb) {
        server2.get_package('test-auth-deny', function(res, body) {
          assert.equal(res.statusCode, 403)
          assert.equal(body.error, "you're not allowed here")
          cb()
        })
      })

      it('access test-auth-regular', function(cb) {
        server2.get_package('test-auth-regular', function(res, body) {
          assert.equal(res.statusCode, 404)
          assert.equal(body.error, 'no such package available')
          cb()
        })
      })
    })

    describe('authtest2', function() {
      before(function(cb) {
        server2.auth('authtest2', 'blahblah', function(res, body) {
          assert.equal(res.statusCode, 201)
          assert.notEqual(body.ok.indexOf("'authtest2'"), -1)
          cb()
        })
      })

      it('access test-auth-allow', function(cb) {
        server2.get_package('test-auth-allow', function(res, body) {
          assert.equal(res.statusCode, 403)
          assert.equal(body.error, "i don't know anything about you")
          cb()
        })
      })

      it('access test-auth-deny', function(cb) {
        server2.get_package('test-auth-deny', function(res, body) {
          assert.equal(res.statusCode, 403)
          assert.equal(body.error, "i don't know anything about you")
          cb()
        })
      })

      it('access test-auth-regular', function(cb) {
        server2.get_package('test-auth-regular', function(res, body) {
          assert.equal(res.statusCode, 404)
          assert.equal(body.error, 'no such package available')
          cb()
        })
      })
    })

    after(function() {
      server2.authstr = authstr
    })
  })
}

