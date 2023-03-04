import fs from 'fs';
import path from 'path';

import { fileUtils } from '@verdaccio/core';

import { fromJStoYAML, parseConfigFile } from '../src';
import { parseConfigurationFile } from './utils';

const { writeFile } = fs.promises ? fs.promises : require('fs/promises');

describe('parse', () => {
  describe('parseConfigFile', () => {
    describe('JSON format', () => {
      test('parse default.json', () => {
        const config = parseConfigFile(parseConfigurationFile('default.json'));

        expect(config.storage).toBeDefined();
      });

      test('parse invalid.json', () => {
        expect(function () {
          parseConfigFile(parseConfigurationFile('invalid.json'));
        }).toThrow(new RegExp(/CONFIG: it does not look like a valid config file/));
      });

      test('parse not-exists.json', () => {
        expect(function () {
          parseConfigFile(parseConfigurationFile('not-exists.json'));
        }).toThrow(/config file does not exist or not reachable/);
      });
    });

    describe('JavaScript format', () => {
      test('parse default.js', () => {
        const config = parseConfigFile(parseConfigurationFile('default.js'));

        expect(config.storage).toBeDefined();
      });

      test('parse invalid.js', () => {
        expect(function () {
          parseConfigFile(parseConfigurationFile('invalid.js'));
        }).toThrow(new RegExp(/CONFIG: it does not look like a valid config file/));
      });

      test('parse not-exists.js', () => {
        expect(function () {
          parseConfigFile(parseConfigurationFile('not-exists.js'));
        }).toThrow(/config file does not exist or not reachable/);
      });
    });
  });

  describe('fromJStoYAML', () => {
    test('basic conversion roundtrip', async () => {
      // from to js to yaml
      const config = require('./partials/config/js/from-js-to-yaml');
      const yaml = fromJStoYAML(config) as string;
      expect(yaml).toMatchSnapshot();
      const tempFolder = await fileUtils.createTempFolder('fromJStoYAML-test');
      const configPath = path.join(tempFolder, 'config.yaml');
      await writeFile(configPath, yaml);
      const parsed = parseConfigFile(configPath);
      expect(parsed.configPath).toEqual(path.join(tempFolder, 'config.yaml'));
      expect(parsed.storage).toEqual('./storage_default_storage');
      expect(parsed.uplinks).toEqual({ npmjs: { url: 'http://localhost:4873/' } });
      expect(parsed.log).toEqual({ type: 'stdout', format: 'pretty', level: 'warn' });
    });
  });
});
