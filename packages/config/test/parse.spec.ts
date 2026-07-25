import path from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { getConfigParsed, parseConfigFile } from '../src';

describe('getConfigParsed', () => {
  const partialsDir = path.join(__dirname, './partials/config/yaml');

  test('parses config from a YAML file path', () => {
    const yamlFile = path.join(partialsDir, 'config-getMatchedPackagesSpec.yaml');
    const config = getConfigParsed(yamlFile);
    expect(config).toBeDefined();
  });

  test('parses config from JSON', () => {
    const yamlFile = path.join(partialsDir, 'config-getMatchedPackagesSpec.yaml');
    const config = getConfigParsed(parseConfigFile(yamlFile));
    expect(config).toBeDefined();
  });

  test('throws error for invalid config type', () => {
    // @ts-expect-error
    expect(() => getConfigParsed(123)).toThrow();
    // @ts-expect-error
    expect(() => getConfigParsed(true)).toThrow();
  });
});

describe('parseConfigFile', () => {
  const jsPartialsDir = path.join(__dirname, './partials/config/js');

  describe('JS config deprecation warning', () => {
    let warningSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warningSpy = vi.spyOn(process, 'emitWarning');
    });

    afterEach(() => {
      warningSpy.mockRestore();
    });

    // must run before any other test parsing a JS config: VERDEP004 is
    // emitted only once per process (process-warning deduplication)
    test('emits a VerdaccioDeprecation VERDEP004 warning when loading a JS config', () => {
      const jsFile = path.join(jsPartialsDir, 'default.js');
      parseConfigFile(jsFile);

      expect(warningSpy).toHaveBeenCalledWith(
        expect.stringContaining('JavaScript configuration files are deprecated'),
        'VerdaccioDeprecation',
        'VERDEP004'
      );
    });

    test('does not emit a deprecation warning when loading a YAML config', () => {
      const yamlFile = path.join(
        __dirname,
        './partials/config/yaml/config-getMatchedPackagesSpec.yaml'
      );
      parseConfigFile(yamlFile);

      expect(warningSpy).not.toHaveBeenCalled();
    });
  });

  test('parses a JS config file', () => {
    const jsFile = path.join(jsPartialsDir, 'default.js');
    const config = parseConfigFile(jsFile);
    expect(config).toBeDefined();
    expect(config.configPath).toBe(jsFile);
    expect(config.config_path).toBe(jsFile);
  });

  test('throws when config file does not exist', () => {
    expect(() => parseConfigFile('/nonexistent/path/config.yaml')).toThrow(
      'config file does not exist or not reachable'
    );
  });
});
