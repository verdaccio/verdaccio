import {
  ListObjectsV2Command,
  DeleteObjectsCommand,
  S3Client,
  ObjectIdentifier,
} from '@aws-sdk/client-s3';

import { convertS3Error, create404Error } from './s3Errors';

interface DeleteKeyPrefixOptions {
  Bucket: string;
  Prefix: string;
}

export async function deleteKeyPrefix(
  s3Client: S3Client,
  options: DeleteKeyPrefixOptions
): Promise<void> {
  try {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: options.Bucket,
      Prefix: options.Prefix,
    });
    const { KeyCount, Contents } = await s3Client.send(listObjectsCommand);

    if (KeyCount > 0) {
      const objectsToDelete: ObjectIdentifier[] = Contents.map(
        (s3Object) => s3Object.Key as ObjectIdentifier
      );

      const deleteObjectsCommand = new DeleteObjectsCommand({
        Bucket: options.Bucket,
        Delete: { Objects: objectsToDelete },
      });
      await s3Client.send(deleteObjectsCommand);
    } else {
      throw create404Error();
    }
  } catch (err) {
    throw convertS3Error(err);
  }
}
