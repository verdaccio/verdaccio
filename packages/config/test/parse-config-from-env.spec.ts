import path from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { getConfigParsed } from '../src';

beforeAll(() => {
  process.env.TEST_STORAGE_PATH = '/verdaccio/storage';
  process.env.TEST_LOG_CONFIG = '{"type": "stdout", "format": "pretty", "level": "warn"}';
  process.env.TEST_WEB_TITLE = 'VerdaccioTestTitle';
  process.env.TEST_WEB_SHOW_INFO = 'true'; // boolean
  process.env.TEST_META_SCRIPT_1 =
    '<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>';
  process.env.TEST_META_SCRIPT_2 = '<meta name="robots" content="noindex">';
  process.env.TEST_SERVER_KEEP_ALIVE_TIMEOUT = '60'; // number
});

afterAll(() => {
  delete process.env.TEST_STORAGE_PATH;
  delete process.env.TEST_LOG_CONFIG;
  delete process.env.TEST_WEB_TITLE;
  delete process.env.TEST_WEB_SHOW_INFO;
  delete process.env.TEST_META_SCRIPT_1;
  delete process.env.TEST_META_SCRIPT_2;
  delete process.env.TEST_SERVER_KEEP_ALIVE_TIMEOUT;
});

describe('getConfigParsed with config from env', () => {
  const partialsDir = path.join(__dirname, './partials/config/yaml');

  test('parses config', () => {
    const yamlFile = path.join(partialsDir, 'config-from-env.yaml');
    const config = getConfigParsed(yamlFile);
    expect(config).toBeDefined();
    expect(config.storage).toStrictEqual('/verdaccio/storage');
    expect(config.log?.type).toStrictEqual('stdout');
    expect(config.log?.format).toStrictEqual('pretty');
    expect(config.log?.level).toStrictEqual('warn');
    expect(config.web?.title).toStrictEqual('VerdaccioTestTitle');
    expect(config.web?.showInfo).toStrictEqual(true); // boolean
    expect(config.web?.metaScripts).toStrictEqual([
      '<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>',
      '<meta name="robots" content="noindex">',
    ]);
    expect(config.server?.keepAliveTimeout).toStrictEqual(60); // number
  });
});
