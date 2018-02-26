// @flow

import _ from 'lodash';
import httpMocks from 'node-mocks-http';
// $FlowFixMe
import configExample from './partials/config';
import AppConfig from '../../src/lib/config';
import Storage from '../../src/lib/storage';
import {setup} from '../../src/lib/logger';

import type {Config} from '@verdaccio/types';
import type {IStorageHandler} from '../../types';

setup(configExample.logs);

const generateStorage = function(): IStorageHandler {
  const storageConfig = _.clone(configExample);
	const storage = `./unit/partials/store/test-storage-store.spec`;
  storageConfig.self_path = __dirname;
  storageConfig.storage = storage;
	const config: Config = new AppConfig(storageConfig);

	return  new Storage(config);
}

describe('StorageTest', () => {

  jest.setTimeout(10000);

	beforeAll((done)=> {
		const storage: IStorageHandler = generateStorage();
		var request  = httpMocks.createRequest({
			method: 'GET',
			url: '/react',
			params: {}
		});

		storage.getPackage({
      name: 'react',
      req: request,
      callback: () => {
        const stream = storage.get_tarball('react', 'react-16.1.0.tgz');
        stream.on('content-length', function(content) {
          if (content) {
            expect(content).toBeTruthy();
            done();
          }
        });
			},
    });
	});

	test('should be defined', () => {
		const storage: IStorageHandler = generateStorage();

    expect(storage).toBeDefined();
	});

	test('should fetch from uplink react metadata from nmpjs', (done) => {
		const storage: IStorageHandler = generateStorage();

		// $FlowFixMe
		storage._syncUplinksMetadata('react', null, {}, (err, metadata, errors) => {
			expect(metadata).toBeInstanceOf(Object);
			done();
		});
	});

	test('should fails on fetch from uplink metadata from nmpjs', (done) => {
		const storage: IStorageHandler = generateStorage();

		// $FlowFixMe
		storage._syncUplinksMetadata('@verdaccio/404', null, {}, (err, metadata, errors) => {
			expect(errors).toBeInstanceOf(Array);
			expect(errors[0][0].statusCode).toBe(404);
			expect(errors[0][0].message).toMatch(/package doesn't exist on uplink/);
			done();
		});
  });
});
