import { join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { createPrettyTransport, isPrettyFormat } from '../src';

describe('isPrettyFormat', () => {
  test('should return true for pretty format', () => {
    expect(isPrettyFormat('pretty')).toBe(true);
  });

  test('should return true for pretty-timestamped format', () => {
    expect(isPrettyFormat('pretty-timestamped')).toBe(true);
  });

  test('should return false for json format', () => {
    expect(isPrettyFormat('json')).toBe(false);
  });

  test('should default to pretty when undefined', () => {
    expect(isPrettyFormat(undefined)).toBe(true);
  });
});

describe('createPrettyTransport', () => {
  const expectedPath = join(import.meta.dirname, '..', 'build', 'prettify.js');

  test('should call pino.transport with correct target path', () => {
    const mockTransport = {};
    const mockPino = { transport: vi.fn().mockReturnValue(mockTransport) };

    const result = createPrettyTransport(mockPino, { level: 'info' }, 'pretty');

    expect(result).toBe(mockTransport);
    expect(mockPino.transport).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        target: expectedPath,
      })
    );
  });

  test('should pass destination from options.path', () => {
    const mockPino = { transport: vi.fn() };

    createPrettyTransport(mockPino, { level: 'info', path: '/var/log/verdaccio.log' }, 'pretty');

    expect(mockPino.transport).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          destination: '/var/log/verdaccio.log',
        }),
      })
    );
  });

  test('should default destination to stdout (1) when no path', () => {
    const mockPino = { transport: vi.fn() };

    createPrettyTransport(mockPino, { level: 'info' }, 'pretty');

    expect(mockPino.transport).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          destination: 1,
        }),
      })
    );
  });

  test('should set prettyStamp true for pretty-timestamped format', () => {
    const mockPino = { transport: vi.fn() };

    createPrettyTransport(mockPino, { level: 'info' }, 'pretty-timestamped');

    expect(mockPino.transport).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          prettyStamp: true,
        }),
      })
    );
  });

  test('should set prettyStamp false for pretty format', () => {
    const mockPino = { transport: vi.fn() };

    createPrettyTransport(mockPino, { level: 'info' }, 'pretty');

    expect(mockPino.transport).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          prettyStamp: false,
        }),
      })
    );
  });

  test('should set worker name', () => {
    const mockPino = { transport: vi.fn() };

    createPrettyTransport(mockPino, { level: 'info' }, 'pretty');

    expect(mockPino.transport).toHaveBeenCalledWith(
      expect.objectContaining({
        worker: { name: 'verdaccio-logger-prettify' },
      })
    );
  });
});
