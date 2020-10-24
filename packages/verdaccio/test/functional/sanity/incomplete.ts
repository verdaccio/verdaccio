import { API_ERROR, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/dev-commons';

import { DOMAIN_SERVERS, PORT_SERVER_APP } from '../config.functional';

const defaultPkg = {
  name: 'testexp-incomplete',
  versions: {
    '0.1.0': {
      name: 'testexp_tags',
      version: '0.1.0',
      dist: {
        shasum: 'fake',
        tarball:
          `http://${DOMAIN_SERVERS}:${PORT_SERVER_APP}/testexp-incomplete/-` +
          `/content-length.tar.gz`,
      },
    },
    '0.1.1': {
      name: 'testexp_tags',
      version: '0.1.1',
      dist: {
        shasum: 'fake',
        tarball: `http://${DOMAIN_SERVERS}:${PORT_SERVER_APP}/testexp-incomplete/-/chunked.tar.gz`,
      },
    },
  },
};

export default function (server, express) {
  const listofCalls = [HEADER_TYPE.CONTENT_LENGTH, 'chunked'];

  // FIXME this test causes a process crash on windows and also needs refactoring.
  // See https://github.com/verdaccio/verdaccio/pull/1919#issuecomment-681163937
  describe.skip('test send incomplete packages', () => {
    beforeAll(function () {
      express.get('/testexp-incomplete', function (_, res) {
        res.send(defaultPkg);
      });
    });

    listofCalls.forEach((type) => {
      test(`should not store tarballs / ${type}`, (callback) => {
        let called;
        express.get(`/testexp-incomplete/-/${type}.tar.gz`, function (_, response) {
          if (called) {
            return response.socket.destroy();
          }

          called = true;
          if (type !== 'chunked') {
            response.header(HEADER_TYPE.CONTENT_LENGTH, 1e6);
          }

          response.write('test test test\n');

          setTimeout(function () {
            response.socket.write('200\nsss\n');
            response.socket.destroy();
            cb();
          }, 10);
        });

        server
          .request({ uri: '/testexp-incomplete/-/' + type + '.tar.gz' })
          .status(HTTP_STATUS.OK)
          .response(function (res) {
            if (type !== 'chunked') {
              expect(parseInt(res.headers[HEADER_TYPE.CONTENT_LENGTH], 10)).toBe(1e6);
            }
          })
          .then(function (body) {
            expect(body).toMatch(/test test test/);
          });

        function cb() {
          server
            .request({ uri: '/testexp-incomplete/-/' + type + '.tar.gz' })
            .body_error(API_ERROR.INTERNAL_SERVER_ERROR)
            .then(function () {
              callback();
            });
        }
      });
    });
  });
}
