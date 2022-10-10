import { Stream } from 'stream';

import { readableToString } from '../src/stream-utils';

describe('mystreams', () => {
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
