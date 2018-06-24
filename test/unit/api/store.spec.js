// @flow

import _ from 'lodash';
import httpMocks from 'node-mocks-http';
// $FlowFixMe
import configExample from '../partials/config/index';
import AppConfig from '../../../src/lib/config';
import Storage from '../../../src/lib/storage';
import {setup} from '../../../src/lib/logger';

import type {Config} from '@verdaccio/types';
import type {IStorageHandler} from '../../../types/index';
import {API_ERROR} from '../../../src/lib/constants';

setup(configExample.logs);

const generateStorage = async function() {
  const storageConfig = _.clone(configExample);
	const storage = `./unit/partials/store/test-storage-store.spec`;
  storageConfig.self_path = __dirname;
  storageConfig.storage = storage;
	const config: Config = new AppConfig(storageConfig);
  const store: IStorageHandler = new Storage(config);
  await store.init(config);

	return store;
}

describe('StorageTest', () => {

  jest.setTimeout(10000);

	beforeAll(async (done)=> {
		const storage: IStorageHandler = await generateStorage();
		var request  = httpMocks.createRequest({
			method: 'GET',
			url: '/react',
			params: {}
		});

		storage.getPackage({
      name: 'react',
      req: request,
      callback: () => {
        const stream = storage.getTarball('react', 'react-16.1.0.tgz');
        stream.on('content-length', function(content) {
          if (content) {
            expect(content).toBeTruthy();
            done();
          }
        });
			},
    });
	});

	test('should be defined', async () => {
		const storage: IStorageHandler = await generateStorage();

    expect(storage).toBeDefined();
	});

	test('should fetch from uplink react metadata from nmpjs', async (done) => {
		const storage: IStorageHandler = await generateStorage();

		// $FlowFixMe
		storage._syncUplinksMetadata('react', null, {}, (err, metadata, errors) => {
			expect(metadata).toBeInstanceOf(Object);
			done();
		});
	});

	test('should fails on fetch from uplink metadata from nmpjs', async (done) => {
		const storage: IStorageHandler = await generateStorage();

		// $FlowFixMe
		storage._syncUplinksMetadata('@verdaccio/404', null, {}, (err, metadata, errors) => {
			expect(errors).toBeInstanceOf(Array);
			expect(errors[0][0].statusCode).toBe(404);
			expect(errors[0][0].message).toMatch(API_ERROR.NOT_PACKAGE_UPLINK);
			done();
		});
  });
});
