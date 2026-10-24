import { Readable } from 'node:stream';
import { describe, expect, test, vi } from 'vitest';

import { generateTarball } from '@verdaccio/test-helper';
import type { Logger } from '@verdaccio/types';

import { TarballMetadataService } from '../src/tarball-metadata';

const createTarball = (readme: string): Promise<Buffer> =>
  generateTarball({ 'package/package.json': '{"name":"foo"}', 'package/README.md': readme });

function createService(maxSizeMB = 1) {
  const logger = { info: vi.fn(), warn: vi.fn() } as unknown as Logger;
  const onMetadata = vi.fn().mockResolvedValue(undefined);
  const service = new TarballMetadataService({ maxSizeMB, logger, onMetadata });
  return { service, logger, onMetadata };
}

describe('TarballMetadataService', () => {
  test('extracts the README once and serves it from cache afterwards', async () => {
    const tarball = await createTarball('# foo');
    const { service, logger, onMetadata } = createService();
    const source = vi.fn(async () => Readable.from(tarball));

    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBe('# foo');
    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBe('# foo');
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'foo', ms: expect.any(Number), fileCount: 2 }),
      expect.stringContaining('@{ms}ms')
    );

    expect(source).toHaveBeenCalledTimes(1);
    expect(onMetadata).toHaveBeenCalledWith('foo', 'foo-1.0.0.tgz', {
      fileCount: 2,
      unpackedSize: 19,
      readme: '# foo',
    });
  });

  test('shares one extraction between concurrent requests', async () => {
    const tarball = await createTarball('# foo');
    const { service } = createService();
    const source = vi.fn(async () => Readable.from(tarball));

    const readmes = await Promise.all([
      service.getReadme('foo', 'foo-1.0.0.tgz', source),
      service.getReadme('foo', 'foo-1.0.0.tgz', source),
    ]);

    expect(readmes).toEqual(['# foo', '# foo']);
    expect(source).toHaveBeenCalledTimes(1);
  });

  test('scheduled extractions fill the cache in the background', async () => {
    const tarball = await createTarball('# foo');
    const { service, onMetadata } = createService();
    const source = vi.fn(async () => Readable.from(tarball));

    service.schedule('foo', 'foo-1.0.0.tgz', source);
    await vi.waitFor(() => expect(onMetadata).toHaveBeenCalled());

    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBe('# foo');
    expect(source).toHaveBeenCalledTimes(1);
  });

  test('does not unpack a tarball whose announced size exceeds the limit', async () => {
    const { service, onMetadata } = createService(1);
    const stream = new Readable({ read() {} });
    const source = vi.fn(async () => {
      setImmediate(() => stream.emit('content-length', 2 * 1024 * 1024));
      return stream;
    });

    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBeUndefined();
    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBeUndefined();

    expect(source).toHaveBeenCalledTimes(1);
    expect(onMetadata).not.toHaveBeenCalled();
  });

  test('stops reading once the streamed bytes exceed the limit', async () => {
    const { service, logger, onMetadata } = createService(1);
    const source = async () => Readable.from([Buffer.alloc(1024 * 1024), Buffer.alloc(1024)]);

    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBeUndefined();

    expect(onMetadata).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
  });

  test('logs a failed extraction and retries it on the next request', async () => {
    const tarball = await createTarball('# foo');
    const { service, logger } = createService();
    const source = vi
      .fn()
      .mockRejectedValueOnce(new Error('uplink down'))
      .mockImplementation(async () => Readable.from(tarball));

    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBeUndefined();
    expect(logger.warn).toHaveBeenCalledTimes(1);

    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBe('# foo');
  });

  test('remembers tarballs without a README', async () => {
    const tarball = await generateTarball({ 'package/package.json': '{"name":"foo"}' });
    const { service } = createService();
    const source = vi.fn(async () => Readable.from(tarball));

    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBeUndefined();
    await expect(service.getReadme('foo', 'foo-1.0.0.tgz', source)).resolves.toBeUndefined();
    expect(source).toHaveBeenCalledTimes(1);
  });

  test('unpacks at most two tarballs at a time', async () => {
    const tarball = await createTarball('# foo');
    const { service } = createService();
    const releases: (() => void)[] = [];
    let active = 0;
    let peak = 0;
    const source = vi.fn(async () => {
      active++;
      peak = Math.max(peak, active);
      await new Promise<void>((resolve) => releases.push(resolve));
      active--;
      return Readable.from(tarball);
    });

    const pending = ['a', 'b', 'c', 'd'].map((name) =>
      service.getReadme(name, `${name}-1.0.0.tgz`, source)
    );
    await vi.waitFor(() => expect(source).toHaveBeenCalledTimes(2));
    while (source.mock.calls.length < 4 || releases.length > 0) {
      releases.shift()?.();
      await new Promise((resolve) => setImmediate(resolve));
    }

    await expect(Promise.all(pending)).resolves.toEqual(['# foo', '# foo', '# foo', '# foo']);
    expect(peak).toBe(2);
  });
});
