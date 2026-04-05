import fs from 'fs';
import https from 'https';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Mock dependencies to isolate bootstrap logic
const mockEndPointAPI = vi.fn().mockResolvedValue({} as any);
vi.mock('../../../../src/api/index', () => ({
  default: (...args: any[]) => mockEndPointAPI(...args),
}));

vi.mock('../../../../src/lib/experiments', () => ({
  displayExperimentsInfoBox: vi.fn(),
}));

vi.mock('../../../../src/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    fatal: vi.fn(),
  },
  setup: vi.fn(),
}));

vi.mock('../../../../src/lib/utils', () => ({
  initLogger: vi.fn(),
  logHTTPSWarning: vi.fn(),
}));

vi.mock('@verdaccio/config', () => ({
  getListenAddress: vi.fn(),
}));

import { getListenAddress } from '@verdaccio/config';

import { startVerdaccio } from '../../../../src/lib/bootstrap';
import { logger } from '../../../../src/lib/logger';
import { logHTTPSWarning } from '../../../../src/lib/utils';

describe('bootstrap handleHTTPS (via startVerdaccio)', () => {
  const mockCallback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockEndPointAPI.mockResolvedValue({} as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockEndPointAPI.mockResolvedValue({} as any);
  });

  describe('PFX certificate', () => {
    beforeEach(() => {
      vi.mocked(getListenAddress).mockReturnValue({
        proto: 'https',
        host: 'localhost',
        port: '4873',
      });
    });

    test('should create HTTPS server with PFX file and passphrase', async () => {
      const pfxContent = Buffer.from('fake-pfx-content');
      vi.spyOn(fs, 'readFileSync').mockReturnValue(pfxContent);
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const createServerSpy = vi.spyOn(https, 'createServer').mockReturnValue({} as any);

      const config = {
        https: {
          pfx: '/path/to/cert.pfx',
          passphrase: 'my-secret',
        },
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', (...args) => {
          mockCallback(...args);
          resolve();
        });
      });

      expect(createServerSpy).toHaveBeenCalledTimes(1);
      const httpsOptions = createServerSpy.mock.calls[0][0] as any;
      expect(httpsOptions.pfx).toEqual(pfxContent);
      expect(httpsOptions.passphrase).toBe('my-secret');
      expect(httpsOptions.secureOptions).toBeDefined();
      expect(mockCallback).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ proto: 'https' }),
        'verdaccio',
        '1.0.0'
      );
    });

    test('should create HTTPS server with PFX file and empty passphrase when not provided', async () => {
      const pfxContent = Buffer.from('fake-pfx-content');
      vi.spyOn(fs, 'readFileSync').mockReturnValue(pfxContent);
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const createServerSpy = vi.spyOn(https, 'createServer').mockReturnValue({} as any);

      const config = {
        https: {
          pfx: '/path/to/cert.pfx',
        },
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', (...args) => {
          mockCallback(...args);
          resolve();
        });
      });

      const httpsOptions = createServerSpy.mock.calls[0][0] as any;
      expect(httpsOptions.pfx).toEqual(pfxContent);
      expect(httpsOptions.passphrase).toBe('');
    });

    test('should read PFX file from the configured path', async () => {
      const readFileSpy = vi.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('pfx'));
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      vi.spyOn(https, 'createServer').mockReturnValue({} as any);

      const config = {
        https: {
          pfx: '/custom/path/server.pfx',
          passphrase: 'pass',
        },
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', () => {
          resolve();
        });
      });

      expect(readFileSpy).toHaveBeenCalledWith('/custom/path/server.pfx');
    });
  });

  describe('Key/Cert certificate', () => {
    beforeEach(() => {
      vi.mocked(getListenAddress).mockReturnValue({
        proto: 'https',
        host: 'localhost',
        port: '4873',
      });
    });

    test('should create HTTPS server with key and cert', async () => {
      const keyContent = Buffer.from('fake-key');
      const certContent = Buffer.from('fake-cert');
      vi.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
        if (filePath === '/path/key.pem') return keyContent;
        if (filePath === '/path/cert.pem') return certContent;
        return Buffer.from('');
      });
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const createServerSpy = vi.spyOn(https, 'createServer').mockReturnValue({} as any);

      const config = {
        https: {
          key: '/path/key.pem',
          cert: '/path/cert.pem',
        },
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', () => {
          resolve();
        });
      });

      const httpsOptions = createServerSpy.mock.calls[0][0] as any;
      expect(httpsOptions.key).toEqual(keyContent);
      expect(httpsOptions.cert).toEqual(certContent);
      expect(httpsOptions.ca).toBeUndefined();
    });

    test('should include CA certificate when provided', async () => {
      const caContent = Buffer.from('fake-ca');
      vi.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
        if (filePath === '/path/ca.pem') return caContent;
        return Buffer.from('content');
      });
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const createServerSpy = vi.spyOn(https, 'createServer').mockReturnValue({} as any);

      const config = {
        https: {
          key: '/path/key.pem',
          cert: '/path/cert.pem',
          ca: '/path/ca.pem',
        },
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', () => {
          resolve();
        });
      });

      const httpsOptions = createServerSpy.mock.calls[0][0] as any;
      expect(httpsOptions.ca).toEqual(caContent);
    });
  });

  describe('missing HTTPS configuration', () => {
    beforeEach(() => {
      vi.mocked(getListenAddress).mockReturnValue({
        proto: 'https',
        host: 'localhost',
        port: '4873',
      });
    });

    test('should call process.exit(2) when neither key/cert nor pfx is provided', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);

      const config = {
        https: {},
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', () => {
          resolve();
        });
        // callback won't be called since handleHTTPS fails, resolve after tick
        setTimeout(resolve, 50);
      });

      expect(logHTTPSWarning).toHaveBeenCalledWith('/config.yaml');
      expect(logger.fatal).toHaveBeenCalledWith(
        expect.objectContaining({ err: expect.any(Error) }),
        expect.stringContaining('cannot create https server')
      );
      expect(exitSpy).toHaveBeenCalledWith(2);
    });

    test('should call process.exit(2) when PFX file read fails', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('ENOENT: no such file');
      });

      const config = {
        https: {
          pfx: '/nonexistent/cert.pfx',
          passphrase: 'pass',
        },
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', () => {
          resolve();
        });
        setTimeout(resolve, 50);
      });

      expect(logger.fatal).toHaveBeenCalledWith(
        expect.objectContaining({ err: expect.any(Error) }),
        expect.stringContaining('cannot create https server')
      );
      expect(exitSpy).toHaveBeenCalledWith(2);
    });

    test('should call process.exit(2) when key/cert file read fails', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('ENOENT: no such file');
      });

      const config = {
        https: {
          key: '/nonexistent/key.pem',
          cert: '/nonexistent/cert.pem',
        },
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', () => {
          resolve();
        });
        setTimeout(resolve, 50);
      });

      expect(exitSpy).toHaveBeenCalledWith(2);
    });
  });

  describe('PFX takes precedence over key/cert', () => {
    test('should use PFX when both PFX and key/cert are provided', async () => {
      vi.mocked(getListenAddress).mockReturnValue({
        proto: 'https',
        host: 'localhost',
        port: '4873',
      });

      const pfxContent = Buffer.from('pfx-data');
      vi.spyOn(fs, 'readFileSync').mockReturnValue(pfxContent);
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const createServerSpy = vi.spyOn(https, 'createServer').mockReturnValue({} as any);

      const config = {
        https: {
          pfx: '/path/cert.pfx',
          passphrase: 'pass',
          key: '/path/key.pem',
          cert: '/path/cert.pem',
        },
      };

      await new Promise<void>((resolve) => {
        startVerdaccio(config as any, 'https://localhost:4873', '/config.yaml', '1.0.0', 'verdaccio', () => {
          resolve();
        });
      });

      const httpsOptions = createServerSpy.mock.calls[0][0] as any;
      // PFX path: readFileSync called once for pfx file
      expect(httpsOptions.pfx).toEqual(pfxContent);
      expect(httpsOptions.passphrase).toBe('pass');
      // Should NOT have key/cert properties from the key/cert path
      expect(httpsOptions.key).toBeUndefined();
      expect(httpsOptions.cert).toBeUndefined();
    });
  });
});
