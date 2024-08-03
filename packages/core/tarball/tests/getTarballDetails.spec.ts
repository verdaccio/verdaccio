import fs from 'fs';
import path from 'path';
import { describe, expect, test } from 'vitest';

import { getTarballDetails } from '../src/getTarballDetails.ts';

const getFilePath = (filename: string): string => {
  return path.resolve(__dirname, `assets/${filename}`);
};

const getFileBuffer = async (filename: string): Promise<Buffer> => {
  return fs.promises.readFile(getFilePath(filename));
};

describe('getTarballDetails', () => {
  test('should return stats of tarball (gzipped)', async () => {
    const buffer = await getFileBuffer('tarball.tgz');
    const details = await getTarballDetails(buffer);
    expect(details.fileCount).toBe(2);
    expect(details.unpackedSize).toBe(1280);
  });

  test('should return stats of tarball (uncompressed)', async () => {
    const buffer = await getFileBuffer('tarball.tar');
    const details = await getTarballDetails(buffer);
    expect(details.fileCount).toBe(2);
    expect(details.unpackedSize).toBe(1280);
  });

  test('should throw an error if the buffer is corrupt', async () => {
    const corruptBuffer = Buffer.from('this is not a tarball');
    await expect(getTarballDetails(corruptBuffer)).rejects.toThrow();
  });
});
