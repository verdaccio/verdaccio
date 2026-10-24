import { buffer } from 'node:stream/consumers';
import { gzipSync } from 'node:zlib';
import * as tarStream from 'tar-stream';

/**
 * Build a gzipped package tarball from a map of entry path (e.g. `package/README.md`) to content.
 */
export async function generateTarball(files: Record<string, string>): Promise<Buffer> {
  const pack = tarStream.pack();
  for (const [name, content] of Object.entries(files)) {
    pack.entry({ name }, content);
  }
  pack.finalize();
  // tar-stream's typings omit the async iterator that streamx implements
  return gzipSync(await buffer(pack as unknown as AsyncIterable<Buffer>));
}
