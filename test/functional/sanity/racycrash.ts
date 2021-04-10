import { DOMAIN_SERVERS, PORT_SERVER_APP } from '../config.functional';
import { API_ERROR, HEADER_TYPE, HTTP_STATUS } from '../../../src/lib/constants';

export default function (server, express) {
  describe('shoul test for unexpected client hangs', () => {
    let handleResponseTarball;

    beforeAll(function () {
      express.get('/testexp-racycrash', function (request, response) {
        response.send({
          name: 'testexp-racycrash',
          versions: {
            '0.1.0': {
              name: 'testexp_tags',
              version: '0.1.0',
              dist: {
                shasum: 'fake',
                tarball: `http://${DOMAIN_SERVERS}:${PORT_SERVER_APP}/testexp-racycrash/-/test.tar.gz`
              }
            }
          }
        });
      });

      express.get('/testexp-racycrash/-/test.tar.gz', function (request, response) {
        handleResponseTarball(response);
      });
    });

    test('should not crash on error if client disconnects', (callback) => {
      handleResponseTarball = function (res) {
        res.header(HEADER_TYPE.CONTENT_LENGTH, 1e6);
        res.write('test test test');
        setTimeout(function () {
          res.write('-');
          // destroy the connection
          res.socket.destroy();
          cb();
        }, HTTP_STATUS.OK);
      };

      server.request({ uri: '/testexp-racycrash/-/test.tar.gz' }).then(function (body) {
        expect(body).toEqual('test test test');
      });

      function cb() {
        // test for NOT crashing
        server
          .request({ uri: '/testexp-racycrash' })
          .status(HTTP_STATUS.OK)
          .then(function () {
            callback();
          });
      }
    });

    test('should not store tarball', () => {
      handleResponseTarball = function (res) {
        res.socket.destroy();
      };

      return server
        .request({ uri: '/testexp-racycrash/-/test.tar.gz' })
        .body_error(API_ERROR.INTERNAL_SERVER_ERROR);
    });
  });
}
