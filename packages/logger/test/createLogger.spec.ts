import { Writable } from 'node:stream';
import debugModule from 'debug';
import pino from 'pino';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

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

  describe('DEBUG level-change listener', () => {
    let originalDebug: string | undefined;

    beforeEach(() => {
      // debug reads process.env.DEBUG once at module load, so setting the env var
      // alone never enables it at runtime — use its own enable()/disable() API.
      originalDebug = process.env.DEBUG;
      debugModule.enable('verdaccio:logger');
    });

    afterEach(() => {
      if (originalDebug === undefined) {
        debugModule.disable();
      } else {
        debugModule.enable(originalDebug);
      }
    });

    test('only reacts to level changes on its own instance', () => {
      const stream = new Writable({ write: (_c, _e, cb) => cb() });
      const logger = createLogger({ level: 'http' }, stream, 'json', pino);
      const stderrWrite = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

      // Own instance: falls through and logs via debug().
      expect(() => logger.emit('level-change', 'debug', 20, 'http', 25, logger)).not.toThrow();
      expect(stderrWrite).toHaveBeenCalled();
      stderrWrite.mockClear();

      // Different instance (e.g. a child logger): guard returns early.
      expect(() => logger.emit('level-change', 'debug', 20, 'http', 25, {})).not.toThrow();
      expect(stderrWrite).not.toHaveBeenCalled();

      stderrWrite.mockRestore();
    });
  });
});
