import { describe, expect, test } from 'vitest';

import { APP_ERROR } from '@verdaccio/core';

import { parseConfigFile } from '../src';
import { parseConfigurationFile } from './utils';

describe('Package access utilities', () => {
  describe('JSON format', () => {
    test('parse default.json', async () => {
      const config = await parseConfigFile(parseConfigurationFile('default.json'));
      expect(config.storage).toBeDefined();
    });

    test('parse invalid.json', async () => {
      await expect(parseConfigFile(parseConfigurationFile('invalid.json'))).rejects.toThrow(
        /CONFIG: it does not look like a valid config file/
      );
    });

    test('parse not-exists.json', async () => {
      await expect(parseConfigFile(parseConfigurationFile('not-exists.json'))).rejects.toThrow(
        APP_ERROR.CONFIG_NOT_VALID
      );
    });

    describe('JavaScript format', () => {
      test('parse default.js', async () => {
        const config = await parseConfigFile(parseConfigurationFile('default.js'));
        expect(config.storage).toBeDefined();
      });

      test('parse invalid.js', async () => {
        await expect(parseConfigFile(parseConfigurationFile('invalid.json'))).rejects.toThrow(
          /CONFIG: it does not look like a valid config file/
        );
      });
      test('parse not-exists.js', async () => {
        await expect(parseConfigFile(parseConfigurationFile('not-exists.js'))).rejects.toThrow(
          APP_ERROR.CONFIG_NOT_VALID
        );
      });
    });
  });
});
