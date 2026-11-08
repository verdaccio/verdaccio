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

  test('rejects inflated zero blocks that declare no entries', async () => {
    const zeroBlocks = Buffer.alloc(4 * 1024 * 1024);
    await expect(
      extractTarballMetadata(Readable.from(gzipSync(zeroBlocks)), { maxUnpackedSize: 1024 * 1024 })
    ).rejects.toBeInstanceOf(TarballLimitError);
  });

  test('rejects nested gzip that inflates past maxUnpackedSize', async () => {
    const zeroBlocks = Buffer.alloc(4 * 1024 * 1024);
    await expect(
      extractTarballMetadata(Readable.from(gzipSync(gzipSync(zeroBlocks))), {
        maxTarballSize: 1024,
        maxUnpackedSize: 1024 * 1024,
      })
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

  test('rejects a truncated tar without leaking an unhandled error', async () => {
    const tar = await createTar([{ name: 'package/big.bin', content: 'x'.repeat(4096) }]);
    await expect(
      extractTarballMetadata(Readable.from(tar.subarray(0, 512 + 2048)))
    ).rejects.toThrow('Unexpected end of data');
  });

  test('rejects a declared entry size above maxUnpackedSize before reading its content', async () => {
    const tar = await createTar([{ name: 'package/big.bin', content: 'x'.repeat(4096) }]);
    const headerOnly = tar.subarray(0, 512);
    await expect(
      extractTarballMetadata(Readable.from(headerOnly), { maxUnpackedSize: 1024 })
    ).rejects.toThrow(new TarballLimitError('tarball unpacks to more than 1024 bytes'));
  });

  test('accepts a tar that inflates to exactly maxUnpackedSize', async () => {
    const tar = await createTar(files);
    const tarball = gzipSync(tar);
    await expect(
      extractTarballMetadata(Readable.from(tarball), { maxUnpackedSize: tar.length })
    ).resolves.toMatchObject({ fileCount: 4 });
    await expect(
      extractTarballMetadata(Readable.from(tarball), { maxUnpackedSize: tar.length - 1 })
    ).rejects.toBeInstanceOf(TarballLimitError);
  });

  test('matches README names regardless of case', async () => {
    const tarball = await createTarball([{ name: 'package/Readme.TXT', content: 'shouting' }]);
    const metadata = await extractTarballMetadata(Readable.from(tarball));
    expect(metadata.readme).toBe('shouting');
  });

  test('returns a README of exactly maxReadmeSize bytes', async () => {
    const tarball = await createTarball([{ name: 'package/README.md', content: 'abcde' }]);
    const exact = await extractTarballMetadata(Readable.from(tarball), { maxReadmeSize: 5 });
    expect(exact.readme).toBe('abcde');
    const over = await extractTarballMetadata(Readable.from(tarball), { maxReadmeSize: 4 });
    expect(over.readme).toBeUndefined();
    expect(over.fileCount).toBe(1);
  });

  test('decodes a multi-byte README delivered in small chunks', async () => {
    const readme = '# ñandú 🦤\n'.repeat(40);
    const tar = await createTar([{ name: 'package/README.md', content: readme }]);
    const chunks = Array.from({ length: Math.ceil(tar.length / 7) }, (_, i) =>
      tar.subarray(i * 7, (i + 1) * 7)
    );
    const metadata = await extractTarballMetadata(Readable.from(chunks));
    expect(metadata.readme).toBe(readme);
    expect(metadata.unpackedSize).toBe(Buffer.byteLength(readme));
  });
});
