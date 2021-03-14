/* eslint-disable jest/no-standalone-expect */
import zlib from 'zlib';
import { readFile } from '../lib/test.utils';
import { HEADER_TYPE, HEADERS, HTTP_STATUS, CHARACTER_ENCODING } from '../../../src/lib/constants';

export default function (server, express) {
  const PKG_NAME = 'testexp_gzip';
  const PKG_VERSION = '0.0.1';
  const PKG_BAD_DATA = 'testexp_baddata';
  const VERSION_TOTAL = 4;

  describe('test gzip support', () => {
    beforeAll(function () {
      express.get(`/${PKG_NAME}`, function (req, res) {
        const pkg = JSON.parse(
          readFile('../fixtures/publish.json5')
            .toString(CHARACTER_ENCODING.UTF8)
            .replace(/__NAME__/g, PKG_NAME)
            .replace(/__VERSION__/g, PKG_VERSION)
        );

        // overcoming compress threshold
        for (let i = 1; i <= VERSION_TOTAL; i++) {
          pkg.versions[`0.0.${i}`] = pkg.versions[PKG_VERSION];
        }

        zlib.gzip(JSON.stringify(pkg), (err, buf) => {
          expect(err).toBeNull();
          expect(req.headers[HEADER_TYPE.ACCEPT_ENCODING]).toBe(HEADERS.GZIP);
          res.header(HEADER_TYPE.CONTENT_ENCODING, HEADERS.GZIP);
          res.send(buf);
        });
      });

      express.get(`/${PKG_BAD_DATA}`, function (req, res) {
        expect(req).toBeDefined();
        expect(res).toBeDefined();
        expect(req.headers[HEADER_TYPE.ACCEPT_ENCODING]).toBe(HEADERS.GZIP);
        res.header(HEADER_TYPE.CONTENT_ENCODING, HEADERS.GZIP);
        res.send(Buffer.from([1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1]));
      });
    });

    test('should not fail on bad gzip', () => {
      return server.getPackage(PKG_BAD_DATA).status(HTTP_STATUS.NOT_FOUND);
    });

    test('should understand non gzipped data from uplink', () => {
      return server
        .getPackage(PKG_NAME)
        .status(HTTP_STATUS.OK)
        .response((res) => {
          expect(res.headers[HEADER_TYPE.CONTENT_ENCODING]).toBeUndefined();
        })
        .then((body) => {
          expect(body.name).toBe(PKG_NAME);
          expect(Object.keys(body.versions)).toHaveLength(VERSION_TOTAL);
        });
    });

    test('should serve gzipped data', () => {
      return server
        .request({
          uri: `/${PKG_NAME}`,
          encoding: null,
          headers: {
            [HEADER_TYPE.ACCEPT_ENCODING]: HEADERS.GZIP
          },
          json: false
        })
        .status(HTTP_STATUS.OK)
        .response(function (res) {
          expect(res.headers[HEADER_TYPE.CONTENT_ENCODING]).toBe(HEADERS.GZIP);
        })
        .then(async function (body) {
          // should fails since is zipped
          expect(function () {
            JSON.parse(body.toString(CHARACTER_ENCODING.UTF8));
          }).toThrow(/Unexpected/);

          // we unzip content and check content
          await new Promise(function (resolve) {
            zlib.gunzip(body, function (err, buffer) {
              expect(err).toBeNull();
              expect(buffer).not.toBeNull();
              const unzipedBody = JSON.parse(buffer.toString());

              expect(unzipedBody.name).toBe(PKG_NAME);
              expect(Object.keys(unzipedBody.versions)).toHaveLength(VERSION_TOTAL);
              resolve();
            });
          });
        });
    });
  });
}
