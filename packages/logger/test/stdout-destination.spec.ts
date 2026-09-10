import { afterEach, describe, expect, test, vi } from 'vitest';

import type { LoggerFormat } from '@verdaccio/types';

describe.each(['development', 'production'])('stdout destination in %s', (environment) => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  const formats: (LoggerFormat | undefined)[] = ['pretty', 'pretty-timestamped', 'json', undefined];

  describe.each([true, false, undefined])('sync=%s', (sync) => {
    test.each(formats)('selects the output for format %s', async (format) => {
      vi.stubEnv('NODE_ENV', environment);
      vi.resetModules();
      const { prepareSetup } = await import('../src/logger');

      const destination = {};
      const transport = {};
      const logger = { on: vi.fn() };
      const pino = Object.assign(vi.fn().mockReturnValue(logger), {
        destination: vi.fn().mockReturnValue(destination),
        transport: vi.fn().mockReturnValue(transport),
        stdSerializers: {},
      });

      expect(
        await prepareSetup(
          { type: 'stdout', level: 'info', format, ...(sync === undefined ? {} : { sync }) },
          pino
        )
      ).toBe(logger);

      if (environment === 'development' && format !== 'json') {
        expect(pino.destination).not.toHaveBeenCalled();
        expect(pino.transport).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({
            options: expect.objectContaining({ destination: 1, sync: sync ?? false }),
          })
        );
        expect(pino).toHaveBeenCalledExactlyOnceWith(expect.any(Object), transport);
      } else {
        expect(pino.transport).not.toHaveBeenCalled();
        expect(pino.destination).toHaveBeenCalledExactlyOnceWith({
          dest: 1,
          sync: sync ?? false,
          minLength: 0,
        });
        expect(pino).toHaveBeenCalledExactlyOnceWith(expect.any(Object), destination);
      }
    });
  });
});
