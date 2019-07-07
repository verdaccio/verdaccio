import {HEADERS, HTTP_STATUS} from '../../../src/lib/constants';
import {DOMAIN_SERVERS, PORT_SERVER_1, PORT_SERVER_2} from '../config.functional';
import {generateSha} from '../lib/test.utils';
import {DIST_TAGS} from "../../../src/lib/constants";

export default function(server, server2) {
  const SCOPE = '@test/scoped';
  const PKG_VERSION = '1.0.0';
  const PKG_NAME = 'scoped';

  describe('test-scoped', () => {
    beforeAll(function() {
      return server.request({
        uri: '/@test%2fscoped',
        headers: {
          'content-type': HEADERS.JSON,
        },
        method: 'PUT',
        json: require('./scoped.json'),
      }).status(HTTP_STATUS.CREATED);
    });

    test('should publish scope package', () => {});

    describe('should get scoped packages tarball', () => {
      const uploadScopedTarBall = (server) => {
        return server.getTarball(SCOPE, `${PKG_NAME}-${PKG_VERSION}.tgz`)
          .status(HTTP_STATUS.OK)
          .then(function(body) {
            // not real sha due to utf8 conversion
            expect(generateSha(body)).toEqual('6e67b14e2c0e450b942e2bc8086b49e90f594790');
          });
      };

      test('should be a scoped tarball from server1', () => {
        return uploadScopedTarBall(server);
      });

      test('should be a scoped tarball from server2', () => {
        return uploadScopedTarBall(server2);
      });

    });

    describe('should retrieve scoped packages', () => {
      const testScopePackage = (server, port) => server.getPackage(SCOPE)
        .status(HTTP_STATUS.OK)
        .then(function(body) {
          expect(body.name).toBe(SCOPE);
          expect(body.versions[PKG_VERSION].name).toBe(SCOPE);
          expect(body.versions[PKG_VERSION].dist.tarball).toBe(
            `http://${DOMAIN_SERVERS}:${port}/@test%2fscoped/-/${PKG_NAME}-${PKG_VERSION}.tgz`);
          expect(body[DIST_TAGS]).toEqual({latest: PKG_VERSION});
        });

      test('scoped package on server1', () => testScopePackage(server, PORT_SERVER_1));
      test('scoped package on server2', () => testScopePackage(server2, PORT_SERVER_2));
    });

    describe('should retrieve a scoped packages under nginx', () => {
      test('should work nginx workaround', () => {
        return server2.request({
          uri: '/@test/scoped/1.0.0'
        }).status(HTTP_STATUS.OK)
          .then(function(body) {
            expect(body.name).toEqual(SCOPE);
            expect(body.dist.tarball).toEqual(
              `http://${DOMAIN_SERVERS}:${PORT_SERVER_2}/@test%2fscoped/-/${PKG_NAME}-${PKG_VERSION}.tgz`);
          });
      });
    });
  });
}
