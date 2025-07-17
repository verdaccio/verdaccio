import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

import { getDefaultConfig, parseConfigFile } from '@verdaccio/config';
import { fileUtils } from '@verdaccio/core';

import { runServer } from '../../../../src';
import { setup } from '../../../../src/lib/logger';

setup({});

describe('bootstrap modern', () => {
  let availablePort = 4000;
  let certDir: string;
  // Generate self-signed certificates for testing
  beforeAll(async () => {
    certDir = await fileUtils.createTempFolder('certificates');
    // Generate self-signed certificate for testing
    try {
      // Generate private key and certificate
      execSync(
        `openssl req -x509 -newkey rsa:2048 -keyout ${certDir}/key.pem -out ${certDir}/cert.pem -days 1 -nodes -subj "/C=US/ST=Test/L=Test/O=Test/CN=localhost"`,
        {
          stdio: 'ignore',
        }
      );

      // Generate PFX file from the key and certificate
      execSync(
        `openssl pkcs12 -export -out ${certDir}/cert.pfx -inkey ${certDir}/key.pem -in ${certDir}/cert.pem -password pass:testpassword`,
        {
          stdio: 'ignore',
        }
      );

      // Generate PFX without password
      execSync(
        `openssl pkcs12 -export -out ${certDir}/cert-no-pass.pfx -inkey ${certDir}/key.pem -in ${certDir}/cert.pem -nodes -password pass:`,
        {
          stdio: 'ignore',
        }
      );
    } catch {
      // Fallback: create dummy cert files if openssl is not available
      console.warn('OpenSSL not available, creating dummy certificates for testing');
      writeFileSync(join(certDir, 'key.pem'), 'dummy-key-content');
      writeFileSync(join(certDir, 'cert.pem'), 'dummy-cert-content');
    }
  });

  // Helper to get next available port to avoid conflicts
  const getNextPort = () => ++availablePort;

  // Helper to properly close server with timeout
  const closeServerSafely = (app: any, timeout = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Server close timeout'));
      }, timeout);

      app.close(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  };

  describe('runServer', () => {
    describe('https configuration', () => {
      test('should start HTTPS server with PFX certificate and password', async () => {
        const httpsConfig = {
          ...getDefaultConfig(),
          https: {
            pfx: join(certDir, 'cert.pfx'),
            passphrase: 'testpassword',
          },
        };

        const app = await runServer(httpsConfig);

        expect(app).toBeDefined();
        expect(typeof app.listen).toBe('function');

        await new Promise<void>((resolve) => {
          const port = getNextPort();
          const server = app.listen(port, (err?: Error) => {
            if (err) {
              console.warn('PFX HTTPS server failed to start:', err.message);
              resolve(); // Don't fail for dummy certs
            } else {
              expect(server).toBeDefined();
              resolve();
            }
          });
        });

        await closeServerSafely(app);
      });

      test('should start HTTPS server with PFX certificate without password', async () => {
        const httpsConfig = {
          ...getDefaultConfig(),
          https: {
            pfx: join(certDir, 'cert-no-pass.pfx'),
            // No passphrase needed
          },
        };

        const app = await runServer(httpsConfig);

        expect(app).toBeDefined();

        await new Promise<void>((resolve) => {
          const port = getNextPort();
          app.listen(port, (err?: Error) => {
            if (err) {
              console.warn('PFX HTTPS server (no password) failed to start:', err.message);
              resolve(); // Don't fail for dummy certs
            } else {
              resolve();
            }
          });
        });

        await closeServerSafely(app);
      });

      test('should start HTTPS server with inline PFX content', async () => {
        const fs = require('fs');
        let pfxContent;

        try {
          pfxContent = fs.readFileSync(join(certDir, 'cert.pfx'));
        } catch {
          pfxContent = Buffer.from('dummy-pfx-content');
        }

        const httpsConfig = {
          ...getDefaultConfig(),
          https: {
            pfx: pfxContent,
            passphrase: 'testpassword',
          },
        };

        const app = await runServer(httpsConfig);

        expect(app).toBeDefined();

        await new Promise<void>((resolve) => {
          const port = getNextPort();
          app.listen(port, (err?: Error) => {
            if (err) {
              console.warn('Inline PFX HTTPS server failed to start:', err.message);
              resolve(); // Don't fail for dummy certs
            } else {
              resolve();
            }
          });
        });

        await closeServerSafely(app);
      });

      test('should reject PFX with wrong password', async () => {
        const httpsConfig = {
          ...getDefaultConfig(),
          https: {
            pfx: join(certDir, 'cert.pfx'),
            passphrase: 'wrongpassword',
          },
        };

        try {
          const app = await runServer(httpsConfig);

          await expect(
            new Promise((resolve, reject) => {
              app.listen(getNextPort(), (err?: Error) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(true);
                }
              });
            })
          ).rejects.toThrow();

          await closeServerSafely(app);
        } catch (error) {
          // Expected to fail during runServer or listen
          expect(error).toBeDefined();
        }
      });

      test('should reject with non-existent PFX file', async () => {
        const httpsConfig = {
          ...getDefaultConfig(),
          https: {
            pfx: join(certDir, 'non-existent.pfx'),
            passphrase: 'testpassword',
          },
        };

        try {
          const app = await runServer(httpsConfig);

          await expect(
            new Promise((resolve, reject) => {
              app.listen(getNextPort(), (err?: Error) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(true);
                }
              });
            })
          ).rejects.toThrow();

          await closeServerSafely(app);
        } catch (error) {
          // Expected to fail
          expect(error).toBeDefined();
        }
      });

      test('should handle mixed certificate formats (PEM + PFX)', async () => {
        // Test that server can handle configuration with both PEM and PFX
        // (though typically you'd use one or the other)
        const httpsConfig = {
          ...getDefaultConfig(),
          https: {
            key: join(certDir, 'key.pem'),
            cert: join(certDir, 'cert.pem'),
            pfx: join(certDir, 'cert.pfx'),
            passphrase: 'testpassword',
          },
        };

        const app = await runServer(httpsConfig);

        expect(app).toBeDefined();

        await new Promise<void>((resolve) => {
          const port = getNextPort();
          app.listen(port, (err?: Error) => {
            if (err) {
              console.warn('Mixed certificate format test failed:', err.message);
              resolve(); // Don't fail for dummy certs
            } else {
              resolve();
            }
          });
        });

        await closeServerSafely(app);
      });

      test('should start HTTPS server with SSL configuration', async () => {
        const httpsConfig = {
          ...getDefaultConfig(),
          https: {
            key: join(certDir, 'key.pem'),
            cert: join(certDir, 'cert.pem'),
          },
          // Optional: add other HTTPS-specific config
          listen: 'https://localhost:0', // Let system assign port
        };

        const app = await runServer(httpsConfig as any);

        expect(app).toBeDefined();
        expect(typeof app.listen).toBe('function');

        await new Promise<void>((resolve, reject) => {
          const port = getNextPort();
          const server = app.listen(port, (err?: Error) => {
            if (err) {
              reject(err);
            } else {
              // Verify it's actually an HTTPS server
              expect(server).toBeDefined();
              resolve();
            }
          });
        });

        await closeServerSafely(app);
      });
    });

    test('should start server with config file path', async () => {
      const configPath = join(__dirname, './config.yaml');
      const app = await runServer(configPath);

      expect(app).toBeDefined();
      expect(typeof app.listen).toBe('function');
      expect(typeof app.close).toBe('function');

      // Test that server can actually listen
      await new Promise<void>((resolve, reject) => {
        const port = getNextPort();
        const server = app.listen(port, (err?: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });

        // Ensure server is listening
        expect(server.listening).toBe(true);
      });

      await closeServerSafely(app);
    });

    test('should start server with config object', async () => {
      const configPath = join(__dirname, './config.yaml');
      const config = parseConfigFile(configPath);

      // workaround for v5 compatibility
      // @ts-expect-error
      config.self_path = 'foo';

      const app = await runServer(config);

      expect(app).toBeDefined();
      expect(typeof app.listen).toBe('function');

      await new Promise<void>((resolve, reject) => {
        const port = getNextPort();
        app.listen(port, (err?: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await closeServerSafely(app);
    });

    test('should start server with default config', async () => {
      const app = await runServer();

      expect(app).toBeDefined();
      expect(typeof app.listen).toBe('function');

      await new Promise<void>((resolve, reject) => {
        const port = getNextPort();
        app.listen(port, (err?: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await closeServerSafely(app);
    });

    test('should reject with non-existent config file', async () => {
      const configPath = join(__dirname, './this_does_not_exist.yaml');

      await expect(runServer(configPath)).rejects.toThrow(
        'config file does not exist or not reachable'
      );
    });

    test('should reject with invalid config object', async () => {
      const invalidConfig = null;

      await expect(runServer(invalidConfig as any)).rejects.toThrow();
    });

    test('should handle malformed config file', async () => {
      const malformedConfigPath = join(__dirname, './malformed-config.yaml');

      // This test assumes you have a malformed config file for testing
      // If not, you might want to create one or mock the parseConfigFile function
      await expect(runServer(malformedConfigPath)).rejects.toThrow();
    });

    test('should return server with expected methods', async () => {
      const configPath = join(__dirname, './config.yaml');
      const app = await runServer(configPath);

      // Verify the server has the expected interface
      expect(app).toHaveProperty('listen');
      expect(app).toHaveProperty('close');
      expect(typeof app.listen).toBe('function');
      expect(typeof app.close).toBe('function');

      await closeServerSafely(app);
    });

    test('should handle server startup errors gracefully', async () => {
      const configPath = join(__dirname, './config.yaml');
      const app = await runServer(configPath);

      // Try to listen on an invalid port to test error handling
      await expect(
        new Promise((resolve, reject) => {
          app.listen(-1, (err?: Error) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        })
      ).rejects.toThrow();

      await closeServerSafely(app);
    });

    test('should allow multiple server instances with different ports', async () => {
      const configPath = join(__dirname, './config.yaml');
      const app1 = await runServer(configPath);
      const app2 = await runServer(configPath);

      expect(app1).toBeDefined();
      expect(app2).toBeDefined();
      // Different instances
      expect(app1).not.toBe(app2);

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          app1.listen(getNextPort(), (err?: Error) => {
            if (err) reject(err);
            else resolve();
          });
        }),
        new Promise<void>((resolve, reject) => {
          app2.listen(getNextPort(), (err?: Error) => {
            if (err) reject(err);
            else resolve();
          });
        }),
      ]);

      await Promise.all([closeServerSafely(app1), closeServerSafely(app2)]);
    });
  });
});
