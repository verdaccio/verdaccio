import { beforeEach, describe, expect, test, vi } from 'vitest';

// Use dynamic imports to get a fresh module (and fresh `logger` singleton) per test
describe('setup', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test('should return a logger for stdout', async () => {
    const { setup } = await import('../src');
    const logger = await setup({ type: 'stdout', level: 'info' });
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  test('should return a logger with default options', async () => {
    const { setup } = await import('../src');
    const logger = await setup({});
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  test('should return the same logger on subsequent calls', async () => {
    const { setup } = await import('../src');
    const first = await setup({});
    const second = await setup({ level: 'trace' });
    expect(first).toBe(second);
  });

  test('should work with file destination', async () => {
    const { setup } = await import('../src');
    const { fileUtils } = await import('@verdaccio/core');
    const { join } = await import('node:path');
    const folder = await fileUtils.createTempFolder('index-test');
    const file = join(folder, 'test.log');
    const logger = await setup({ type: 'file', path: file, format: 'json', level: 'info' });
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  test('should export logger singleton', async () => {
    const mod = await import('../src');
    expect(mod.logger).toBeUndefined();
    await mod.setup({});
    expect(mod.logger).toBeDefined();
  });
});
