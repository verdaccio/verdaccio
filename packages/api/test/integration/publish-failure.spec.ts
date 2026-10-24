import { createHash } from 'node:crypto';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { finished } from 'node:stream/promises';
import { setImmediate } from 'node:timers/promises';
import supertest from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import type { Manifest } from '@verdaccio/types';

import * as fileUtils from '../../../plugins/local-storage/src/fs';
import LocalFS from '../../../plugins/local-storage/src/local-fs';
import { initializeServerWithContext } from './_helper';

// Exercise the HTTP route with this branch's Store and real LocalFS implementation.
vi.mock('@verdaccio/store', () => import('../../../store/src'));
vi.mock('@verdaccio/local-storage', () => import('../../../plugins/local-storage/src'));

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  try {
    for (const cleanup of cleanups.splice(0)) await cleanup();
  } finally {
    vi.restoreAllMocks();
  }
});

async function fixture(pkgName: string) {
  const { app, config, storage, logger } = await initializeServerWithContext('publish.yaml');
  const root = config.storage as string;
  const packagePath = path.join(root, pkgName);
  const manifestPath = path.join(packagePath, 'package.json');
  const updates = vi.spyOn(
    storage as unknown as {
      updatePackage: (
        name: string,
        update: (manifest: Manifest) => Promise<Manifest>
      ) => Promise<Manifest>;
    },
    'updatePackage'
  );
  const plugin = storage.localStorage.getStoragePlugin();
  // Plugin loading uses require; pin its handler to the source instrumented below.
  vi.spyOn(plugin, 'getPackageStorage').mockReturnValue(new LocalFS(packagePath, logger));
  const completions: Promise<unknown>[] = [];
  const destinations: fs.WriteStream[] = [];
  const writeTarball = LocalFS.prototype.writeTarball;
  const write = vi.spyOn(LocalFS.prototype, 'writeTarball').mockImplementation(async function (
    this: LocalFS,
    ...args
  ) {
    const destination = (await writeTarball.apply(this, args)) as fs.WriteStream;
    destinations.push(destination);
    completions.push(finished(destination, { cleanup: true }).catch((error) => error));
    completions.push(new Promise<void>((resolve) => destination.once('close', resolve)));
    return destination;
  });
  cleanups.push(async () => {
    destinations.forEach((destination) => destination.destroy());
    await Promise.all(completions);
    await Promise.allSettled(updates.mock.results.map((result) => result.value));
    await fsPromises.rm(root, { recursive: true, force: true });
  });

  function payload(version: string) {
    return generatePackageMetadata(pkgName, version);
  }

  function publish(metadata: Manifest) {
    return supertest(app)
      .put(`/${encodeURIComponent(pkgName)}`)
      .send(metadata)
      .timeout({ deadline: 3000 });
  }

  function readManifest(): Promise<Manifest> {
    return fsPromises.readFile(manifestPath, 'utf8').then(JSON.parse);
  }

  async function expectAvailable(metadata: Manifest) {
    const [filename] = Object.keys(metadata._attachments);
    const content = Buffer.from(metadata._attachments[filename].data as string, 'base64');
    expect(await fsPromises.readFile(path.join(packagePath, filename))).toEqual(content);
    const saved = await readManifest();
    expect(saved._attachments[filename]).toEqual({
      shasum: createHash('sha1').update(content).digest('hex'),
    });
    const response = await supertest(app)
      .get(`/${encodeURIComponent(pkgName)}/-/${filename}`)
      .timeout({ deadline: 3000 })
      .expect(HTTP_STATUS.OK);
    expect(response.body).toEqual(content);
    expect(Number(response.headers['content-length'])).toBe(content.length);
  }

  return {
    app,
    packagePath,
    payload,
    publish,
    readManifest,
    expectAvailable,
    write,
    completions,
    destinations,
  };
}

describe.each(['publish-failure', '@scope/publish-failure'])('HTTP publishing of %s', (pkgName) => {
  test.each([
    '',
    '..',
    '.hidden.tgz',
    'foo bar.tgz',
    'node_modules',
    'favicon.ico',
    '__proto__',
    'NODE_MODULES',
    'foo%20bar.tgz',
    'foo\\bar.tgz',
    '@scope/.hidden.tgz',
    '@scope/node_modules',
    '@scope/__proto__',
    '@scope/valid/..',
  ])('rejects invalid attachment %j before writing and allows a corrected retry', async (key) => {
    const ctx = await fixture(pkgName);
    for (const version of ['1.0.0', '1.0.1']) {
      const previous = version === '1.0.1' ? await ctx.readManifest() : undefined;
      const metadata = ctx.payload(version);
      const [attachment] = Object.values(metadata._attachments);
      const attempts = ctx.write.mock.calls.length;
      const response = await ctx
        .publish({ ...metadata, _attachments: { [key]: attachment } })
        .expect(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toEqual(`invalid tarball name ${key}`);
      expect(response.body.success).toBeUndefined();
      expect(ctx.write).toHaveBeenCalledTimes(attempts);
      if (previous) {
        expect(await ctx.readManifest()).toEqual(previous);
      } else {
        expect(fs.existsSync(ctx.packagePath)).toBe(false);
      }
      await ctx.publish(metadata).expect(HTTP_STATUS.CREATED);
      await ctx.expectAvailable(metadata);
      const saved = await ctx.readManifest();
      expect(saved.versions[version]).toBeDefined();
      expect(saved['dist-tags'].latest).toBe(version);
    }
  });

  test.each(['plain', 'scoped', 'legacy'] as const)(
    'accepts a %s attachment name and serves the stored tarball',
    async (style) => {
      const ctx = await fixture(pkgName);
      const metadata = ctx.payload('1.0.0');
      const [attachment] = Object.values(metadata._attachments);
      const filename = style === 'legacy' ? 'package@1.0.0.tgz' : 'package-1.0.0.tgz';
      const key = style === 'scoped' ? `@scope/${filename}` : filename;
      metadata._attachments = { [key]: attachment };
      metadata.versions['1.0.0'].dist.tarball = `http://localhost/${pkgName}/-/${filename}`;
      await ctx.publish(metadata).expect(HTTP_STATUS.CREATED);
      await ctx.expectAvailable({ ...metadata, _attachments: { [filename]: attachment } });
    }
  );

  test.each(['prepare', 'partial write', 'rename'] as const)(
    'reports a %s failure, cleans up and characterizes retries',
    async (failure) => {
      const ctx = await fixture(pkgName);
      const previous = ctx.payload('1.0.0');
      await ctx.publish(previous).expect(HTTP_STATUS.CREATED);
      const before = await ctx.readManifest();
      const metadata = ctx.payload('1.0.1');
      const [filename] = Object.keys(metadata._attachments);
      const error = Object.assign(new Error(`injected ${failure} failure`), {
        code: failure === 'partial write' ? 'ENOSPC' : 'EACCES',
      });
      let partialData: Buffer | undefined;
      const originalWrite = ctx.write.getMockImplementation()!;
      if (failure === 'prepare') {
        ctx.write.mockRejectedValueOnce(error);
      } else if (failure === 'partial write') {
        ctx.write.mockImplementationOnce(async function (this: LocalFS, ...args) {
          const destination = (await originalWrite.apply(this, args)) as fs.WriteStream;
          const write = destination._write.bind(destination);
          vi.spyOn(destination, '_write').mockImplementationOnce((chunk, encoding, callback) => {
            const partial = chunk.subarray(0, Math.max(1, Math.floor(chunk.length / 2)));
            write(partial, encoding, (writeError) => {
              if (writeError) return callback(writeError);
              partialData = fs.readFileSync(destination.path);
              callback(error);
            });
          });
          return destination;
        });
      } else {
        const rename = fileUtils.renamePromise;
        vi.spyOn(fileUtils, 'renamePromise').mockImplementation(async (source, target) => {
          if (target === path.join(ctx.packagePath, filename)) throw error;
          return rename(source, target);
        });
      }

      const response = await ctx.publish(metadata).expect(HTTP_STATUS.INTERNAL_ERROR);
      expect(response.body.error).toEqual(expect.any(String));
      expect(response.body.success).toBeUndefined();
      await Promise.all(ctx.completions);
      expect(ctx.destinations.every((destination) => destination.closed)).toBe(true);
      if (failure === 'partial write') {
        const content = Buffer.from(metadata._attachments[filename].data as string, 'base64');
        expect(partialData).toEqual(content.subarray(0, Math.floor(content.length / 2)));
      }
      const saved = await ctx.readManifest();
      expect(saved._attachments).toEqual(before._attachments);
      expect(saved.versions['1.0.0']).toEqual(before.versions['1.0.0']);
      expect((await fsPromises.readdir(ctx.packagePath)).sort()).toEqual(
        ['package.json', ...Object.keys(previous._attachments)].sort()
      );
      await ctx.expectAvailable(previous);

      // Publish still persists the version and tags before uploading (tracked separately).
      expect(saved.versions['1.0.1']).toBeDefined();
      expect(saved['dist-tags'].latest).toBe('1.0.1');
      if (failure === 'rename') vi.mocked(fileUtils.renamePromise).mockRestore();
      const attempts = ctx.write.mock.calls.length;
      await ctx.publish(metadata).expect(HTTP_STATUS.CONFLICT);
      expect(ctx.write).toHaveBeenCalledTimes(attempts);
      expect(await ctx.readManifest()).toEqual(saved);

      const next = ctx.payload('1.0.2');
      const success = await ctx.publish(next).expect(HTTP_STATUS.CREATED);
      expect(success.body.success).toBe(true);
      await ctx.expectAvailable(next);
      await ctx.expectAvailable(previous);
      expect((await ctx.readManifest())['dist-tags'].latest).toBe('1.0.2');
    }
  );

  test.each(['rename', 'attachment metadata'] as const)(
    'waits for %s before responding with success',
    async (phase) => {
      const ctx = await fixture(pkgName);
      const metadata = ctx.payload('1.0.0');
      const [filename] = Object.keys(metadata._attachments);
      const entered = Promise.withResolvers<void>();
      const release = Promise.withResolvers<void>();
      if (phase === 'rename') {
        const rename = fileUtils.renamePromise;
        vi.spyOn(fileUtils, 'renamePromise').mockImplementation(async (source, target) => {
          if (target === path.join(ctx.packagePath, filename)) {
            entered.resolve();
            await release.promise;
          }
          return rename(source, target);
        });
      } else {
        const save = LocalFS.prototype.savePackage;
        vi.spyOn(LocalFS.prototype, 'savePackage').mockImplementation(async function (
          this: LocalFS,
          name,
          data
        ) {
          if (data._attachments[filename]) {
            entered.resolve();
            await release.promise;
          }
          return save.call(this, name, data);
        });
      }
      const completed = vi.fn();
      const request = ctx.publish(metadata).then((response) => {
        completed();
        return response;
      });
      try {
        await Promise.race([
          entered.promise,
          request.then(() => {
            throw new Error('publish completed before reaching the finalization gate');
          }),
        ]);
        await setImmediate();
        expect(completed).not.toHaveBeenCalled();
        expect((await ctx.readManifest())._attachments[filename]).toBeUndefined();
        expect(fs.existsSync(path.join(ctx.packagePath, filename))).toBe(phase !== 'rename');
      } finally {
        release.resolve();
        await request;
      }
      const response = await request;
      expect(response.status).toBe(HTTP_STATUS.CREATED);
      expect(response.body.success).toBe(true);
      expect(completed).toHaveBeenCalledTimes(1);
      await ctx.expectAvailable(metadata);
      expect((await fsPromises.readdir(ctx.packagePath)).sort()).toEqual(
        ['package.json', filename].sort()
      );
    }
  );
});
