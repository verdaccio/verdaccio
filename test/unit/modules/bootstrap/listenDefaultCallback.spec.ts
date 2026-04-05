import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { listenDefaultCallback } from '../../../../src/lib/bootstrap';
import { logger } from '../../../../src/lib/logger';

vi.mock('../../../../src/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    fatal: vi.fn(),
  },
}));

function createMockServer() {
  let listenCallback: (() => void) | undefined;
  let errorHandler: ((err: Error) => void) | undefined;
  let closeCallback: (() => void) | undefined;

  const server = {
    listen: vi.fn().mockImplementation((_portOrPath: any, _host: any, cb?: () => void) => {
      listenCallback = cb;
      return server;
    }),
    on: vi.fn().mockImplementation((event: string, handler: any) => {
      if (event === 'error') {
        errorHandler = handler;
      }
      return server;
    }),
    close: vi.fn().mockImplementation((cb?: () => void) => {
      closeCallback = cb;
      if (cb) cb();
    }),
  };

  return {
    server: server as any,
    triggerListen: () => listenCallback?.(),
    triggerError: (err: Error) => errorHandler?.(err),
    triggerClose: () => closeCallback?.(),
  };
}

describe('listenDefaultCallback', () => {
  const originalEnv = { ...process.env };
  const originalSend = process.send;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.VERDACCIO_HANDLE_KILL_SIGNALS;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
    process.send = originalSend;
    process.removeAllListeners('SIGINT');
    process.removeAllListeners('SIGTERM');
    process.removeAllListeners('SIGHUP');
  });

  test('should call listen with port and host', () => {
    const { server } = createMockServer();
    const addr = { proto: 'http', host: 'localhost', port: '4873' };

    listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

    expect(server.listen).toHaveBeenCalledWith('4873', 'localhost', expect.any(Function));
  });

  test('should call listen with path when port is not provided', () => {
    const { server } = createMockServer();
    const addr = { path: '/var/run/verdaccio.sock' };

    listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

    expect(server.listen).toHaveBeenCalledWith(
      '/var/run/verdaccio.sock',
      undefined,
      expect.any(Function)
    );
  });

  test('should call process.send when listen callback fires and process.send is available', () => {
    const { server, triggerListen } = createMockServer();
    const addr = { proto: 'http', host: 'localhost', port: '4873' };
    process.send = vi.fn();

    listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');
    triggerListen();

    expect(process.send).toHaveBeenCalledWith({ verdaccio_started: true });
  });

  test('should not throw when process.send is not available', () => {
    const { server, triggerListen } = createMockServer();
    const addr = { proto: 'http', host: 'localhost', port: '4873' };
    process.send = undefined;

    listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

    expect(() => triggerListen()).not.toThrow();
  });

  test('should register error handler on server', () => {
    const { server } = createMockServer();
    const addr = { proto: 'http', host: 'localhost', port: '4873' };

    listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

    expect(server.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  test('should call logger.fatal and process.exit(2) on server error', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const { server, triggerError } = createMockServer();
    const addr = { proto: 'http', host: 'localhost', port: '4873' };

    listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');
    triggerError(new Error('EADDRINUSE'));

    expect(logger.fatal).toHaveBeenCalledWith(
      expect.objectContaining({ err: expect.any(Error) }),
      expect.stringContaining('cannot create http server')
    );
    expect(exitSpy).toHaveBeenCalledWith(2);
  });

  test('should log address info with protocol, host, and port', () => {
    const { server } = createMockServer();
    const addr = { proto: 'http', host: 'localhost', port: '4873' };

    listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        addr: expect.stringContaining('http'),
        version: 'verdaccio/1.0.0',
      }),
      'http address - @{addr} - @{version}'
    );
  });

  test('should log unix socket address when path is provided', () => {
    const { server } = createMockServer();
    const addr = { path: '/var/run/verdaccio.sock' };

    listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        addr: expect.stringContaining('unix'),
        version: 'verdaccio/1.0.0',
      }),
      'http address - @{addr} - @{version}'
    );
  });

  describe('graceful shutdown signals', () => {
    test('should not register signal handlers when VERDACCIO_HANDLE_KILL_SIGNALS is not set', () => {
      const processOnSpy = vi.spyOn(process, 'on');
      const { server } = createMockServer();
      const addr = { proto: 'http', host: 'localhost', port: '4873' };

      listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

      const signalCalls = processOnSpy.mock.calls.filter(
        ([event]) => event === 'SIGINT' || event === 'SIGTERM' || event === 'SIGHUP'
      );
      expect(signalCalls).toHaveLength(0);
    });

    test('should register SIGINT, SIGTERM, and SIGHUP handlers when VERDACCIO_HANDLE_KILL_SIGNALS is true', () => {
      process.env.VERDACCIO_HANDLE_KILL_SIGNALS = 'true';
      const processOnSpy = vi.spyOn(process, 'on');
      const { server } = createMockServer();
      const addr = { proto: 'http', host: 'localhost', port: '4873' };

      listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

      const signalCalls = processOnSpy.mock.calls
        .filter(([event]) => event === 'SIGINT' || event === 'SIGTERM' || event === 'SIGHUP')
        .map(([event]) => event);
      expect(signalCalls).toEqual(['SIGINT', 'SIGTERM', 'SIGHUP']);
    });

    test('should close server and exit(0) on shutdown signal', () => {
      process.env.VERDACCIO_HANDLE_KILL_SIGNALS = 'true';
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
      const { server } = createMockServer();
      const addr = { proto: 'http', host: 'localhost', port: '4873' };

      listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');
      process.emit('SIGINT');

      expect(server.close).toHaveBeenCalled();
      expect(logger.fatal).toHaveBeenCalledWith(
        expect.stringContaining('received shutdown signal')
      );
      expect(logger.info).toHaveBeenCalledWith('server closed.');
      expect(exitSpy).toHaveBeenCalledWith(0);
    });

    test('should not register signal handlers when VERDACCIO_HANDLE_KILL_SIGNALS is not "true"', () => {
      process.env.VERDACCIO_HANDLE_KILL_SIGNALS = 'false';
      const processOnSpy = vi.spyOn(process, 'on');
      const { server } = createMockServer();
      const addr = { proto: 'http', host: 'localhost', port: '4873' };

      listenDefaultCallback(server, addr, 'verdaccio', '1.0.0');

      const signalCalls = processOnSpy.mock.calls.filter(
        ([event]) => event === 'SIGINT' || event === 'SIGTERM' || event === 'SIGHUP'
      );
      expect(signalCalls).toHaveLength(0);
    });
  });
});
