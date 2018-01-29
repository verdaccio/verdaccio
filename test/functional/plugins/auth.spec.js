import assert from 'assert';

export default function(server2){
  const requestAuthFail = (user, pass, message, statusCode) => {
    return server2.auth(user, pass)
      .status(statusCode)
      .body_error(message)
      .then(function() {
        return server2.whoami();
      })
      .then(function(username) {
        assert.equal(username, null);
      });
  };
  const requestAuthOk = (user, pass, regex, statusCode) => {
    return server2.auth(user, pass)
      .status(statusCode)
      .body_ok(regex)
      .then(function() {
        return server2.whoami();
      })
      .then(function(username) {
        assert.equal(username, user);
      });

  };

  describe('test default authentication', () => {

    test('should not authenticate with wrong password', () => {
      return requestAuthFail('authtest', 'wrongpass1', 'i don\'t like your password', 401);
    });

    test('should right password handled by plugin', () => {
      return requestAuthOk('authtest2', 'blahblah', /'authtest2'/, 201);
    });

  });

  describe('test access authorization', () => {

   describe('access with user authtest', () => {
      beforeAll(function() {
        return server2.auth('authtest', 'blahblah')
                 .status(201)
                 .body_ok(/'authtest'/);
      });

      test('access test-auth-allow', () => {
        return server2.getPackage('test-auth-allow')
                 .status(404)
                 .body_error('no such package available');
      });

      test('access test-deny', () => {
        return server2.getPackage('test-deny')
                 .status(403)
                 .body_error('not allowed to access package');
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
                 .body_error('not allowed to access package');
      });

      test('access test-auth-deny', () => {
        return server2.getPackage('test-auth-deny')
                 .status(403)
                 .body_error('not allowed to access package');
      });

      test('access test-auth-regular', () => {
        return server2.getPackage('test-auth-regular')
                 .status(404)
                 .body_error('no such package available');
      });
    });

  });
}
