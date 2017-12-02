import assert from 'assert';

export default function(server) {

  describe('Security', () => {
    beforeAll(function () {
      return server.addPackage('testpkg-sec');
    });

    test('bad pkg #1', () => {
      return server.getPackage('package.json')
        .status(403)
        .body_error(/invalid package/);
    });

    test('bad pkg #2', () => {
      return server.getPackage('__proto__')
        .status(403)
        .body_error(/invalid package/);
    });

    test('__proto__, connect stuff', () => {
      return server.request({uri: '/testpkg-sec?__proto__=1'})
        .then(function (body) {
          // test for NOT outputting stack trace
          assert(!body || typeof(body) === 'object' || body.indexOf('node_modules') === -1);

          // test for NOT crashing
          return server.request({uri: '/testpkg-sec'}).status(200);
        });
    });

    test('do not return package.json as an attachment', () => {
      return server.request({uri: '/testpkg-sec/-/package.json'})
        .status(403)
        .body_error(/invalid filename/);
    });

    test('silly things - reading #1', () => {
      return server.request({uri: '/testpkg-sec/-/../../../../../../../../etc/passwd'})
        .status(404);
    });

    test('silly things - reading #2', () => {
      return server.request({uri: '/testpkg-sec/-/%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'})
        .status(403)
        .body_error(/invalid filename/);
    });

    test('silly things - writing #1', () => {
      return server.putTarball('testpkg-sec', 'package.json', '{}')
        .status(403)
        .body_error(/invalid filename/);
    });

    test('silly things - writing #3', () => {
      return server.putTarball('testpkg-sec', 'node_modules', '{}')
        .status(403)
        .body_error(/invalid filename/);
    });

    test('silly things - writing #4', () => {
      return server.putTarball('testpkg-sec', '../testpkg.tgz', '{}')
        .status(403)
        .body_error(/invalid filename/);
    });
  });
};

