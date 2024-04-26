import { Readable } from 'stream';
import * as tar from 'tar';

export type TarballDetails = {
  fileCount: number;
  unpackedSize: number; // in bytes
};

export async function getTarballDetails(readable: Readable): Promise<TarballDetails> {
  const extractor = tar.extract({ gzip: true });

  let fileCount = 0;
  let unpackedSize = 0;

  return new Promise((resolve, reject) => {
    readable
      .pipe(extractor)
      .on('entry', (entry) => {
        fileCount++;
        unpackedSize += entry.size;
      })
      .on('end', () => {
        resolve({
          fileCount,
          unpackedSize,
        });
      })
      .on('error', reject);
  });
}
