import { Readable } from 'node:stream';

import { extractTarballMetadata } from './extractTarballMetadata';

export type TarballDetails = {
  fileCount: number;
  unpackedSize: number; // in bytes
};

export async function getTarballDetails(buffer: Buffer): Promise<TarballDetails> {
  const { fileCount, unpackedSize } = await extractTarballMetadata(Readable.from(buffer), {
    readme: false,
  });
  return { fileCount, unpackedSize };
}
