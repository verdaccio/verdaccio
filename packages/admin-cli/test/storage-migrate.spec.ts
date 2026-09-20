import { Cli } from 'clipanion';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { describe, expect, test } from 'vitest';

import { StorageMigrateCommand } from '../src/commands/storage/migrate';

async function runMigrate(args: string[]): Promise<{ code: number; out: string }> {
  const cli = new Cli();
  cli.register(StorageMigrateCommand);
  let out = '';
  const stdout = new PassThrough();
  stdout.on('data', (chunk) => (out += chunk));
  const stderr = new PassThrough();
  stderr.resume();
  const code = await cli.run(['storage', 'migrate', ...args], {
    ...Cli.defaultContext,
    stdin: new PassThrough() as unknown as NodeJS.ReadStream,
    stdout,
    stderr,
  });
  return { code, out };
}

describe('storage migrate', () => {
  test('migrates the registry state even when the source has no packages', async () => {
    const src = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-mig-src-'));
    const dest = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-mig-dest-'));
    await fs.writeFile(path.join(src, '.verdaccio-db.json'), 'SRC-DB');

    const { code } = await runMigrate(['--from', src, '--to', dest, '--yes']);
    expect(code).toBe(0);
    expect(await fs.readFile(path.join(dest, '.verdaccio-db.json'), 'utf8')).toBe('SRC-DB');
    await fs.rm(src, { recursive: true, force: true });
    await fs.rm(dest, { recursive: true, force: true });
  });

  test('rejects when source and destination are the same directory', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-mig-same-'));
    const { code } = await runMigrate(['--from', dir, '--to', dir, '--yes']);
    expect(code).toBe(1);
    await fs.rm(dir, { recursive: true, force: true });
  });

  test('dry-run copies nothing', async () => {
    const src = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-mig-dry-'));
    // unique parent so a prior run or parallel worker can never pre-create the target
    const parent = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-mig-dry-parent-'));
    const dest = path.join(parent, 'dest');
    await fs.writeFile(path.join(src, '.verdaccio-db.json'), 'DB');

    const { code } = await runMigrate(['--from', src, '--to', dest, '--dry-run']);
    expect(code).toBe(0);
    expect(
      await fs
        .access(dest)
        .then(() => true)
        .catch(() => false)
    ).toBe(false);
    await fs.rm(src, { recursive: true, force: true });
    await fs.rm(parent, { recursive: true, force: true });
  });
});
