import { API_MESSAGE, HTTP_STATUS } from '@verdaccio/dev-commons';
import { DIST_TAGS } from '@verdaccio/dev-commons';

import { DOMAIN_SERVERS, PORT_SERVER_1, PORT_SERVER_2, PORT_SERVER_3 } from '../config.functional';
import { generateSha } from '../lib/test.utils';
import pkgExample from './dist-tags-merge.json';

export default function (server, server2, server3) {
  describe('should test preserve tags when publishing something', () => {
    const PKG_NAME = 'testpkg-preserve';
    const PKG_VERSION = '0.0.1';

    beforeAll(function () {
      return server
        .putPackage(PKG_NAME, pkgExample)
        .status(HTTP_STATUS.CREATED)
        .body_ok(API_MESSAGE.PKG_CREATED);
    });

    describe('should check sha integrity', () => {
      const matchTarBallSha = (server) => {
        return server
          .getTarball(PKG_NAME, `${PKG_NAME}-${PKG_VERSION}.tgz`)
          .status(HTTP_STATUS.OK)
          .then(function (body) {
            // not real sha due to utf8 conversion
            expect(generateSha(body)).toBe(pkgExample.versions[PKG_VERSION].dist.shasum);
          });
      };

      test('server1 should match with sha key from published package', () =>
        matchTarBallSha(server));
      test('server2 should match with sha key from published package', () =>
        matchTarBallSha(server2));
    });

    describe('should match dist-tags', () => {
      const matchDisTags = (verdaccioServer, port) => {
        return verdaccioServer
          .getPackage(PKG_NAME)
          .status(HTTP_STATUS.OK)
          .then(function (body) {
            expect(body.name).toBe(PKG_NAME);
            expect(body.time).toBeDefined();
            expect(body.time[PKG_VERSION]).toBeDefined();
            expect(body.time).toBeDefined();
            expect(body.versions[PKG_VERSION].name).toBe(PKG_NAME);
            expect(body.versions[PKG_VERSION].dist.tarball).toBe(
              `http://${DOMAIN_SERVERS}:${port}/${PKG_NAME}/-/${PKG_NAME}-${PKG_VERSION}.tgz`
            );
            expect(body[DIST_TAGS]).toEqual({ foo: PKG_VERSION, latest: PKG_VERSION });
          });
      };

      test('server1 should be able to match latest dist-tags correctly', () => {
        return matchDisTags(server, PORT_SERVER_1);
      });

      test('server2 should be able to match latest dist-tags correctly', () => {
        return matchDisTags(server2, PORT_SERVER_2);
      });

      test('server3 should be able to match latest dist-tags correctly', () => {
        return matchDisTags(server3, PORT_SERVER_3);
      });
    });
  });
}
