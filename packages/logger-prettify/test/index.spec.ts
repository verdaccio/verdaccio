import pino from 'pino';
import { Writable } from 'stream';

import { buildPretty } from '../src';

describe('prettyFactory', () => {
  const prettyfierOptions = {
    messageKey: 'msg',
    levelFirst: true,
    prettyStamp: false,
    colors: false,
  };
  test('should return a function', (done) => {
    const pretty = buildPretty(prettyfierOptions);
    const log = pino(
      new Writable({
        objectMode: true,
        write(chunk, enc, cb) {
          const formatted = pretty(JSON.parse(chunk));
          expect(formatted).toBe('info --- test message ');
          cb();
          done();
        },
      })
    );
    log.info({ test: 'test' }, '@{test} message');
  });
});
