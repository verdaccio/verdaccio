import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import pino from 'pino';
import { describe, expect, test } from 'vitest';

import { fileUtils } from '@verdaccio/core';

import { prepareSetup } from '../src';

async function readLogFile(path: string) {
  await setTimeout(1000, 'resolved');
  return readFile(path, 'utf8');
}

async function createLogFile() {
  const folder = await fileUtils.createTempFolder('logger');
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
      const logger = await prepareSetup({ type: 'file', path: file, colors: false }, pino);
      logger.info({ packageName: 'test' }, `testing @{packageName}`);
      // Note: this should not be logged
      logger.debug(`this should not be logged`);
      // Note: this should not be logged
      logger.trace(`this should not be logged`);
      logger.error(`this should logged`);
      const content = await readLogFile(file);
      expect(content).toBe('info --- testing test\nerror--- this should logged\n');
    });

    test('should include all logging level', async () => {
      const file = await createLogFile();
      const logger = await prepareSetup(
        { type: 'file', level: 'trace', path: file, colors: false },
        pino
      );
      logger.info({ packageName: 'test' }, `testing @{packageName}`);
      logger.debug(`this should not be logged`);
      logger.trace(`this should not be logged`);
      logger.error(`this should logged`);
      const content = await readLogFile(file);
      expect(content).toBe(
        'info --- testing test\ndebug--- this should not be logged\ntrace--- this should not be logged\nerror--- this should logged\n'
      );
    });

    test('should fail if the log file cannot be opened', async () => {
      const folder = await fileUtils.createTempFolder('logger');
      await expect(prepareSetup({ type: 'file', path: folder }, pino)).rejects.toThrowError(
        'EISDIR'
      );
    });
  });

  describe('json format', () => {
    test('should log into a file with json format', async () => {
      const file = await createLogFile();
      const logger = await prepareSetup(
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
      const logger = await prepareSetup(
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
      expect(content).toEqual('info --- publishing or updating a new version for test\n');
    });

    test('should log into a file with pretty-timestamped', async () => {
      const file = await createLogFile();
      const logger = await prepareSetup(
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
      expect(content).toMatch('info --- publishing or updating a new version for test\n');
    });
  });

  describe('redacting sensitive data', () => {
    test('should redact sensitive data with default censor', async () => {
      const file = await createLogFile();
      const logger = prepareSetup(
        {
          ...defaultOptions,
          format: 'json',
          type: 'file',
          path: file,
          level: 'info',
          redact: {
            paths: ['password', 'token'],
          },
        },
        pino
      );
      logger.info(
        {
          user: 'testuser',
          password: 'secretpassword123',
          token: 'bearer-token-xyz',
          publicInfo: 'this should be visible',
        },
        'User authentication attempt'
      );

      const content = await readLogFile(file);
      const logEntry = JSON.parse(content);

      expect(logEntry.user).toBe('testuser');
      expect(logEntry.password).toBe('[Redacted]');
      expect(logEntry.token).toBe('[Redacted]');
      expect(logEntry.publicInfo).toBe('this should be visible');
      expect(logEntry.msg).toBe('User authentication attempt');
    });

    test('should redact sensitive data with custom censor string', async () => {
      const file = await createLogFile();
      const logger = prepareSetup(
        {
          ...defaultOptions,
          format: 'json',
          type: 'file',
          path: file,
          level: 'info',
          redact: {
            paths: ['apiKey', 'credentials.secret'],
            censor: '***HIDDEN***',
          },
        },
        pino
      );
      logger.info(
        {
          apiKey: 'api-key-12345',
          credentials: {
            secret: 'very-secret-data',
            publicKey: 'public-data-ok-to-show',
          },
          requestId: 'req-123',
        },
        'API request processed'
      );

      const content = await readLogFile(file);
      const logEntry = JSON.parse(content);

      expect(logEntry.apiKey).toBe('***HIDDEN***');
      expect(logEntry.credentials.secret).toBe('***HIDDEN***');
      expect(logEntry.credentials.publicKey).toBe('public-data-ok-to-show');
      expect(logEntry.requestId).toBe('req-123');
    });

    test('should remove sensitive fields when remove option is true', async () => {
      const file = await createLogFile();
      const logger = prepareSetup(
        {
          ...defaultOptions,
          format: 'json',
          type: 'file',
          path: file,
          level: 'info',
          redact: {
            paths: ['sensitiveData', 'auth.token'],
            remove: true,
          },
        },
        pino
      );
      logger.info(
        {
          sensitiveData: 'this should be completely removed',
          auth: {
            token: 'auth-token-456',
            userId: 'user123',
          },
          normalData: 'this should remain',
        },
        'Processing request with sensitive data'
      );

      const content = await readLogFile(file);
      const logEntry = JSON.parse(content);

      expect(logEntry).not.toHaveProperty('sensitiveData');
      expect(logEntry.auth).not.toHaveProperty('token');
      expect(logEntry.auth.userId).toBe('user123');
      expect(logEntry.normalData).toBe('this should remain');
    });

    test('should redact nested paths correctly', async () => {
      const file = await createLogFile();
      const logger = prepareSetup(
        {
          ...defaultOptions,
          format: 'json',
          type: 'file',
          path: file,
          level: 'info',
          redact: {
            paths: ['user.password', 'request.headers.authorization', 'data[*].secret'],
            censor: '<REDACTED>',
          },
        },
        pino
      );
      logger.info(
        {
          user: {
            name: 'john',
            password: 'userpassword',
            email: 'john@example.com',
          },
          request: {
            method: 'POST',
            headers: {
              authorization: 'Bearer token123',
              'content-type': 'application/json',
            },
          },
          data: [
            { id: 1, secret: 'secret1', value: 'public1' },
            { id: 2, secret: 'secret2', value: 'public2' },
          ],
        },
        'Complex nested data processing'
      );

      const content = await readLogFile(file);
      const logEntry = JSON.parse(content);

      expect(logEntry.user.name).toBe('john');
      expect(logEntry.user.password).toBe('<REDACTED>');
      expect(logEntry.user.email).toBe('john@example.com');
      expect(logEntry.request.method).toBe('POST');
      expect(logEntry.request.headers.authorization).toBe('<REDACTED>');
      expect(logEntry.request.headers['content-type']).toBe('application/json');
      expect(logEntry.data[0].secret).toBe('<REDACTED>');
      expect(logEntry.data[0].value).toBe('public1');
      expect(logEntry.data[1].secret).toBe('<REDACTED>');
      expect(logEntry.data[1].value).toBe('public2');
    });
  });
});
