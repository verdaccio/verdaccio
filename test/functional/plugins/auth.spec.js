import assert from 'assert';

export default function(server2){
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

  describe('test default authentication', () => {
    let authstr;

    beforeAll(function() {
      authstr = server2.authstr;
    });

    test('should not authenticate with wrong password', () => {
      return requestAuthFail('authtest', 'wrongpass', 'this user already exists');
    });

    test('should be wrong password handled by plugin', () => {
      return requestAuthFail('authtest2', 'wrongpass', 'registration is disabled');
    });

    test('should right password handled by plugin', () => {
      return requestAuthOk('authtest2', 'blahblah', /'authtest2'/);
    });

    afterAll(function() {
      server2.authstr = authstr;
    });
  });

  describe('test access authorization', () => {
    let authstr;

    beforeAll(function() {
      authstr = server2.authstr;
    });

    describe('access with user authtest', () => {
      beforeAll(function() {
        return server2.auth('authtest', 'test')
                 .status(201)
                 .body_ok(/'authtest'/);
      });

      test('access test-auth-allow', () => {
        return server2.getPackage('test-auth-allow')
                 .status(404)
                 .body_error('no such package available');
      });

      test('access test-auth-deny', () => {
        return server2.getPackage('test-auth-deny')
                 .status(403)
                 .body_error('you\'re not allowed here');
      });

      test('access test-auth-regular', () => {
        return server2.getPackage('test-auth-regular')
                 .status(404)
                 .body_error('no such package available');
      });
    });

    describe('access with user authtest2', () => {
      beforeAll(function() {
        return server2.auth('authtest2', 'blahblah')
                 .status(201)
                 .body_ok(/'authtest2'/);
      });

      test('access test-auth-allow', () => {
        return server2.getPackage('test-auth-allow')
                 .status(403)
                 .body_error('i don\'t know anything about you');
      });

      test('access test-auth-deny', () => {
        return server2.getPackage('test-auth-deny')
                 .status(403)
                 .body_error('i don\'t know anything about you');
      });

      test('access test-auth-regular', () => {
        return server2.getPackage('test-auth-regular')
                 .status(404)
                 .body_error('no such package available');
      });
    });

    afterAll(function() {
      server2.authstr = authstr;
    });
  });
}
