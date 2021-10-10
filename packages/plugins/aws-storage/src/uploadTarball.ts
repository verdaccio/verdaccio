import { UploadTarball } from '@verdaccio/streams';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Logger } from '@verdaccio/types';
import { HttpError } from 'http-errors';
import { convertS3Error } from './s3Errors';

interface StreamEndedRef {
  value: boolean;
}

interface UploadTarballToS3Options {
  s3Client: S3Client;
  baseS3Params: any;
  uploadStream: UploadTarball;
  logger: Logger;
  streamEnded: StreamEndedRef;
}

/**
 * Helper to upload the tarball file asynchronous
 * using streams
 *
 * @param options - Options to upload the tarball
 */
export default function uploadTarballToS3({
  s3Client,
  baseS3Params,
  uploadStream,
  logger,
  streamEnded,
}: UploadTarballToS3Options) {
  logger.debug('s3: [S3PackageManager writeTarball managedUpload] init stream');
  const managedUpload = new Upload({
    client: s3Client,
    params: Object.assign({}, baseS3Params, { Body: uploadStream }),
  });

  logger.debug('s3: [S3PackageManager writeTarball managedUpload] send');
  uploadStream.emit('open');

  logger.debug({ name }, 's3: [S3PackageManager writeTarball uploadStream] emit open @{name}');
  const promise = managedUpload
    .done()
    .then((response) => {
      logger.trace(
        { data: response },
        's3: [S3PackageManager writeTarball managedUpload send] response @{data}'
      );
    })
    .catch((err) => {
      const error: HttpError = convertS3Error(err);
      logger.error(
        { error: error.message },
        `s3: [S3PackageManager writeTarball managedUpload send] 
                    emit error @{error}`
      );

      uploadStream.emit('error', error);
    });

  uploadStream.done = (): void => {
    const onEnd = async (): Promise<void> => {
      try {
        await promise;

        logger.debug('s3: [S3PackageManager writeTarball uploadStream done] emit success');
        uploadStream.emit('success');
      } catch (err) {
        // already emitted in the promise above, necessary because of some issues
        // with promises in jest
        logger.error({ err }, 's3: [S3PackageManager writeTarball uploadStream done] error @{err}');
      }
    };

    if (streamEnded.value) {
      logger.trace(
        { name },
        's3: [S3PackageManager writeTarball uploadStream] streamEnded true @{name}'
      );
      onEnd();
    } else {
      logger.trace(
        { name },
        `s3: [S3PackageManager writeTarball uploadStream] streamEnded 
                  false emit end @{name}`
      );
      uploadStream.on('end', onEnd);
    }
  };

  uploadStream.abort = (): void => {
    logger.debug('s3: [S3PackageManager writeTarball uploadStream abort] init');
    try {
      logger.debug('s3: [S3PackageManager writeTarball managedUpload abort]');
      managedUpload.abort();
    } catch (err) {
      const error: HttpError = convertS3Error(err);
      uploadStream.emit('error', error);
      logger.error(
        { error },
        's3: [S3PackageManager writeTarball uploadStream error] emit error @{error}'
      );
    } finally {
      logger.debug(
        { name, baseS3Params },
        `s3: [S3PackageManager writeTarball uploadStream abort] 
                  s3.deleteObject @{name}/@baseS3Params`
      );
      const deleteObjectCommand = new DeleteObjectCommand(baseS3Params);

      s3Client.send(deleteObjectCommand);
    }
  };
}
