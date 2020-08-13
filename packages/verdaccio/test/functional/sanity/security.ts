import _ from 'lodash';
import { HTTP_STATUS } from '@verdaccio/dev-commons';

export default function (server) {
  describe('should test security on endpoints', () => {
    beforeAll(function () {
      return server.addPackage('testpkg-sec');
    });

    test('should fails on fetch bad pkg #1', () => {
      return server
        .getPackage('__proto__')
        .status(HTTP_STATUS.FORBIDDEN)
        .body_error(/invalid package/);
    });

    test('should fails on fetch bad pkg #2', () => {
      return server
        .getPackage('__proto__')
        .status(HTTP_STATUS.FORBIDDEN)
        .body_error(/invalid package/);
    });

    test('should do not fails on __proto__, connect stuff', () => {
      return server.request({ uri: '/testpkg-sec?__proto__=1' }).then(function (body) {
        // test for NOT outputting stack trace
        expect(_.isNil(body) || _.isObject(body) || body.indexOf('node_modules')).toBeTruthy();

        // test for NOT crashing
        return server.request({ uri: '/testpkg-sec' }).status(HTTP_STATUS.OK);
      });
    });

    test('should fails and do not return __proto__ as an attachment', () => {
      return server
        .request({ uri: '/testpkg-sec/-/__proto__' })
        .status(HTTP_STATUS.FORBIDDEN)
        .body_error(/invalid filename/);
    });

    test('should fails on fetch silly things - reading #1', () => {
      return server.request({ uri: '/testpkg-sec/-/../../../../../../../../etc/passwd' }).status(HTTP_STATUS.NOT_FOUND);
    });

    test('should fails on fetch silly things - reading #2', () => {
      return server
        .request({ uri: '/testpkg-sec/-/%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd' })
        .status(HTTP_STATUS.FORBIDDEN)
        .body_error(/invalid filename/);
    });

    test('should fails on fetch silly things - writing #1', () => {
      return server
        .putTarball('testpkg-sec', '__proto__', '{}')
        .status(HTTP_STATUS.FORBIDDEN)
        .body_error(/invalid filename/);
    });

    test('should fails on fetch silly things - writing #3', () => {
      return server
        .putTarball('testpkg-sec', 'node_modules', '{}')
        .status(HTTP_STATUS.FORBIDDEN)
        .body_error(/invalid filename/);
    });

    test('should fails on fetch silly things - writing #4', () => {
      return server
        .putTarball('testpkg-sec', '../testpkg.tgz', '{}')
        .status(HTTP_STATUS.FORBIDDEN)
        .body_error(/invalid filename/);
    });
  });
}
