import {
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { getNotFound } from '@verdaccio/commons-api';
import { deleteKeyPrefix } from '../src/deleteKeyPrefix';

describe('Delete key prefix', () => {
  let s3 = mockClient(S3Client);

  beforeEach(() => {
    s3.reset();
  });

  test('Should throw 404 error if files dont exists in prefix', () => {
    s3.on(ListObjectsV2Command).resolves({
      KeyCount: 0,
      Contents: [],
    });

    // @ts-ignore
    return expect(deleteKeyPrefix(s3, { Bucket: 'verdaccio', Prefix: '/storage' })).rejects.toEqual(
      getNotFound('no such package available')
    );
  });

  test('Should delete files from a prefix of a S3 Bucket', async () => {
    s3.on(ListObjectsV2Command)
      .resolves({
        KeyCount: 2,
        Contents: [{ Key: 'vue/package.json' }, { Key: 'vue/dist' }],
      })
      .on(DeleteObjectsCommand, {})
      .callsFake((input: DeleteObjectsCommandInput) => {
        expect(input.Bucket).toEqual('verdaccio');
        expect(input.Delete).toEqual({
          Objects: ['vue/package.json', 'vue/dist'],
        });
      });

    // @ts-ignore
    await deleteKeyPrefix(s3, { Bucket: 'verdaccio', Prefix: 'vue' });
  });
});
