import buildDebug from 'debug';
import gunzipMaybe from 'gunzip-maybe';
import { type Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import * as tarStream from 'tar-stream';

import type { TarballDetails } from './getTarballDetails';

const debug = buildDebug('verdaccio:tarball:metadata');

export const DEFAULT_MAX_README_SIZE = 1024 * 1024;

// a README at the package root, e.g. package/README.md; nested ones belong to bundled files
const ROOT_README = /^[^/]+\/readme(\.(md|markdown|txt))?$/i;

export type TarballMetadata = TarballDetails & {
  readme?: string;
};

export type ExtractTarballMetadataOptions = {
  /** Stop with a TarballLimitError once more than this many compressed bytes were read. */
  maxTarballSize?: number;
  /** Stop with a TarballLimitError once the declared unpacked size exceeds this. */
  maxUnpackedSize?: number;
  /** Larger READMEs are counted but not returned. */
  maxReadmeSize?: number;
  readme?: boolean;
  signal?: AbortSignal;
};

export class TarballLimitError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'TarballLimitError';
  }
}

/**
 * Stream a package tarball once and return its file count, unpacked size and root README.
 */
export async function extractTarballMetadata(
  source: Readable,
  options: ExtractTarballMetadataOptions = {}
): Promise<TarballMetadata> {
  const {
    maxTarballSize = Infinity,
    maxUnpackedSize = Infinity,
    maxReadmeSize = DEFAULT_MAX_README_SIZE,
    readme: wantsReadme = true,
    signal,
  } = options;
  let fileCount = 0;
  let unpackedSize = 0;
  let readme: string | undefined;
  let readBytes = 0;
  let limitError: TarballLimitError | undefined;
  const limitController = new AbortController();

  const sizeGuard = new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      readBytes += chunk.length;
      if (readBytes > maxTarballSize) {
        callback(new TarballLimitError(`tarball is larger than ${maxTarballSize} bytes`));
        return;
      }
      callback(null, chunk);
    },
  });

  const extract = tarStream.extract();
  extract.on('entry', (header, stream, next) => {
    fileCount++;
    unpackedSize += Number(header.size ?? 0);
    if (unpackedSize > maxUnpackedSize) {
      // aborting synchronously here throws from inside tar-stream's header parsing
      limitError = new TarballLimitError(`tarball unpacks to more than ${maxUnpackedSize} bytes`);
      stream.resume();
      setImmediate(() => limitController.abort(limitError));
      return;
    }
    const isReadme =
      wantsReadme &&
      readme === undefined &&
      header.type === 'file' &&
      Number(header.size ?? 0) <= maxReadmeSize &&
      ROOT_README.test(header.name);
    if (isReadme) {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk as Buffer);
      });
      stream.on('end', () => {
        readme = Buffer.concat(chunks).toString('utf8');
        debug('readme found at %o', header.name);
        next();
      });
      return;
    }
    stream.on('end', () => next());
    stream.resume();
  });

  const pipelineSignal = signal
    ? AbortSignal.any([signal, limitController.signal])
    : limitController.signal;
  try {
    await pipeline(source, sizeGuard, gunzipMaybe(), extract, { signal: pipelineSignal });
  } catch (err) {
    throw limitError ?? err;
  }
  debug('extracted %o files, %o bytes unpacked', fileCount, unpackedSize);
  return { fileCount, unpackedSize, readme };
}
