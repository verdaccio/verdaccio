import path from 'node:path';
import { describe, expect, test } from 'vitest';

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
