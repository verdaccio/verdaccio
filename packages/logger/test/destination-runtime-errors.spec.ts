import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('file destination errors after ready', () => {
  let directory: string;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'logger-runtime-error-'));
  });

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  describe.each([true, false, undefined])('sync=%s', (sync) => {
    describe.each(['write', 'reopen'])('%s failure', (scenario) => {
      test.each(['natural', 'explicit'])(
        'reports repeated errors and survives %s exit',
        (exitMode) => {
          const outputPath = join(directory, 'live', 'output.log');
          const healthyPath = join(directory, 'healthy.log');
          const buildPath = join(import.meta.dirname, '..', 'build');
          // A child process exposes unhandled errors without adding test error listeners.
          const script = `
          const fs = require('node:fs');
          const pino = require('pino');
          const { prepareSetup } = require(${JSON.stringify(buildPath)});
          async function main() {
            const outputPath = ${JSON.stringify(outputPath)};
            const live = ${JSON.stringify(dirname(outputPath))};
            fs.mkdirSync(live);
            const logger = await prepareSetup(${JSON.stringify({ type: 'file', path: outputPath, format: 'json', sync })}, pino);
            const healthy = await prepareSetup(${JSON.stringify({ type: 'file', path: healthyPath, format: 'json', sync: false })}, pino);
            const destination = logger[pino.symbols.streamSym];
            logger.info('before failures');
            await new Promise((resolve, reject) => logger.flush(error => error ? reject(error) : resolve()));
            for (let attempt = 0; attempt < 2; attempt++) {
              if (${JSON.stringify(scenario)} === 'write') {
                await new Promise(resolve => {
                  const failure = Object.assign(new Error('disk full during test'), { code: 'ENOSPC' });
                  if (${JSON.stringify(sync ?? false)}) {
                    const original = fs.writeSync;
                    fs.writeSync = (fd, ...args) => {
                      if (fd !== destination.fd) return original(fd, ...args);
                      fs.writeSync = original;
                      throw failure;
                    };
                    logger.info('failed write ' + attempt);
                    resolve();
                  } else {
                    const original = fs.write;
                    fs.write = (fd, ...args) => {
                      if (fd !== destination.fd) return original(fd, ...args);
                      fs.write = original;
                      process.nextTick(() => { args.at(-1)(failure); resolve(); });
                    };
                    logger.info('failed write ' + attempt);
                  }
                });
              } else if (${JSON.stringify(sync ?? false)}) {
                // Stub openSync: Windows cannot rename a directory while SonicBoom holds the fd.
                const original = fs.openSync;
                fs.openSync = (file, ...args) => {
                  if (file !== outputPath) return original(file, ...args);
                  fs.openSync = original;
                  throw Object.assign(new Error('ENOENT during test'), { code: 'ENOENT' });
                };
                process.emit('SIGUSR2', 'SIGUSR2');
                await new Promise(resolve => process.nextTick(resolve));
              } else {
                await new Promise(resolve => {
                  const original = fs.open;
                  fs.open = (file, ...args) => {
                    if (file !== outputPath) return original(file, ...args);
                    fs.open = original;
                    const callback = args.pop();
                    process.nextTick(() => {
                      callback(Object.assign(new Error('ENOENT during test'), { code: 'ENOENT' }));
                      resolve();
                    });
                  };
                  process.emit('SIGUSR2', 'SIGUSR2');
                });
              }
            }
            if (${JSON.stringify(scenario)} === 'reopen') {
              const ready = new Promise(resolve => destination.once('ready', resolve));
              process.emit('SIGUSR2', 'SIGUSR2');
              await ready;
            }
            logger.info('after failures');
            healthy.info('healthy destination still flushes');
            process.stdout.write('survived\\n');
            if (${JSON.stringify(exitMode)} === 'explicit') process.exit(0);
          }
          main().catch(error => { console.error(error); process.exitCode = 1; });
        `;
          const result = spawnSync(process.execPath, ['-e', script], {
            cwd: join(import.meta.dirname, '..'),
            encoding: 'utf8',
            timeout: 5000,
          });

          expect(result.error).toBeUndefined();
          expect(result.signal).toBeNull();
          expect(result.status).toBe(0);
          expect(result.stdout).toBe('survived\n');
          const errors = result.stderr
            .trim()
            .split('\n')
            .map((line) => JSON.parse(line));
          expect(errors).toHaveLength(2);
          for (const error of errors) {
            expect(error).toMatchObject({
              level: 50,
              path: outputPath,
              err: { code: scenario === 'write' ? 'ENOSPC' : 'ENOENT' },
            });
          }
          const messages = readFileSync(outputPath, 'utf8')
            .trim()
            .split('\n')
            .map((line) => JSON.parse(line).msg);
          expect(messages).toContain('before failures');
          expect(messages).toContain('after failures');
          expect(JSON.parse(readFileSync(healthyPath, 'utf8')).msg).toBe(
            'healthy destination still flushes'
          );
        }
      );
    });
  });
});
