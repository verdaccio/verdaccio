import nock from 'nock';
import { pseudoRandomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import type { ConfigYaml, Logger, Manifest } from '@verdaccio/types';

import { Storage } from '../src';
import { configExample } from './helpers';

export const UPLINK = 'https://fake.verdaccio.org';
export const NPMJS = 'https://registry.npmjs.org';
export const EXPIRED = 10 * 60 * 1000;

let logger: Logger | undefined;

function randomStorage(): string {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), '/verdaccio-storage-'));
  return path.join(tempRoot, pseudoRandomBytes(5).toString('hex'));
}

export async function createStorage(fixture: string, override: Partial<ConfigYaml> = {}) {
  logger ??= await setup({ type: 'stdout', format: 'pretty', level: 'warn' });
  const storagePath = randomStorage();
  const config = new Config(
    configExample(
      { ...getDefaultConfig(), storage: storagePath, ...override },
      `./fixtures/config/${fixture}`,
      import.meta.dirname
    )
  );
  const storage = new Storage(config, logger);
  await storage.init(config);
  return { storage, storagePath };
}

function manifestPath(storagePath: string, name: string): string {
  return path.join(storagePath, name, 'package.json');
}

export function readManifest(storagePath: string, name: string): any {
  return JSON.parse(fs.readFileSync(manifestPath(storagePath, name), 'utf8'));
}

export function writeManifest(storagePath: string, name: string, manifest: any): void {
  fs.writeFileSync(manifestPath(storagePath, name), JSON.stringify(manifest));
}

/**
 * Fill the local cache from the uplink and leave it in the state of issue #6115:
 * a stored etag and a `fetched` timestamp older than the uplink maxage.
 */
export async function seedExpiredCache(
  storage: Storage,
  storagePath: string,
  name: string,
  manifest: Manifest,
  uplinks: Record<string, string> = { ver: 'etag-ver' }
) {
  nock(UPLINK).get(`/${name}`).reply(200, manifest);
  await storage.syncUplinksMetadata(name, null, { retry: { limit: 0 } });
  const onDisk = readManifest(storagePath, name);
  onDisk._uplinks = Object.fromEntries(
    Object.entries(uplinks).map(([uplink, etag]) => [
      uplink,
      { etag, fetched: Date.now() - EXPIRED },
    ])
  );
  writeManifest(storagePath, name, onDisk);
  nock.cleanAll();
  return onDisk;
}

/** Counts the requests the uplink actually receives. */
export function countingUplink(host: string, name: string, status: number, body?: any) {
  const counter = { hits: 0 };
  nock(host)
    .get(`/${name}`)
    .times(10)
    .reply(function () {
      counter.hits++;
      return body === undefined ? [status] : [status, body];
    });
  return counter;
}
