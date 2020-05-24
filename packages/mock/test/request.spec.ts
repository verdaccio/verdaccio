import _ from 'lodash';
import {HTTP_STATUS} from '@verdaccio/dev-commons';
import { VerdaccioError } from '@verdaccio/commons-api';

import smartRequest, {PromiseAssert} from '../src/request';
import {mockServer} from '../src/mock';
import { IRequestPromise } from '../src/types';

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
      const requestPromise: IRequestPromise = new PromiseAssert(resolve => {
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
      try {
        const binPath = require.resolve('verdaccio/bin/verdaccio');
        mockRegistry = await mockServer(mockServerPort).init(binPath);
      } catch (e) {
        debugger;
        console.log('e');
      }
    });

    afterAll(() => {
      const [registry, pid] = mockRegistry;
      registry.stop();
      console.log(`registry ${pid} has been stopped`);
    });

    test('basic rest', (done) => {
      const options: any = {
        method: 'GET'
      };

      smartRequest(restTest, options).then((result)=> {
        expect(result).toBeTruthy();
        done();
      });
    });

    describe('smartRequest Status', () => {

      test('basic check status 200', (done) => {
        const options: any = {
          method: 'GET'
        };
        // @ts-ignore
        smartRequest(restTest, options).status(HTTP_STATUS.OK).then((result)=> {
          expect(result.name).toBe('jquery');
          done();
        })
      });

      test('basic ping status and empty response', (done) => {
        const options: any = {
          method: 'GET'
        };
        // @ts-ignore
        smartRequest(`${domainTest}/-/ping`,options).status(HTTP_STATUS.OK).then((result)=> {
          expect(result).toEqual({});
          done();
        })
      });

      test('basic check status 404', (done) => {
        const options: any = {
          method: 'GET'
        };
        // @ts-ignore
        smartRequest('http://www.google.fake', options).status(HTTP_STATUS.NOT_FOUND).catch((error: VerdaccioError) => {
          expect(error.code).toBe('ENOTFOUND');
          done();
        })
      });
    });
  });
});
