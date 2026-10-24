import { Readable } from 'node:stream';
import { gzipSync } from 'node:zlib';
import * as tarStream from 'tar-stream';
import { describe, expect, test } from 'vitest';

import { TarballLimitError, extractTarballMetadata } from '../src/extractTarballMetadata.ts';

type Entry = { name: string; content: string | null };

async function createTar(entries: Entry[]): Promise<Buffer> {
  const pack = tarStream.pack();
  for (const entry of entries) {
    if (entry.content === null) {
      pack.entry({ name: entry.name, type: 'directory' });
    } else {
      pack.entry({ name: entry.name }, entry.content);
    }
  }
  pack.finalize();
  const chunks: Buffer[] = [];
  for await (const chunk of pack) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

const createTarball = async (entries: Entry[]): Promise<Buffer> =>
  gzipSync(await createTar(entries));

const files: Entry[] = [
  { name: 'package/package.json', content: '{"name":"foo"}' },
  { name: 'package/lib/README.md', content: '# bundled dependency' },
  { name: 'package/index.js', content: 'module.exports = 1;' },
  { name: 'package/README.md', content: '# foo\n\nthe readme' },
];

describe('extractTarballMetadata', () => {
  test('returns file count, unpacked size and the root README', async () => {
    const tarball = await createTarball(files);
    const metadata = await extractTarballMetadata(Readable.from(tarball));
    expect(metadata).toEqual({
      fileCount: 4,
      unpackedSize: files.reduce((size, file) => size + Buffer.byteLength(file.content ?? ''), 0),
      readme: '# foo\n\nthe readme',
    });
  });

  test('accepts README names without the .md extension', async () => {
    const tarball = await createTarball([{ name: 'package/readme', content: 'plain readme' }]);
    const metadata = await extractTarballMetadata(Readable.from(tarball));
    expect(metadata.readme).toBe('plain readme');
  });

  test('ignores README files outside the package root', async () => {
    const tarball = await createTarball([
      { name: 'package/index.js', content: '' },
      { name: 'package/docs/README.md', content: '# docs' },
    ]);
    const metadata = await extractTarballMetadata(Readable.from(tarball));
    expect(metadata.fileCount).toBe(2);
    expect(metadata.readme).toBeUndefined();
  });

  test('skips a README larger than maxReadmeSize but still counts it', async () => {
    const tarball = await createTarball(files);
    const metadata = await extractTarballMetadata(Readable.from(tarball), { maxReadmeSize: 4 });
    expect(metadata.fileCount).toBe(4);
    expect(metadata.readme).toBeUndefined();
  });

  test('does not read the README when readme is false', async () => {
    const tarball = await createTarball(files);
    const metadata = await extractTarballMetadata(Readable.from(tarball), { readme: false });
    expect(metadata.readme).toBeUndefined();
  });

  test('rejects with TarballLimitError above maxTarballSize', async () => {
    const tarball = await createTarball(files);
    await expect(
      extractTarballMetadata(Readable.from(tarball), { maxTarballSize: tarball.length - 1 })
    ).rejects.toBeInstanceOf(TarballLimitError);
  });

  test('rejects with TarballLimitError above maxUnpackedSize', async () => {
    const tarball = await createTarball(files);
    await expect(
      extractTarballMetadata(Readable.from(tarball), { maxUnpackedSize: 20 })
    ).rejects.toBeInstanceOf(TarballLimitError);
  });

  test('reads an uncompressed tar', async () => {
    const tar = await createTar(files);
    const metadata = await extractTarballMetadata(Readable.from(tar));
    expect(metadata.fileCount).toBe(4);
    expect(metadata.readme).toBe('# foo\n\nthe readme');
  });

  test('accepts README.markdown', async () => {
    const tarball = await createTarball([{ name: 'package/README.markdown', content: '# md' }]);
    const metadata = await extractTarballMetadata(Readable.from(tarball));
    expect(metadata.readme).toBe('# md');
  });

  test('ignores a directory named README and keeps the first README file', async () => {
    const tarball = await createTarball([
      { name: 'package/readme', content: null },
      { name: 'package/README.md', content: 'first' },
      { name: 'package/README.txt', content: 'second' },
    ]);
    const metadata = await extractTarballMetadata(Readable.from(tarball));
    expect(metadata.readme).toBe('first');
  });

  test('stops when the caller aborts', async () => {
    const tarball = await createTarball(files);
    const controller = new AbortController();
    controller.abort(new Error('client went away'));
    await expect(
      extractTarballMetadata(Readable.from(tarball), { signal: controller.signal })
    ).rejects.toThrow();
  });

  test('rejects a corrupt tarball', async () => {
    await expect(
      extractTarballMetadata(Readable.from(Buffer.from('this is not a tarball')))
    ).rejects.toThrow();
  });
});
