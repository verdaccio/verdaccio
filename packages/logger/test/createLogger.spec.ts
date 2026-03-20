import { Writable } from 'node:stream';
import pino from 'pino';
import { describe, expect, test } from 'vitest';

import { createLogger } from '../src';

describe('logger test', () => {
  describe('json format', () => {
    test('should write json to a stream', () => {
      const stream = new Writable({
        write(chunk, encoding, callback) {
          expect(JSON.parse(chunk.toString())).toEqual(
            expect.objectContaining({ level: 30, msg: 'test' })
          );
          callback();
        },
      });
      const logger = createLogger({ level: 'http' }, stream, 'json', pino);
      logger.info('test');
    });
  });
});
