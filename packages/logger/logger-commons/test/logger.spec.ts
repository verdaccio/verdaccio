import { readFile } from 'fs/promises';
import { join } from 'path';
import pino from 'pino';
import { setTimeout } from 'timers/promises';

import { fileUtils } from '@verdaccio/core';

import { prepareSetup } from '../src';

async function readLogFile(path: string) {
  await setTimeout(1000, 'resolved');
  return readFile(path, 'utf8');
}

async function createLogFile() {
  const folder = await fileUtils.createTempFolder('logger-1');
  const file = join(folder, 'logger.log');
  return file;
}

const defaultOptions = {
  format: 'json',
  level: 'http',
  colors: false,
};

describe('logger test', () => {
  describe('basic', () => {
    test('should include default level', async () => {
      const file = await createLogFile();
      const logger = prepareSetup({ type: 'file', path: file, colors: false }, pino);
      logger.info({ packageName: 'test' }, `testing @{packageName}`);
      // Note: this should not be logged
      logger.debug(`this should not be logged`);
      // Note: this should not be logged
      logger.trace(`this should not be logged`);
      logger.error(`this should logged`);
      const content = await readLogFile(file);
      expect(content).toBe('info --- testing test \nerror--- this should logged \n');
    });

    test('should include all logging level', async () => {
      const file = await createLogFile();
      const logger = prepareSetup(
        { type: 'file', level: 'trace', path: file, colors: false },
        pino
      );
      logger.info({ packageName: 'test' }, `testing @{packageName}`);
      logger.debug(`this should not be logged`);
      logger.trace(`this should not be logged`);
      logger.error(`this should logged`);
      const content = await readLogFile(file);
      expect(content).toBe(
        'info --- testing test \ndebug--- this should not be logged \ntrace--- this should not be logged \nerror--- this should logged \n'
      );
    });
  });

  describe('json format', () => {
    test('should log into a file with json format', async () => {
      const file = await createLogFile();
      const logger = prepareSetup(
        {
          ...defaultOptions,
          format: 'json',
          type: 'file',
          path: file,
          level: 'info',
        },
        pino
      );
      logger.info(
        { packageName: 'test' },
        `publishing or updating a new version for @{packageName}`
      );
      const content = await readLogFile(file);
      expect(JSON.parse(content)).toEqual(
        expect.objectContaining({
          level: 30,
          msg: 'publishing or updating a new version for test',
        })
      );
    });
  });

  describe('pretty format', () => {
    test('should log into a file with pretty', async () => {
      const file = await createLogFile();
      const logger = prepareSetup(
        {
          format: 'pretty',
          type: 'file',
          path: file,
          level: 'trace',
          colors: false,
        },
        pino
      );
      logger.info(
        { packageName: 'test' },
        `publishing or updating a new version for @{packageName}`
      );
      const content = await readLogFile(file);
      expect(content).toEqual('info --- publishing or updating a new version for test \n');
    });

    test('should log into a file with pretty-timestamped', async () => {
      const file = await createLogFile();
      const logger = prepareSetup(
        {
          format: 'pretty-timestamped',
          type: 'file',
          path: file,
          level: 'trace',
          colors: false,
        },
        pino
      );
      logger.info(
        { packageName: 'test' },
        `publishing or updating a new version for @{packageName}`
      );
      const content = await readLogFile(file);
      // TODO: we might want mock time for testing
      expect(content).toMatch('info --- publishing or updating a new version for test \n');
    });
  });
});
