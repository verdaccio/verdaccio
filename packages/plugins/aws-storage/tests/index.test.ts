import { S3 } from 'aws-sdk';
import { IPluginStorage } from '@verdaccio/types';

import S3Database from '../src/index';
import { deleteKeyPrefix } from '../src/deleteKeyPrefix';
import { is404Error } from '../src/s3Errors';
import { S3Config } from '../src/config';

import logger from './__mocks__/Logger';
import Config from './__mocks__/Config';

describe.skip('Local Database', () => {
  let db: IPluginStorage<S3Config>;
  let config;
  // random key for testing
  const keyPrefix = `test/${Math.floor(Math.random() * Math.pow(10, 8))}`;

  const bucket = process.env.VERDACCIO_TEST_BUCKET;
  if (!bucket) {
    throw new Error('no bucket specified via VERDACCIO_TEST_BUCKET env var');
  }

  beforeEach(() => {
    config = Object.assign(new Config(), {
      store: {
        's3-storage': {
          bucket,
          keyPrefix,
        },
      },
    });
    db = new S3Database(config, { logger, config });
  });

  afterEach(async () => {
    const s3 = new S3();
    // snapshot test the final state of s3
    await new Promise((resolve, reject): void => {
      s3.listObjectsV2(
        { Bucket: bucket, Prefix: config.store['s3-storage'].keyPrefix },
        (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          // none of the tests we do should create this much data
          expect(data.IsTruncated).toBe(false);
          // remove the stuff that changes from the results
          expect(
            data.Contents.map(({ Key, Size }) => ({
              Key: Key.split(keyPrefix)[1],
              Size,
            }))
          ).toMatchSnapshot();
          resolve();
        }
      );
    });
    // clean up s3
    try {
      await new Promise((resolve, reject): void => {
        deleteKeyPrefix(
          s3,
          {
            Bucket: bucket,
            Prefix: keyPrefix,
          },
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    } catch (err) {
      if (is404Error(err)) {
        // ignore
      } else {
        throw err;
      }
    }
  });

  test('should create an instance', () => {
    expect(db).toBeDefined();
  });

  describe('manages a secret', () => {
    test('should create get secret', async () => {
      const secretKey = await db.getSecret();
      expect(secretKey).toBeDefined();
      expect(typeof secretKey === 'string').toBeTruthy();
    });

    test('should create set secret', async () => {
      await db.setSecret(config.checkSecretKey());
      expect(config.secret).toBeDefined();
      expect(typeof config.secret === 'string').toBeTruthy();
      const fetchedSecretKey = await db.getSecret();
      expect(config.secret).toBe(fetchedSecretKey);
    });
  });

  describe('Database CRUD', () => {
    test('should add an item to database', (done) => {
      const pgkName = 'jquery';
      db.get((err, data) => {
        expect(err).toBeNull();
        expect(data).toHaveLength(0);

        db.add(pgkName, (err) => {
          expect(err).toBeNull();
          db.get((err, data) => {
            expect(err).toBeNull();
            expect(data).toHaveLength(1);
            done();
          });
        });
      });
    });

    test('should remove an item to database', (done) => {
      const pgkName = 'jquery';
      db.get((err, data) => {
        expect(err).toBeNull();
        expect(data).toHaveLength(0);
        db.add(pgkName, (err) => {
          expect(err).toBeNull();
          db.remove(pgkName, (err) => {
            expect(err).toBeNull();
            db.get((err, data) => {
              expect(err).toBeNull();
              expect(data).toHaveLength(0);
              done();
            });
          });
        });
      });
    });
  });
});
