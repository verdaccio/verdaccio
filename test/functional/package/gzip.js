import zlib from 'zlib';
import {readFile} from '../lib/test.utils';
import {HEADER_TYPE, HEADERS, HTTP_STATUS} from "../../../src/lib/constants";

export default function(server, express) {
  const PKG_NAME = 'testexp_gzip';

  describe('test gzip support', () => {
    beforeAll(function() {
      express.get(`/${PKG_NAME}`, function(req, res) {
        const version = '0.0.1';
        const pkg = eval(
          '(' + readFile('../fixtures/publish.json5')
            .toString('utf8')
            .replace(/__NAME__/g, PKG_NAME)
            .replace(/__VERSION__/g, version)
          + ')'
        );

        // overcoming compress threshold
        pkg.versions['0.0.2'] = pkg.versions[version];
        pkg.versions['0.0.3'] = pkg.versions[version];
        pkg.versions['0.0.4'] = pkg.versions[version];
        pkg.versions['0.0.5'] = pkg.versions[version];
        pkg.versions['0.0.6'] = pkg.versions[version];
        pkg.versions['0.0.7'] = pkg.versions[version];
        pkg.versions['0.0.8'] = pkg.versions[version];
        pkg.versions['0.0.9'] = pkg.versions[version];

        zlib.gzip(JSON.stringify(pkg), function(err, buf) {
          expect(err).toBeNull();
          expect(req.headers[HEADER_TYPE.ACCEPT_ENCODING]).toBe(HEADERS.GZIP);
          res.header(HEADER_TYPE.CONTENT_ENCODING, HEADERS.GZIP);
          res.send(buf);
        });
      });

      express.get('/testexp_baddata', function(req, res) {
        expect(req.headers[HEADER_TYPE.ACCEPT_ENCODING]).toBe(HEADERS.GZIP);
        res.header(HEADER_TYPE.CONTENT_ENCODING, HEADERS.GZIP);
        res.send(new Buffer([1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1]));
      });
    });

    test('should not fail on bad gzip', () => {
      return server.getPackage('testexp_baddata').status(HTTP_STATUS.NOT_FOUND);
    });

    test('should understand gzipped data from uplink', () => {
      return server.getPackage(PKG_NAME)
               .status(HTTP_STATUS.OK)
               .response(function(res) {
                 expect(res.headers[HEADER_TYPE.CONTENT_ENCODING]).toBeUndefined();
               })
               .then(function(body) {
                 expect(body.name).toBe(PKG_NAME);
                 expect(Object.keys(body.versions)).toHaveLength(9);
               });
    });

    test('should serve gzipped data', () => {
      return server.request({
        uri: '/testexp_gzip',
        encoding: null,
        headers: {
          [HEADER_TYPE.ACCEPT_ENCODING]: HEADERS.GZIP,
        },
        json: false,
      }).status(HTTP_STATUS.OK)
        .response(function(res) {
          expect(res.headers[HEADER_TYPE.CONTENT_ENCODING]).toBe(HEADERS.GZIP);
        })
        .then(function(body) {
          expect(function() {
            JSON.parse(body.toString('utf8'));
          }).toThrow(/Unexpected/);

          return new Promise(function(resolve) {
            zlib.gunzip(body, function(err, buf) {
              expect(err).toBeNull();
              body = JSON.parse(buf);
              expect(body.name).toBe(PKG_NAME);
              expect(Object.keys(body.versions)).toHaveLength(9)
              resolve();
            });
          });
        });
    });
  });
}
