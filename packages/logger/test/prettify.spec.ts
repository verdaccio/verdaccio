import fs from 'node:fs';
import path from 'node:path';
import { Writable } from 'node:stream';
import pino from 'pino';
import { describe, expect, test } from 'vitest';

import { fileUtils } from '@verdaccio/core';

import { autoEnd, buildPretty, buildSafeSonicBoom, hasColors } from '../src';

describe('hasColors', () => {
  test('should return true when colors is undefined', () => {
    expect(hasColors(undefined)).toBe(true);
  });

  test('should return false when colors is false', () => {
    expect(hasColors(false)).toBe(false);
  });

  test('should return isColorSupported when colors is true', () => {
    const result = hasColors(true);
    expect(typeof result).toBe('boolean');
  });
});

describe('buildPretty', () => {
  const baseOptions = {
    messageKey: 'msg',
    levelFirst: true,
    prettyStamp: false,
    colors: false,
  };

  test('should format a basic log message', () =>
    new Promise<void>((done) => {
      const pretty = buildPretty(baseOptions);
      const log = pino(
        new Writable({
          objectMode: true,
          write(chunk, enc, cb) {
            const formatted = pretty(JSON.parse(chunk));
            expect(formatted).toBe('info --- test message');
            cb();
            done();
          },
        })
      );
      log.info({ test: 'test' }, '@{test} message');
    }));

  test('should format with pretty-timestamped', () =>
    new Promise<void>((done) => {
      const pretty = buildPretty({ ...baseOptions, prettyStamp: true });
      const log = pino(
        new Writable({
          objectMode: true,
          write(chunk, enc, cb) {
            const formatted = pretty(JSON.parse(chunk));
            // timestamped format includes a date prefix
            expect(formatted).toMatch(/\[\d{4}-\d{2}-\d{2}.*\] info --- hello/);
            cb();
            done();
          },
        })
      );
      log.info('hello');
    }));

  test('should format warn level messages', () =>
    new Promise<void>((done) => {
      const pretty = buildPretty(baseOptions);
      const log = pino(
        new Writable({
          objectMode: true,
          write(chunk, enc, cb) {
            const formatted = pretty(JSON.parse(chunk));
            expect(formatted).toMatch(/warn.*--- something wrong/);
            cb();
            done();
          },
        })
      );
      log.warn('something wrong');
    }));

  test('should format error level messages', () =>
    new Promise<void>((done) => {
      const pretty = buildPretty(baseOptions);
      const log = pino(
        new Writable({
          objectMode: true,
          write(chunk, enc, cb) {
            const formatted = pretty(JSON.parse(chunk));
            expect(formatted).toMatch(/error.*--- failure/);
            cb();
            done();
          },
        })
      );
      log.error('failure');
    }));

  test('should handle template variables with nested objects', () =>
    new Promise<void>((done) => {
      const pretty = buildPretty(baseOptions);
      const log = pino(
        new Writable({
          objectMode: true,
          write(chunk, enc, cb) {
            const formatted = pretty(JSON.parse(chunk));
            expect(formatted).toContain('pkg-name');
            cb();
            done();
          },
        })
      );
      log.info({ packageName: 'pkg-name' }, '@{packageName}');
    }));

  test('should handle sub system field', () =>
    new Promise<void>((done) => {
      const pretty = buildPretty(baseOptions);
      const log = pino(
        new Writable({
          objectMode: true,
          write(chunk, enc, cb) {
            const formatted = pretty(JSON.parse(chunk));
            expect(formatted).toContain('test msg');
            cb();
            done();
          },
        })
      );
      log.info({ sub: 'in' }, 'test msg');
    }));
});

describe('prettify default transport (buildSafeSonicBoom)', () => {
  const prettifyTarget = path.resolve(import.meta.dirname, '..', 'build', 'prettify.js');

  async function createTempFile(): Promise<string> {
    const dir = await fileUtils.createTempFolder('prettify');
    return path.join(dir, 'output.log');
  }

  function createLogger(dest: string, opts: Record<string, unknown> = {}) {
    const transport = pino.transport({
      target: prettifyTarget,
      options: {
        destination: dest,
        colors: false,
        prettyStamp: false,
        ...opts,
      },
    });
    return { log: pino(transport), transport };
  }

  async function flushAndRead(
    log: pino.Logger,
    transport: ReturnType<typeof pino.transport>,
    dest: string
  ): Promise<string> {
    await new Promise<void>((resolve) => {
      transport.on('ready', () => {
        log.flush();
        setTimeout(resolve, 500);
      });
    });
    return fs.readFileSync(dest, 'utf-8');
  }

  test('should write formatted output to a file via SonicBoom', async () => {
    const dest = await createTempFile();
    const { log, transport } = createLogger(dest);
    log.info('sonic boom file test');

    const content = await flushAndRead(log, transport, dest);
    expect(content).toContain('info');
    expect(content).toContain('sonic boom file test');
    transport.end();
  });

  test('should format with pretty-timestamped when enabled', async () => {
    const dest = await createTempFile();
    const { log, transport } = createLogger(dest, { prettyStamp: true });
    log.info('stamped msg');

    const content = await flushAndRead(log, transport, dest);
    expect(content).toMatch(/\[\d{4}-\d{2}-\d{2}.*\].*stamped msg/);
    transport.end();
  });

  test('should handle warn level messages', async () => {
    const dest = await createTempFile();
    const { log, transport } = createLogger(dest);
    log.warn('warn transport');

    const content = await flushAndRead(log, transport, dest);
    expect(content).toContain('warn');
    expect(content).toContain('warn transport');
    transport.end();
  });

  test('should handle error level messages', async () => {
    const dest = await createTempFile();
    const { log, transport } = createLogger(dest);
    log.error('error transport');

    const content = await flushAndRead(log, transport, dest);
    expect(content).toContain('error');
    expect(content).toContain('error transport');
    transport.end();
  });

  test('should handle multiple log messages sequentially', async () => {
    const dest = await createTempFile();
    const { log, transport } = createLogger(dest);
    log.info('first');
    log.warn('second');
    log.error('third');

    const content = await flushAndRead(log, transport, dest);
    expect(content).toContain('first');
    expect(content).toContain('second');
    expect(content).toContain('third');
    transport.end();
  });

  test('should handle template variables through the transport', async () => {
    const dest = await createTempFile();
    const { log, transport } = createLogger(dest);
    log.info({ packageName: 'my-pkg' }, '@{packageName} published');

    const content = await flushAndRead(log, transport, dest);
    expect(content).toContain('my-pkg published');
    transport.end();
  });
});

describe('buildSafeSonicBoom', () => {
  async function createTempFile(): Promise<string> {
    const dir = await fileUtils.createTempFolder('sonic');
    return path.join(dir, 'output.log');
  }

  test('should create a writable SonicBoom stream to a file', async () => {
    const dest = await createTempFile();
    const stream = buildSafeSonicBoom({ dest, sync: true });

    stream.write('hello sonic boom\n');
    stream.flushSync();

    const content = fs.readFileSync(dest, 'utf-8');
    expect(content).toContain('hello sonic boom');
    stream.destroy();
  });

  test('should handle EPIPE errors by replacing methods with noops', async () => {
    const dest = await createTempFile();
    const stream = buildSafeSonicBoom({ dest, sync: true });

    // Simulate an EPIPE error
    const epipeError = new Error('write EPIPE') as NodeJS.ErrnoException;
    epipeError.code = 'EPIPE';
    stream.emit('error', epipeError);

    // After EPIPE, write/end/flushSync/destroy should be noops (no throws)
    expect(() => stream.write('after epipe')).not.toThrow();
    expect(() => stream.end()).not.toThrow();
    expect(() => stream.flushSync()).not.toThrow();
    expect(() => stream.destroy()).not.toThrow();
  });

  test('should propagate non-EPIPE errors and remove the filter listener', async () => {
    const dest = await createTempFile();
    const stream = buildSafeSonicBoom({ dest, sync: true });

    const nonEpipeError = new Error('some other error') as NodeJS.ErrnoException;
    nonEpipeError.code = 'ENOSPC';

    // The filterBrokenPipe listener should remove itself for non-EPIPE errors,
    // so write/end should still work normally
    stream.on('error', () => {
      // catch the re-emitted error to prevent unhandled
    });
    stream.emit('error', nonEpipeError);

    // Stream should still be functional after non-EPIPE error
    stream.write('still works\n');
    stream.flushSync();

    const content = fs.readFileSync(dest, 'utf-8');
    expect(content).toContain('still works');
    stream.destroy();
  });

  test('should default to sync mode when sync is true', async () => {
    const dest = await createTempFile();
    const stream = buildSafeSonicBoom({ dest, sync: true });

    stream.write('sync write\n');
    // With sync mode, data should be available immediately
    const content = fs.readFileSync(dest, 'utf-8');
    expect(content).toContain('sync write');
    stream.destroy();
  });

  test('should register on-exit handler when sync is false (setupOnExit)', async () => {
    const dest = await createTempFile();
    const stream = buildSafeSonicBoom({ dest, sync: false });

    // Wait for the async file descriptor to be ready
    await new Promise<void>((resolve) => stream.once('ready', resolve));

    stream.write('async write\n');

    // With async mode, need to flush
    await new Promise<void>((resolve) => {
      stream.flush();
      stream.once('drain', resolve);
    });

    const content = fs.readFileSync(dest, 'utf-8');
    expect(content).toContain('async write');
    stream.destroy();
  });
});

describe('autoEnd', () => {
  async function createTempFile(): Promise<string> {
    const dir = await fileUtils.createTempFolder('autoend');
    return path.join(dir, 'output.log');
  }

  test('should do nothing if stream is destroyed', async () => {
    const dest = await createTempFile();
    const stream = buildSafeSonicBoom({ dest, sync: true });
    stream.write('before destroy\n');
    stream.destroy();

    // Should not throw when called on destroyed stream
    expect(() => autoEnd(stream, 'exit')).not.toThrow();
    expect(() => autoEnd(stream, 'beforeExit')).not.toThrow();
  });

  test('should flushSync on exit event', async () => {
    const dest = await createTempFile();
    const stream = buildSafeSonicBoom({ dest, sync: true });
    stream.write('flush on exit\n');

    autoEnd(stream, 'exit');

    const content = fs.readFileSync(dest, 'utf-8');
    expect(content).toContain('flush on exit');
    stream.destroy();
  });

  test('should flush and end on beforeExit event', async () => {
    const dest = await createTempFile();
    const stream = buildSafeSonicBoom({ dest, sync: true });
    stream.write('flush on beforeExit\n');

    autoEnd(stream, 'beforeExit');

    await new Promise<void>((resolve) => {
      stream.once('drain', () => {
        resolve();
      });
      // If already drained, resolve after a short delay
      setTimeout(resolve, 200);
    });

    const content = fs.readFileSync(dest, 'utf-8');
    expect(content).toContain('flush on beforeExit');
  });

  test('should catch "not ready" error on flushSync gracefully', async () => {
    const dest = await createTempFile();
    // Create async stream — fd may not be ready immediately
    const stream = buildSafeSonicBoom({ dest, sync: false });

    // Call autoEnd before fd is ready — should not throw
    expect(() => autoEnd(stream, 'exit')).not.toThrow();
    stream.destroy();
  });
});
