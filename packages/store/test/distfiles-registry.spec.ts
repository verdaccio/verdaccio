import { pseudoRandomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import { generateRemotePackageMetadata } from '@verdaccio/test-helper';
import type { Logger, Manifest } from '@verdaccio/types';

import { Storage } from '../src';
import { configExample } from './helpers';

const UPLINK = 'https://fake.verdaccio.org';

let logger: Logger;
beforeAll(async () => {
  logger = await setup({ type: 'stdout', format: 'pretty', level: 'warn' });
});

describe('_distfiles bookkeeping', () => {
  test('records the uplink a version was merged from', async () => {
    const storagePath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), '/verdaccio-storage-')),
      pseudoRandomBytes(5).toString('hex')
    );
    const config = new Config(
      configExample(
        { ...getDefaultConfig(), storage: storagePath },
        './fixtures/config/syncSingleUplinksMetadata.yaml',
        import.meta.dirname
      )
    );
    const storage = new Storage(config, logger);
    await storage.init(config);

    const remote = generateRemotePackageMetadata('foo', '1.0.0', UPLINK) as Manifest;
    await storage.updateVersionsNext('foo', remote, 'ver');

    const cached = JSON.parse(
      fs.readFileSync(path.join(storagePath, 'foo', 'package.json'), 'utf8')
    );
    expect(cached._distfiles['foo-1.0.0.tgz']).toMatchObject({
      url: `${UPLINK}/foo/-/foo-1.0.0.tgz`,
      registry: 'ver',
    });
  });
});
