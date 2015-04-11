require('./lib/startup')

var assert = require('assert')

module.exports = function() {
  var server2 = process.server2

  describe('authentication', function() {
    var authstr

    before(function() {
      authstr = server2.authstr
    })

    it('should not authenticate with wrong password', function () {
      return server2.auth('authtest', 'wrongpass')
               .status(409)
               .body_error('this user already exists')
               .then(function () {
                 return server2.whoami()
               })
               .then(function (username) {
                 assert.equal(username, null)
               })
    })

    it('wrong password handled by plugin', function () {
      return server2.auth('authtest2', 'wrongpass')
               .status(409)
               .body_error('registration is disabled')
               .then(function () {
                 return server2.whoami()
               })
               .then(function (username) {
                 assert.equal(username, null)
               })
    })

    it('right password handled by plugin', function () {
      return server2.auth('authtest2', 'blahblah')
               .status(201)
               .body_ok(/'authtest2'/)
               .then(function () {
                 return server2.whoami()
               })
               .then(function (username) {
                 assert.equal(username, 'authtest2')
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
      before(function () {
        return server2.auth('authtest', 'test')
                 .status(201)
                 .body_ok(/'authtest'/)
      })

      it('access test-auth-allow', function () {
        return server2.get_package('test-auth-allow')
                 .status(404)
                 .body_error('no such package available')
      })

      it('access test-auth-deny', function () {
        return server2.get_package('test-auth-deny')
                 .status(403)
                 .body_error("you're not allowed here")
      })

      it('access test-auth-regular', function () {
        return server2.get_package('test-auth-regular')
                 .status(404)
                 .body_error('no such package available')
      })
    })

    describe('authtest2', function() {
      before(function () {
        return server2.auth('authtest2', 'blahblah')
                 .status(201)
                 .body_ok(/'authtest2'/)
      })

      it('access test-auth-allow', function () {
        return server2.get_package('test-auth-allow')
                 .status(403)
                 .body_error("i don't know anything about you")
      })

      it('access test-auth-deny', function () {
        return server2.get_package('test-auth-deny')
                 .status(403)
                 .body_error("i don't know anything about you")
      })

      it('access test-auth-regular', function () {
        return server2.get_package('test-auth-regular')
                 .status(404)
                 .body_error('no such package available')
      })
    })

    after(function() {
      server2.authstr = authstr
    })
  })
}

