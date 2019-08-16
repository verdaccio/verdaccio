import _ from 'lodash';
import smartRequest, {PromiseAssert} from '../../lib/request';
import {mockServer} from '../__helper/mock';
import {HTTP_STATUS} from '../../../src/lib/constants';
import { IRequestPromise } from '../../types';
import { VerdaccioError } from '@verdaccio/commons-api';

describe('Request Functional', () => {
  const mockServerPort = 55547;
  const restTest = `http://localhost:${55547}/jquery`;
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
      mockRegistry = await mockServer(mockServerPort).init();
    });

    afterAll(function(done) {
      mockRegistry[0].stop();
      done();
    });

    test('basic rest', (done) => {
      const options: any = {
        url: restTest,
        method: 'GET'
      };

      smartRequest(options).then((result)=> {
        expect(_.isString(result)).toBeTruthy();
        done();
      })
    });

    describe('smartRequest Status', () => {

      test('basic check status 200', (done) => {
        const options: any = {
          url: restTest,
          method: 'GET'
        };
        // @ts-ignore
        smartRequest(options).status(HTTP_STATUS.OK).then((result)=> {
          expect(JSON.parse(result).name).toBe('jquery');
          done();
        })
      });

      test('basic check status 404', (done) => {
        const options: any = {
          url: 'http://www.google.fake',
          method: 'GET'
        };
        // @ts-ignore
        smartRequest(options).status(HTTP_STATUS.NOT_FOUND).then(() => {
          // we do not intent to resolve this
        }, (error: VerdaccioError) => {
          expect(error.code).toBe('ENOTFOUND');
          done();
        })
      });
    });
  });
});
