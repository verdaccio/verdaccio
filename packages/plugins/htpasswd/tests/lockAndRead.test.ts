import { access, chmod, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { fileUtils } from '@verdaccio/core';
import { unlockFile } from '@verdaccio/file-locking';

import { lockAndRead } from '../src/utils';

const run = (file: string) =>
  new Promise<{ err: NodeJS.ErrnoException | null; res?: string }>((resolve) =>
    lockAndRead(file, (err, res) => resolve({ err, res }))
  );

const createFile = async (content: string) => {
  const folder = await fileUtils.createTempFolder('htpasswd-lock');
  const file = path.join(folder, 'htpasswd');
  await writeFile(file, content);
  return file;
};

describe('lockAndRead', () => {
  test('returns the content and keeps the lock for the caller', async () => {
    const file = await createFile('user:hash\n');

    await expect(run(file)).resolves.toEqual({ err: null, res: 'user:hash\n' });
    await expect(access(`${file}.lock`)).resolves.toBeUndefined();
    await new Promise((resolve) => unlockFile(file, resolve));
  });

  test('does not leave a lock when the file is missing', async () => {
    const file = path.join(await fileUtils.createTempFolder('htpasswd-lock'), 'htpasswd');

    const { err } = await run(file);
    expect(err?.code).toBe('ENOENT');
    await expect(access(`${file}.lock`)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  test.skipIf(process.getuid?.() === 0)(
    'releases the lock when reading fails after locking',
    async () => {
      const file = await createFile('user:hash\n');
      await chmod(file, 0o000);

      const { err } = await run(file);
      await chmod(file, 0o600);
      expect(err?.code).toBe('EACCES');
      await expect(access(`${file}.lock`)).rejects.toMatchObject({ code: 'ENOENT' });
    }
  );
});
