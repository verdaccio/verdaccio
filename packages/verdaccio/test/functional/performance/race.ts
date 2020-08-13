import async from 'async';
import { HTTP_STATUS } from '@verdaccio/dev-commons';

let okTotalSum = 0;
import racePkg from '../fixtures/package';

export default function (server) {
  describe('should test race condition on publish packages', () => {
    const MAX_COUNT = 20;
    const PKG_NAME = 'race';
    const PUBLISHED = 'published';
    const PRESENT = 'already present';
    const UNAVAILABLE = 'unavailable';

    beforeAll(function () {
      return server
        .putPackage(PKG_NAME, racePkg(PKG_NAME))
        .status(HTTP_STATUS.CREATED)
        .body_ok(/created new package/);
    });

    test('creating new package', () => {});

    test('should uploading 10 same versions and ignore 9', (callback) => {
      let listOfRequest = [];
      for (let i = 0; i < MAX_COUNT; i++) {
        // @ts-ignore
        listOfRequest.push(function (callback) {
          let data = racePkg(PKG_NAME);
          data.rand = Math.random();

          let _res;
          server
            .putVersion(PKG_NAME, '0.0.1', data)
            .response(function (res) {
              _res = res;
            })
            .then(function (body) {
              callback(null, [_res, body]);
            });
        });
      }

      async.parallel(listOfRequest, function (err, response) {
        let okCount = 0;
        let failCount = 0;

        expect(err).toBeNull();

        // @ts-ignore
        response.forEach(function (payload) {
          // @ts-ignore
          const [resp, body] = payload;

          if (resp.statusCode === HTTP_STATUS.CREATED && ~body.ok.indexOf(PUBLISHED)) {
            okCount++;
          }

          if (resp.statusCode === HTTP_STATUS.CONFLICT && ~body.error.indexOf(PRESENT)) {
            failCount++;
          }

          if (resp.statusCode === HTTP_STATUS.SERVICE_UNAVAILABLE && ~body.error.indexOf(UNAVAILABLE)) {
            failCount++;
          }
        });

        expect(okCount + failCount).toEqual(MAX_COUNT);
        expect(okCount).toEqual(1);
        expect(failCount).toEqual(MAX_COUNT - 1);
        okTotalSum += okCount;

        callback();
      });
    });

    test('shoul uploading 10 diff versions and accept 10', (callback) => {
      const listofRequest = [];

      for (let i = 0; i < MAX_COUNT; i++) {
        // @ts-ignore
        listofRequest.push(function (callback) {
          let _res;
          server
            .putVersion(PKG_NAME, '0.1.' + String(i), racePkg(PKG_NAME))
            .response(function (res) {
              _res = res;
            })
            .then(function (body) {
              callback(null, [_res, body]);
            });
        });
      }

      async.parallel(listofRequest, function (err, response) {
        let okcount = 0;
        let failcount = 0;

        expect(err).toBeNull();
        // @ts-ignore
        response.forEach(function (payload) {
          // @ts-ignore
          const [response, body] = payload;

          if (response.statusCode === HTTP_STATUS.CREATED && ~body.ok.indexOf(PUBLISHED)) {
            okcount++;
          }
          if (response.statusCode === HTTP_STATUS.CONFLICT && ~body.error.indexOf(PRESENT)) {
            failcount++;
          }
          if (response.statusCode === HTTP_STATUS.SERVICE_UNAVAILABLE && ~body.error.indexOf(UNAVAILABLE)) {
            failcount++;
          }
        });

        expect(okcount + failcount).toEqual(MAX_COUNT);
        expect(okcount).toEqual(MAX_COUNT);
        expect(failcount).toEqual(0);
        // should be more than 1
        expect(okcount).not.toEqual(1);
        okTotalSum += okcount;

        callback();
      });
    });

    afterAll(function () {
      return server
        .getPackage(PKG_NAME)
        .status(HTTP_STATUS.OK)
        .then(function (body) {
          expect(Object.keys(body.versions)).toHaveLength(okTotalSum);
        });
    });
  });
}
