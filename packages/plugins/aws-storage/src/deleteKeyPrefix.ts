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

/**
 * Helper to delete objects from a prefix in a S3 Bucket
 *
 * @param s3Client - S3 client
 * @param options - Options to delete
 */
export async function deleteKeyPrefix(
  s3Client: S3Client,
  options: DeleteKeyPrefixOptions
): Promise<void> {
  try {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: options.Bucket,
      Prefix: options.Prefix,
    });
    const response = await s3Client.send(listObjectsCommand);

    if (response.KeyCount > 0) {
      const objectsToDelete: ObjectIdentifier[] = response.Contents.map((s3Object) => ({
        Key: s3Object.Key,
      }));

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
