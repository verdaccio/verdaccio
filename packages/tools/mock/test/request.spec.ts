import { jest } from '@jest/globals';
import _ from 'lodash';
import { createRequire } from 'module';

import { HTTP_STATUS, VerdaccioError } from '@verdaccio/core';

import { mockServer } from '../src/mock';
import smartRequest, { PromiseAssert } from '../src/request';
import type { IRequestPromise } from '../src/types';

describe('Request Functional', () => {
  jest.setTimeout(20000);
  const mockServerPort = 55547;
  const domainTest = `http://localhost:${55547}`;
  const restTest = `${domainTest}/jquery`;
  let mockRegistry;

  describe('Request Functional', () => {
    test('PromiseAssert', () => {
      expect(_.isFunction(smartRequest)).toBeTruthy();
    });

    test('basic resolve', (done) => {
      const requestPromise: IRequestPromise = new PromiseAssert((resolve) => {
        resolve(1);
      });
      // @ts-ignore
      requestPromise.then((result) => {
        expect(result).toBe(1);
        done();
      });
    });
  });

  describe('smartRequest Rest', () => {
    beforeAll(async () => {
      const require = createRequire(import.meta.url);
      const pathName = require.resolve('verdaccio/bin/verdaccio');
      // const binPath = await import.meta.resolve('verdaccio/bin/verdaccio');
      mockRegistry = await mockServer(mockServerPort).init(pathName);
    });

    afterAll(function (done) {
      const [registry, pid] = mockRegistry;
      registry.stop();
      console.log(`registry ${pid} has been stopped`);

      done();
    });

    test('basic rest', (done) => {
      const options: any = {
        url: restTest,
        method: 'GET',
      };

      smartRequest(options).then((result) => {
        expect(_.isString(result)).toBeTruthy();
        done();
      });
    });

    describe('smartRequest Status', () => {
      test('basic check status 200', (done) => {
        const options: any = {
          url: restTest,
          method: 'GET',
        };
        // @ts-ignore
        smartRequest(options)
          .status(HTTP_STATUS.OK)
          .then((result) => {
            expect(JSON.parse(result).name).toBe('jquery');
            done();
          });
      });

      test('basic ping status and empty response', (done) => {
        const options: any = {
          url: `${domainTest}/-/ping`,
          method: 'GET',
        };
        // @ts-ignore
        smartRequest(options)
          .status(HTTP_STATUS.OK)
          .then((result) => {
            expect(JSON.parse(result)).toEqual({});
            done();
          });
      });

      test('basic check status 404', (done) => {
        const options: any = {
          url: 'http://www.google.fake',
          method: 'GET',
        };
        // @ts-ignore
        smartRequest(options)
          .status(HTTP_STATUS.NOT_FOUND)
          .then(
            () => {
              // we do not intent to resolve this
            },
            (error: VerdaccioError) => {
              expect(error.code).toBe('ENOTFOUND');
              done();
            }
          );
      });
    });
  });
});
