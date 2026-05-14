import { describe, test } from 'vitest';

import { ReadTarball, UploadTarball } from '../src/index';

describe('mystreams', () => {
  test('should delay events on ReadTarball abort', () => {
    return new Promise<void>((resolve) => {
      const readTballStream = new ReadTarball({});
      readTballStream.abort();
      setTimeout(function () {
        readTballStream.abort = function (): void {
          resolve();
        };
        readTballStream.abort = function (): never {
          throw Error('fail');
        };
      }, 10);
    });
  });

  test('should delay events on UploadTarball abort', () => {
    return new Promise<void>((resolve) => {
      const uploadTballStream = new UploadTarball({});
      uploadTballStream.abort();
      setTimeout(function () {
        uploadTballStream.abort = function (): void {
          resolve();
        };
        uploadTballStream.abort = function (): never {
          throw Error('fail');
        };
      }, 10);
    });
  });
});
