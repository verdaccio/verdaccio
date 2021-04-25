import { parseConfigFile } from '../src';
import { parseConfigurationFile } from './utils';

describe('Package access utilities', () => {
  describe('JSON format', () => {
    test('parse default.json', () => {
      const config = parseConfigFile(parseConfigurationFile('default.json'));

      expect(config.storage).toBeDefined();
    });

    test('parse invalid.json', () => {
      expect(function () {
        parseConfigFile(parseConfigurationFile('invalid.json'));
      }).toThrow(/Error/);
    });

    test('parse not-exists.json', () => {
      expect(function () {
        parseConfigFile(parseConfigurationFile('not-exists.json'));
      }).toThrow(/Error/);
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
      }).toThrow(/Error/);
    });

    test('parse not-exists.js', () => {
      expect(function () {
        parseConfigFile(parseConfigurationFile('not-exists.js'));
      }).toThrow(/Error/);
    });
  });
});
