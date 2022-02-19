import { describe, expect, test } from 'vitest';

import { setup } from '../src';

describe('logger', () => {
  // this must be first due the warning code throws first the desired warning
  test('throw deprecation warning if multiple loggers configured', (done) => {
    setup([
      {
        level: 'info',
      },
      {
        level: 'http',
      },
    ]);
    process.once('warning', function (warning: { code: string }) {
      expect(warning.code).toEqual('VERDEP002');
      done();
    });
  });

  test('should instantiace well', () => {
    setup();
    expect(() => setup()).not.toThrowError();
  });
});
