import { Stream } from 'stream';
import { readableToString, ReadTarball, UploadTarball } from '../src/stream-utils';

describe('mystreams', () => {
  test('should delay events on ReadTarball abort', (cb) => {
    const readTballStream = new ReadTarball({});
    readTballStream.abort();
    setTimeout(function () {
      readTballStream.abort = function (): void {
        cb();
      };
      readTballStream.abort = function (): never {
        throw Error('fail');
      };
    }, 10);
  });

  test('should delay events on UploadTarball abort', (cb) => {
    const uploadTballStream = new UploadTarball({});
    uploadTballStream.abort();
    setTimeout(function () {
      uploadTballStream.abort = function (): void {
        cb();
      };
      uploadTballStream.abort = function (): never {
        throw Error('fail');
      };
    }, 10);
  });

  test('readableToString single string', async () => {
    expect(await readableToString(Stream.Readable.from('foo'))).toEqual('foo');
  });

  test('readableToString single object', async () => {
    expect(
      JSON.parse(await readableToString(Stream.Readable.from(JSON.stringify({ foo: 1 }))))
    ).toEqual({
      foo: 1,
    });
  });
});
