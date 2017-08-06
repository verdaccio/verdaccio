'use strict';

require('../lib/startup');

let assert = require('assert');

module.exports = function() {
  const server2 = process.server2;
  const requestAuthFail = (user, pass, message) => {
    return server2.auth(user, pass)
      .status(409)
      .body_error(message)
      .then(function() {
        return server2.whoami();
      })
      .then(function(username) {
        assert.equal(username, null);
      });
  };
  const requestAuthOk = (user, pass, regex) => {
    return server2.auth(user, pass)
      .status(201)
      .body_ok(regex)
      .then(function() {
        return server2.whoami();
      })
      .then(function(username) {
        assert.equal(username, user);
      });

  };

  describe('test default authentication', function() {
    let authstr;

    before(function() {
      authstr = server2.authstr;
    });

    it('should not authenticate with wrong password', function() {
      return requestAuthFail('authtest', 'wrongpass', 'this user already exists');
    });

    it('should be wrong password handled by plugin', function() {
      return requestAuthFail('authtest2', 'wrongpass', 'registration is disabled');
    });

    it('should right password handled by plugin', function() {
      return requestAuthOk('authtest2', 'blahblah', /'authtest2'/);
    });

    after(function() {
      server2.authstr = authstr;
    });
  });

  describe('test access authorization', function() {
    let authstr;

    before(function() {
      authstr = server2.authstr;
    });

    describe('access with user authtest', function() {
      before(function() {
        return server2.auth('authtest', 'test')
                 .status(201)
                 .body_ok(/'authtest'/);
      });

      it('access test-auth-allow', function() {
        return server2.getPackage('test-auth-allow')
                 .status(404)
                 .body_error('no such package available');
      });

      it('access test-auth-deny', function() {
        return server2.getPackage('test-auth-deny')
                 .status(403)
                 .body_error('you\'re not allowed here');
      });

      it('access test-auth-regular', function() {
        return server2.getPackage('test-auth-regular')
                 .status(404)
                 .body_error('no such package available');
      });
    });

    describe('access with user authtest2', function() {
      before(function() {
        return server2.auth('authtest2', 'blahblah')
                 .status(201)
                 .body_ok(/'authtest2'/);
      });

      it('access test-auth-allow', function() {
        return server2.getPackage('test-auth-allow')
                 .status(403)
                 .body_error('i don\'t know anything about you');
      });

      it('access test-auth-deny', function() {
        return server2.getPackage('test-auth-deny')
                 .status(403)
                 .body_error('i don\'t know anything about you');
      });

      it('access test-auth-regular', function() {
        return server2.getPackage('test-auth-regular')
                 .status(404)
                 .body_error('no such package available');
      });
    });

    after(function() {
      server2.authstr = authstr;
    });
  });
};

