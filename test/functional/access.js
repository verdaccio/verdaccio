
module.exports = function () {
  describe('access control', function () {
    var server = process.server
    var oldauth

    before(function () {
      oldauth = server.authstr
    })

    after(function () {
      server.authstr = oldauth
    })

    function check_access(auth, pkg, ok) {
      it((ok ? 'allows' : 'forbids') +' access ' + auth + ' to ' + pkg, function () {
        server.authstr = auth
                       ? 'Basic '+(new Buffer(auth).toString('base64'))
                       : undefined

        var req = server.get_package(pkg)

        if (ok) {
          return req.status(404)
                    .body_error(/no such package available/)
        } else {
          return req.status(403)
                    .body_error(/not allowed to access package/)
        }
      })
    }

    function check_publish(auth, pkg, ok) {
      it((ok ? 'allows' : 'forbids') + ' publish ' + auth + ' to ' + pkg, function () {
        server.authstr = auth
                       ? 'Basic '+(new Buffer(auth).toString('base64'))
                       : undefined

        var req = server.put_package(pkg, require('./lib/package')(pkg))

        if (ok) {
          return req.status(404)
                    .body_error(/this package cannot be added/)
        } else {
          return req.status(403)
                    .body_error(/not allowed to publish package/)
        }
      })
    }

    check_access('test:test',     'test-access-only',  true)
    check_access(undefined,       'test-access-only',  true)
    check_access('test:badpass',  'test-access-only',  true)
    check_publish('test:test',    'test-access-only',  false)
    check_publish(undefined,      'test-access-only',  false)
    check_publish('test:badpass', 'test-access-only',  false)

    check_access('test:test',     'test-publish-only', false)
    check_access(undefined,       'test-publish-only', false)
    check_access('test:badpass',  'test-publish-only', false)
    check_publish('test:test',    'test-publish-only', true)
    check_publish(undefined,      'test-publish-only', true)
    check_publish('test:badpass', 'test-publish-only', true)

    check_access('test:test',     'test-only-test',  true)
    check_access(undefined,       'test-only-test', false)
    check_access('test:badpass',  'test-only-test', false)
    check_publish('test:test',    'test-only-test',  true)
    check_publish(undefined,      'test-only-test', false)
    check_publish('test:badpass', 'test-only-test', false)

    check_access('test:test',     'test-only-auth',  true)
    check_access(undefined,       'test-only-auth', false)
    check_access('test:badpass',  'test-only-auth', false)
    check_publish('test:test',    'test-only-auth',  true)
    check_publish(undefined,      'test-only-auth', false)
    check_publish('test:badpass', 'test-only-auth', false)
  })
}

