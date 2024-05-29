import gunzipMaybe from 'gunzip-maybe';
import { Readable } from 'stream';
import * as tarStream from 'tar-stream';

export type TarballDetails = {
  fileCount: number;
  unpackedSize: number; // in bytes
};

export async function getTarballDetails(buffer: Buffer): Promise<TarballDetails> {
  let fileCount = 0;
  let unpackedSize = 0;
  const readable = Readable.from(buffer);
  const unpack = tarStream.extract();

  return new Promise((resolve, reject) => {
    readable
      .pipe(gunzipMaybe())
      .pipe(unpack)
      .on('entry', (header, stream, next) => {
        fileCount++;
        unpackedSize += Number(header.size);
        stream.resume(); // important to ensure that "entry" events keep firing
        next();
      })
      .on('finish', () => {
        resolve({
          fileCount,
          unpackedSize,
        });
      })
      .on('error', reject);
  });
}
