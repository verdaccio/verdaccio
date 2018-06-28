// @flow

import _ from 'lodash';
import path from 'path';
// $FlowFixMe
import configExample from '../partials/config/index';
import AppConfig from '../../../src/lib/config';
import Storage from '../../../src/lib/storage';
import {setup} from '../../../src/lib/logger';

import type {Config} from '@verdaccio/types';
import type {IStorageHandler} from '../../../types/index';
import {API_ERROR, HTTP_STATUS} from '../../../src/lib/constants';
import {mockServer} from './mock';
import {DOMAIN_SERVERS} from '../../functional/config.functional';

setup(configExample.logs);

const mockServerPort: number = 55548;
const generateStorage = async function(port = mockServerPort, configDefault = configExample) {
  const storageConfig = _.clone(configDefault);
  const storage = path.join(__dirname, '../partials/store/test-storage-store.spec');
  storageConfig.self_path = __dirname;
  storageConfig.storage = storage;
  storageConfig.uplinks = {
    npmjs: {
      url: `http://${DOMAIN_SERVERS}:${port}`
    }
  };
  const config: Config = new AppConfig(storageConfig);
  const store: IStorageHandler = new Storage(config);
  await store.init(config);

  return store;
}

describe('StorageTest', () => {
  let mockRegistry;

  beforeAll(async () => {
    mockRegistry = await mockServer(mockServerPort).init();
  });

  afterAll(function(done) {
    mockRegistry[0].stop();
    done();
  });

  test('should be defined', async () => {
    const storage: IStorageHandler = await generateStorage();

    expect(storage).toBeDefined();
  });

  describe('test _syncUplinksMetadata', () => {
    test('should fetch from uplink jquery metadata from registry', async (done) => {
      const storage: IStorageHandler = await generateStorage();

      // $FlowFixMe
      storage._syncUplinksMetadata('jquery', null, {}, (err, metadata, errors) => {
        expect(err).toBeNull();
        expect(metadata).toBeDefined();
        expect(metadata).toBeInstanceOf(Object);
        done();
      });
    });

    test('should fails on fetch from uplink non existing from registry', async (done) => {
      const storage: IStorageHandler = await generateStorage();

      // $FlowFixMe
      storage._syncUplinksMetadata('@verdaccio/404', null, {}, (err, metadata, errors) => {
        expect(err).not.toBeNull();
        expect(errors).toBeInstanceOf(Array);
        expect(errors[0][0].statusCode).toBe(HTTP_STATUS.NOT_FOUND);
        expect(errors[0][0].message).toMatch(API_ERROR.NOT_PACKAGE_UPLINK);
        done();
      });
    });

    test('should fails on fetch from uplink corrupted pkg from registry', async (done) => {
      const storage: IStorageHandler = await generateStorage();

      // $FlowFixMe
      storage._syncUplinksMetadata('corrupted-package', null, {}, (err, metadata, errors) => {
        expect(err).not.toBeNull();
        expect(errors).toBeInstanceOf(Array);
        expect(errors[0][0].statusCode).toBe(HTTP_STATUS.INTERNAL_ERROR);
        expect(errors[0][0].message).toMatch(API_ERROR.BAD_STATUS_CODE);
        done();
      });
    });
  });
});
